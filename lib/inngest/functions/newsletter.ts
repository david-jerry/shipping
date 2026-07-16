import { eq } from "drizzle-orm"

import {
    newsletterCampaignDeliveries,
    newsletterCampaigns,
    newsletterSubscribers,
} from "@/drizzle/schema/newsletter"
import { db } from "@/lib/db"
import { inngest } from "@/lib/inngest/client"
import { sendEmail } from "@/lib/messaging"
import { buildNewsletterEmailHtml, buildNewsletterEmailText } from "@/lib/newsletter-email"

type NewsletterCampaignSendEvent = {
    data: {
        campaignId: string
        scheduledFor?: string | null
    }
}

export const newsletterCampaignSendFunction = inngest.createFunction(
    {
        id: "newsletter-campaign-send",
        triggers: [{ event: "newsletter/campaign.send" }],
    },
    async ({ event, step }) => {
        const payload = (event as unknown as NewsletterCampaignSendEvent).data

        if (payload.scheduledFor) {
            const scheduledDate = new Date(payload.scheduledFor)
            if (!Number.isNaN(scheduledDate.getTime()) && scheduledDate.getTime() > Date.now()) {
                await step.sleepUntil("wait-until-scheduled-time", scheduledDate)
            }
        }

        const campaign = await step.run("load-campaign", async () => {
            const [row] = await db
                .select({
                    id: newsletterCampaigns.id,
                    subject: newsletterCampaigns.subject,
                    body: newsletterCampaigns.body,
                    discountCode: newsletterCampaigns.discountCode,
                    ctaUrl: newsletterCampaigns.ctaUrl,
                    status: newsletterCampaigns.status,
                })
                .from(newsletterCampaigns)
                .where(eq(newsletterCampaigns.id, payload.campaignId))
                .limit(1)

            return row ?? null
        })

        if (!campaign) {
            return { success: false, reason: "campaign_not_found" }
        }

        if (campaign.status === "sent") {
            return { success: true, skipped: true, reason: "already_sent" }
        }

        await step.run("mark-campaign-sending", async () => {
            await db
                .update(newsletterCampaigns)
                .set({ status: "sending", updatedAt: new Date() })
                .where(eq(newsletterCampaigns.id, payload.campaignId))
        })

        const subscribers = await step.run("load-active-subscribers", async () => {
            return db
                .select({
                    id: newsletterSubscribers.id,
                    email: newsletterSubscribers.email,
                    name: newsletterSubscribers.name,
                })
                .from(newsletterSubscribers)
                .where(eq(newsletterSubscribers.isActive, true))
        })

        type SubscriberRow = {
            id: string
            email: string
            name: string | null
        }

        const typedSubscribers = subscribers as SubscriberRow[]

        const results = await step.run("send-bulk-newsletter", async () => {
            return Promise.allSettled(
                typedSubscribers.map((subscriber) =>
                    sendEmail({
                        to: subscriber.email,
                        subject: campaign.subject,
                        html: buildNewsletterEmailHtml({
                            recipientName: subscriber.name,
                            subject: campaign.subject,
                            messageHtml: campaign.body,
                            discountCode: campaign.discountCode,
                            ctaUrl: campaign.ctaUrl,
                        }),
                        text: buildNewsletterEmailText({
                            recipientName: subscriber.name,
                            subject: campaign.subject,
                            messageHtml: campaign.body,
                            discountCode: campaign.discountCode,
                            ctaUrl: campaign.ctaUrl,
                        }),
                    })
                )
            )
        })

        const sentCount = results.filter((result) => result.status === "fulfilled").length
        const failedCount = results.length - sentCount

        await step.run("store-recipient-audit-logs", async () => {
            await db
                .delete(newsletterCampaignDeliveries)
                .where(eq(newsletterCampaignDeliveries.campaignId, payload.campaignId))

            if (typedSubscribers.length === 0) {
                return
            }

            const deliveryRows = typedSubscribers.map((subscriber, index: number) => {
                const result = results[index]
                const isSent = result?.status === "fulfilled"
                const deliveryStatus: "sent" | "failed" = isSent ? "sent" : "failed"
                const errorMessage =
                    result?.status === "rejected"
                        ? result.reason instanceof Error
                            ? result.reason.message
                            : String(result.reason)
                        : null

                return {
                    campaignId: payload.campaignId,
                    subscriberId: subscriber.id,
                    recipientEmail: subscriber.email,
                    status: deliveryStatus,
                    errorMessage,
                    sentAt: isSent ? new Date() : null,
                    createdAt: new Date(),
                }
            })

            await db.insert(newsletterCampaignDeliveries).values(deliveryRows)
        })

        await step.run("mark-campaign-finished", async () => {
            await db
                .update(newsletterCampaigns)
                .set({
                    status: failedCount > 0 ? "failed" : "sent",
                    sentAt: new Date(),
                    sentCount,
                    failedCount,
                    totalRecipients: typedSubscribers.length,
                    updatedAt: new Date(),
                })
                .where(eq(newsletterCampaigns.id, payload.campaignId))
        })

        return {
            success: true,
            campaignId: payload.campaignId,
            recipients: typedSubscribers.length,
            sentCount,
            failedCount,
        }
    }
)
