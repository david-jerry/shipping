import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import {
    boolean,
    doublePrecision,
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    unique,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";

import { user } from "./auth";

export const deliveryStatus = pgEnum("delivery_status", [
    "pending",
    "assigned",
    "in_transit",
    "delivered",
    "failed",
    "cancelled",
]);

export const deliveries = pgTable(
    "deliveries",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        trackingNumber: varchar("tracking_number", { length: 64 }).notNull().unique(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        status: deliveryStatus("status").default("pending").notNull(),
        pickupAddress: text("pickup_address").notNull(),
        dropoffAddress: text("dropoff_address").notNull(),
        scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
        deliveredAt: timestamp("delivered_at", { withTimezone: true }),
        notes: text("notes"),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
        index("deliveries_user_updated_idx").on(table.userId, table.updatedAt),
        index("deliveries_status_updated_idx").on(table.status, table.updatedAt),
    ]
);

export const deliveryRoutes = pgTable(
    "delivery_routes",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        deliveryId: uuid("delivery_id")
            .notNull()
            .references(() => deliveries.id, { onDelete: "cascade" }),
        sequence: integer("sequence").notNull(),
        streetAddress: text("street_address").notNull(),
        country: varchar("country", { length: 100 }).notNull(),
        latitude: doublePrecision("latitude"),
        longitude: doublePrecision("longitude"),
        isCurrentLocation: boolean("is_current_location").default(false).notNull(),
        transitNote: text("transit_note"),
        reachedAt: timestamp("reached_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
        unique("delivery_routes_delivery_sequence_unique").on(
            table.deliveryId,
            table.sequence
        ),
        uniqueIndex("delivery_routes_current_unique")
            .on(table.deliveryId)
            .where(sql`${table.isCurrentLocation} = true`),
        index("delivery_routes_delivery_reached_idx").on(
            table.deliveryId,
            table.reachedAt
        ),
    ]
);

export const deliveriesRelations = relations(deliveries, ({ one, many }) => ({
    user: one(user, {
        fields: [deliveries.userId],
        references: [user.id],
    }),
    routes: many(deliveryRoutes),
}));

export const deliveryRoutesRelations = relations(deliveryRoutes, ({ one }) => ({
    delivery: one(deliveries, {
        fields: [deliveryRoutes.deliveryId],
        references: [deliveries.id],
    }),
}));

const deliveriesInsertSchema = createInsertSchema(deliveries, {
    trackingNumber: (schema) => schema.min(4).max(64),
    userId: (schema) => schema.min(1),
    pickupAddress: (schema) => schema.min(3),
    dropoffAddress: (schema) => schema.min(3),
    notes: (schema) => schema.max(1_000).optional(),
});

export const createDeliveryByAdminSchema = deliveriesInsertSchema.pick({
    trackingNumber: true,
    userId: true,
    status: true,
    pickupAddress: true,
    dropoffAddress: true,
    notes: true,
});

export const updateDeliveryRouteByAdminSchema = deliveriesInsertSchema
    .pick({
        pickupAddress: true,
        dropoffAddress: true,
        notes: true,
    })
    .extend({
        deliveryId: z.uuid(),
    });

const deliveryRouteInsertSchema = createInsertSchema(deliveryRoutes, {
    streetAddress: (schema) => schema.min(3),
    country: (schema) => schema.min(2),
    transitNote: (schema) => schema.max(1_000).optional(),
});

export const createDeliveryLocationByAdminSchema = deliveryRouteInsertSchema
    .pick({
        deliveryId: true,
        streetAddress: true,
        country: true,
        transitNote: true,
        reachedAt: true,
        isCurrentLocation: true,
    })
    .extend({
        reachedAt: z.coerce.date().optional().nullable(),
    });

export const updateDeliveryLocationByAdminSchema = createDeliveryLocationByAdminSchema
    .omit({ deliveryId: true })
    .extend({
        locationId: z.uuid(),
    });

export const deleteDeliveryLocationByAdminSchema = z.object({
    locationId: z.uuid(),
});
