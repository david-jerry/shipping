import { relations } from "drizzle-orm"
import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"

import { user } from "./auth"

export const newsletterCampaignStatus = pgEnum("newsletter_campaign_status", [
    "scheduled",
    "sending",
    "sent",
    "failed",
])

export const newsletterDeliveryStatus = pgEnum("newsletter_delivery_status", [
    "sent",
    "failed",
])

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    name: varchar("name", { length: 120 }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    isActive: boolean("is_active").default(true).notNull(),
    subscribedAt: timestamp("subscribed_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const newsletterCampaigns = pgTable("newsletter_campaigns", {
    id: uuid("id").defaultRandom().primaryKey(),
    subject: varchar("subject", { length: 200 }).notNull(),
    body: text("body").notNull(),
    discountCode: varchar("discount_code", { length: 80 }),
    ctaUrl: varchar("cta_url", { length: 500 }),
    status: newsletterCampaignStatus("status").default("scheduled").notNull(),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    totalRecipients: integer("total_recipients").default(0).notNull(),
    sentCount: integer("sent_count").default(0).notNull(),
    failedCount: integer("failed_count").default(0).notNull(),
    createdByUserId: text("created_by_user_id").references(() => user.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const newsletterCampaignDeliveries = pgTable("newsletter_campaign_deliveries", {
    id: uuid("id").defaultRandom().primaryKey(),
    campaignId: uuid("campaign_id")
        .notNull()
        .references(() => newsletterCampaigns.id, { onDelete: "cascade" }),
    subscriberId: uuid("subscriber_id").references(() => newsletterSubscribers.id, {
        onDelete: "set null",
    }),
    recipientEmail: varchar("recipient_email", { length: 320 }).notNull(),
    status: newsletterDeliveryStatus("status").notNull(),
    errorMessage: text("error_message"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const newsletterSubscribersRelations = relations(
    newsletterSubscribers,
    ({ one, many }) => ({
        user: one(user, {
            fields: [newsletterSubscribers.userId],
            references: [user.id],
        }),
        campaignDeliveries: many(newsletterCampaignDeliveries),
    })
)

export const newsletterCampaignsRelations = relations(
    newsletterCampaigns,
    ({ one, many }) => ({
        createdByUser: one(user, {
            fields: [newsletterCampaigns.createdByUserId],
            references: [user.id],
        }),
        deliveries: many(newsletterCampaignDeliveries),
    })
)

export const newsletterCampaignDeliveriesRelations = relations(
    newsletterCampaignDeliveries,
    ({ one }) => ({
        campaign: one(newsletterCampaigns, {
            fields: [newsletterCampaignDeliveries.campaignId],
            references: [newsletterCampaigns.id],
        }),
        subscriber: one(newsletterSubscribers, {
            fields: [newsletterCampaignDeliveries.subscriberId],
            references: [newsletterSubscribers.id],
        }),
    })
)
