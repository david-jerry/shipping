"use server"

import { and, desc, eq, ilike } from "drizzle-orm"
import { headers } from "next/headers"

import { user } from "@/drizzle/schema/auth"
import {
    newsletterCampaignDeliveries,
    newsletterCampaigns,
    newsletterSubscribers,
} from "@/drizzle/schema/newsletter"
import { roles, userRoles } from "@/drizzle/schema/roles"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { inngest } from "@/lib/inngest/client"

type SubscribeInput = {
    email: string
    name?: string
}

type NewsletterCampaignInput = {
    subject: string
    message: string
    discountCode?: string
    ctaUrl?: string
}

type ScheduleNewsletterCampaignInput = NewsletterCampaignInput & {
    scheduledFor: string
}

type NewsletterContentCreateInput = NewsletterCampaignInput & {
    scheduledFor?: string
}

type NewsletterContentUpdateInput = NewsletterContentCreateInput & {
    campaignId: string
}

type NewsletterContentDeleteInput = {
    campaignId: string
}

type NewsletterAdminData = {
    subscribers: Array<{
        id: string
        email: string
        name: string | null
        isActive: boolean
        subscribedAt: string
    }>
    campaigns: Array<{
        id: string
        subject: string
        body: string
        discountCode: string | null
        ctaUrl: string | null
        status: string
        scheduledFor: string | null
        sentAt: string | null
        totalRecipients: number
        sentCount: number
        failedCount: number
        createdAt: string
    }>
    deliveryLogs: Array<{
        id: string
        campaignId: string
        campaignSubject: string
        recipientEmail: string
        status: "sent" | "failed"
        errorMessage: string | null
        sentAt: string | null
        createdAt: string
    }>
}

async function requireAdminUserId() {
    const authSession = await auth.api.getSession({
        headers: await headers(),
    })

    if (!authSession?.user?.id) {
        throw new Error("Unauthorized")
    }

    const [adminRole] = await db
        .select({ roleId: userRoles.roleId })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .where(and(eq(userRoles.userId, authSession.user.id), ilike(roles.name, "admin")))
        .limit(1)

    if (!adminRole) {
        throw new Error("Forbidden")
    }

    return authSession.user.id
}

function sanitizeCampaignInput(input: NewsletterCampaignInput) {
    const subject = input.subject.trim()
    const message = input.message.trim()
    const discountCode = input.discountCode?.trim() || null
    const ctaUrl = input.ctaUrl?.trim() || null

    if (!subject || !message) {
        throw new Error("Subject and message are required")
    }

    return {
        subject,
        message,
        discountCode,
        ctaUrl,
    }
}

async function getActiveSubscribers() {
    return db
        .select({
            id: newsletterSubscribers.id,
            email: newsletterSubscribers.email,
            name: newsletterSubscribers.name,
        })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.isActive, true))
}

function parseOptionalScheduledFor(value?: string) {
    if (!value?.trim()) {
        return null
    }

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
        throw new Error("Invalid scheduled date")
    }

    return parsed
}

async function assertCampaignEditable(campaignId: string) {
    const [campaign] = await db
        .select({
            id: newsletterCampaigns.id,
            status: newsletterCampaigns.status,
        })
        .from(newsletterCampaigns)
        .where(eq(newsletterCampaigns.id, campaignId))
        .limit(1)

    if (!campaign) {
        throw new Error("Campaign not found")
    }

    if (campaign.status === "sending") {
        throw new Error("Campaign is currently sending and cannot be modified")
    }

    if (campaign.status === "sent") {
        throw new Error("Sent campaigns cannot be modified")
    }
}

