import { eq } from "drizzle-orm";

import { emailTemplates } from "@/drizzle/schema/email-templates";
import { db } from "@/lib/db";
import { renderDefaultEmailTemplate } from "@/lib/email-template-react";

export type EmailTemplateKey = "register_verification" | "password_reset";

export type EmailTemplateData = {
    subject: string;
    htmlBody: string;
    textBody: string;
};

function fillTemplate(template: string, values: Record<string, string>) {
    return Object.entries(values).reduce(
        (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, value),
        template,
    );
}

export async function getEmailTemplate(
    key: EmailTemplateKey,
    values: Record<string, string>,
): Promise<EmailTemplateData> {
    const defaultTemplate = await renderDefaultEmailTemplate(key, values);

    try {
        const rows = await db
            .select({
                subject: emailTemplates.subject,
                htmlBody: emailTemplates.htmlBody,
                textBody: emailTemplates.textBody,
            })
            .from(emailTemplates)
            .where(eq(emailTemplates.templateType, key))
            .limit(1);

        const template = rows[0];

        if (!template) {
            return defaultTemplate;
        }

        return {
            subject: fillTemplate(template.subject, values),
            htmlBody: fillTemplate(template.htmlBody, values),
            textBody: fillTemplate(template.textBody, values),
        };
    } catch {
        return defaultTemplate;
    }
}
