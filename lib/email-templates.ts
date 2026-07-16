import { eq } from "drizzle-orm";

import { emailTemplates } from "@/drizzle/schema/email-templates";
import { db } from "@/lib/db";

export type EmailTemplateKey = "register_verification" | "password_reset";

type EmailTemplateData = {
    subject: string;
    htmlBody: string;
    textBody: string;
};

const defaultTemplates: Record<EmailTemplateKey, EmailTemplateData> = {
    register_verification: {
        subject: "Verify your Lyftberan account",
        htmlBody:
            "<h2>Welcome to Lyftberan</h2><p>Hi {{name}},</p><p>Please verify your email by clicking the link below:</p><p><a href=\"{{url}}\">Verify Email</a></p><p>If you did not create this account, you can safely ignore this email.</p>",
        textBody:
            "Welcome to Lyftberan\n\nHi {{name}},\n\nPlease verify your email by opening this link: {{url}}\n\nIf you did not create this account, ignore this email.",
    },
    password_reset: {
        subject: "Reset your Lyftberan password",
        htmlBody:
            "<h2>Password Reset</h2><p>Hi {{name}},</p><p>You can reset your password from the link below:</p><p><a href=\"{{url}}\">Reset Password</a></p><p>If this wasn't you, please ignore this email.</p>",
        textBody:
            "Password Reset\n\nHi {{name}},\n\nUse this link to reset your password: {{url}}\n\nIf this wasn't you, please ignore this email.",
    },
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

        const template = rows[0] ?? defaultTemplates[key];

        return {
            subject: fillTemplate(template.subject, values),
            htmlBody: fillTemplate(template.htmlBody, values),
            textBody: fillTemplate(template.textBody, values),
        };
    } catch {
        const fallback = defaultTemplates[key];
        return {
            subject: fillTemplate(fallback.subject, values),
            htmlBody: fillTemplate(fallback.htmlBody, values),
            textBody: fillTemplate(fallback.textBody, values),
        };
    }
}