export async function addNewsletterContentByAdminAction(
    input: NewsletterContentCreateInput
) {
    const adminUserId = await requireAdminUserId()
    const payload = sanitizeCampaignInput(input)
    const scheduledFor = parseOptionalScheduledFor(input.scheduledFor)
    const subscribers = await getActiveSubscribers()

    const [created] = await db
        .insert(newsletterCampaigns)
        .values({
            subject: payload.subject,
            body: payload.message,
            discountCode: payload.discountCode,
            ctaUrl: payload.ctaUrl,
            status: "scheduled",
            scheduledFor,
            totalRecipients: subscribers.length,
            createdByUserId: adminUserId,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .returning({ id: newsletterCampaigns.id })

    if (!created) {
        throw new Error("Could not create newsletter content")
    }

    return {
        success: true,
        campaignId: created.id,
    }
}

export async function editNewsletterContentByAdminAction(
    input: NewsletterContentUpdateInput
) {
    await requireAdminUserId()
    await assertCampaignEditable(input.campaignId)

    const payload = sanitizeCampaignInput(input)
    const scheduledFor = parseOptionalScheduledFor(input.scheduledFor)
    const subscribers = await getActiveSubscribers()

    await db
        .update(newsletterCampaigns)
        .set({
            subject: payload.subject,
            body: payload.message,
            discountCode: payload.discountCode,
            ctaUrl: payload.ctaUrl,
            scheduledFor,
            totalRecipients: subscribers.length,
            updatedAt: new Date(),
        })
        .where(eq(newsletterCampaigns.id, input.campaignId))

    return {
        success: true,
        campaignId: input.campaignId,
    }
}

export async function deleteNewsletterContentByAdminAction(
    input: NewsletterContentDeleteInput
) {
    await requireAdminUserId()
    await assertCampaignEditable(input.campaignId)

    await db
        .delete(newsletterCampaigns)
        .where(eq(newsletterCampaigns.id, input.campaignId))

    return {
        success: true,
        campaignId: input.campaignId,
    }
}

export async function upsertNewsletterSubscriberByAdminAction(
    input: SubscribeInput
) {
    await requireAdminUserId()

    const email = input.email.trim().toLowerCase()
    const name = input.name?.trim() || null

    if (!email) {
        throw new Error("Email is required")
    }

    const [existing] = await db
        .select({ id: newsletterSubscribers.id })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, email))
        .limit(1)

    if (existing) {
        await db
            .update(newsletterSubscribers)
            .set({
                name,
                isActive: true,
                unsubscribedAt: null,
                updatedAt: new Date(),
            })
            .where(eq(newsletterSubscribers.id, existing.id))

        return { success: true, id: existing.id, existed: true }
    }

    const [linkedUser] = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, email))
        .limit(1)

    const [created] = await db
        .insert(newsletterSubscribers)
        .values({
            email,
            name,
            userId: linkedUser?.id ?? null,
            isActive: true,
            subscribedAt: new Date(),
            updatedAt: new Date(),
        })
        .returning({ id: newsletterSubscribers.id })

    return { success: true, id: created.id, existed: false }
}

