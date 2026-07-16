import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const emailTemplateType = pgEnum("email_template_type", [
    "register_verification",
    "password_reset",
]);

export const emailTemplates = pgTable("email_templates", {
    id: text("id").primaryKey(),
    templateType: emailTemplateType("template_type").notNull().unique(),
    subject: text("subject").notNull(),
    htmlBody: text("html_body").notNull(),
    textBody: text("text_body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