export async function getNewsletterAdminDataAction(): Promise<NewsletterAdminData> {
    await requireAdminUserId()

    const [subscribersRows, campaignsRows, deliveryRows] = await Promise.all([
        db
            .select({
                id: newsletterSubscribers.id,
                email: newsletterSubscribers.email,
                name: newsletterSubscribers.name,
                isActive: newsletterSubscribers.isActive,
                subscribedAt: newsletterSubscribers.subscribedAt,
            })
            .from(newsletterSubscribers)
            .orderBy(desc(newsletterSubscribers.subscribedAt))
            .limit(200),
        db
            .select({
                id: newsletterCampaigns.id,
                subject: newsletterCampaigns.subject,
                body: newsletterCampaigns.body,
                discountCode: newsletterCampaigns.discountCode,
                ctaUrl: newsletterCampaigns.ctaUrl,
                status: newsletterCampaigns.status,
                scheduledFor: newsletterCampaigns.scheduledFor,
                sentAt: newsletterCampaigns.sentAt,
                totalRecipients: newsletterCampaigns.totalRecipients,
                sentCount: newsletterCampaigns.sentCount,
                failedCount: newsletterCampaigns.failedCount,
                createdAt: newsletterCampaigns.createdAt,
            })
            .from(newsletterCampaigns)
            .orderBy(desc(newsletterCampaigns.createdAt))
            .limit(50),
        db
            .select({
                id: newsletterCampaignDeliveries.id,
                campaignId: newsletterCampaignDeliveries.campaignId,
                campaignSubject: newsletterCampaigns.subject,
                recipientEmail: newsletterCampaignDeliveries.recipientEmail,
                status: newsletterCampaignDeliveries.status,
                errorMessage: newsletterCampaignDeliveries.errorMessage,
                sentAt: newsletterCampaignDeliveries.sentAt,
                createdAt: newsletterCampaignDeliveries.createdAt,
            })
            .from(newsletterCampaignDeliveries)
            .innerJoin(
                newsletterCampaigns,
                eq(newsletterCampaignDeliveries.campaignId, newsletterCampaigns.id)
            )
            .orderBy(desc(newsletterCampaignDeliveries.createdAt))
            .limit(300),
    ])

    return {
        subscribers: subscribersRows.map((row) => ({
            id: row.id,
            email: row.email,
            name: row.name,
            isActive: row.isActive,
            subscribedAt: row.subscribedAt.toISOString(),
        })),
        campaigns: campaignsRows.map((row) => ({
            id: row.id,
            subject: row.subject,
            body: row.body,
            discountCode: row.discountCode,
            ctaUrl: row.ctaUrl,
            status: row.status,
            scheduledFor: row.scheduledFor ? row.scheduledFor.toISOString() : null,
            sentAt: row.sentAt ? row.sentAt.toISOString() : null,
            totalRecipients: row.totalRecipients,
            sentCount: row.sentCount,
            failedCount: row.failedCount,
            createdAt: row.createdAt.toISOString(),
        })),
        deliveryLogs: deliveryRows.map((row) => ({
            id: row.id,
            campaignId: row.campaignId,
            campaignSubject: row.campaignSubject,
            recipientEmail: row.recipientEmail,
            status: row.status,
            errorMessage: row.errorMessage,
            sentAt: row.sentAt ? row.sentAt.toISOString() : null,
            createdAt: row.createdAt.toISOString(),
        })),
    }
}

export async function sendNewsletterCampaignNowByAdminAction(
    input: NewsletterCampaignInput
) {
    const adminUserId = await requireAdminUserId()
    const payload = sanitizeCampaignInput(input)

    const subscribers = await getActiveSubscribers()

    const [campaign] = await db
        .insert(newsletterCampaigns)
        .values({
            subject: payload.subject,
            body: payload.message,
            discountCode: payload.discountCode,
            ctaUrl: payload.ctaUrl,
            status: "scheduled",
            totalRecipients: subscribers.length,
            createdByUserId: adminUserId,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .returning({ id: newsletterCampaigns.id })

    if (!campaign) {
        throw new Error("Could not create campaign")
    }

    await inngest.send({
        name: "newsletter/campaign.send",
        data: {
            campaignId: campaign.id,
            scheduledFor: null,
        },
    })

    return {
        success: true,
        campaignId: campaign.id,
        recipients: subscribers.length,
        sentCount: 0,
        failedCount: 0,
        queued: true,
    }
}

export async function scheduleNewsletterCampaignByAdminAction(
    input: ScheduleNewsletterCampaignInput
) {
    const adminUserId = await requireAdminUserId()
    const payload = sanitizeCampaignInput(input)

    const scheduledFor = new Date(input.scheduledFor)
    if (Number.isNaN(scheduledFor.getTime())) {
        throw new Error("Invalid scheduled date")
    }

    const subscribers = await getActiveSubscribers()

    const [campaign] = await db
        .insert(newsletterCampaigns)
        .values({
            subject: payload.subject,
            body: payload.message,
            discountCode: payload.discountCode,
            ctaUrl: payload.ctaUrl,
            status: "scheduled",
            scheduledFor,
            totalRecipients: subscribers.length,
            createdByUserId: adminUserId,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .returning({
            id: newsletterCampaigns.id,
            scheduledFor: newsletterCampaigns.scheduledFor,
        })

    if (!campaign) {
        throw new Error("Could not schedule campaign")
    }

    await inngest.send({
        name: "newsletter/campaign.send",
        data: {
            campaignId: campaign.id,
            scheduledFor: campaign.scheduledFor?.toISOString() ?? null,
        },
    })

    return {
        success: true,
        campaignId: campaign.id,
        scheduledFor: campaign.scheduledFor?.toISOString() ?? null,
        recipients: subscribers.length,
    }
}
