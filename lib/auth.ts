import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";

import * as authSchema from "@/drizzle/schema/auth";
import { getEmailTemplate } from "@/lib/email-templates";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/messaging";

const socialProviders = {
    // ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    //     ? {
    //         github: {
    //             clientId: process.env.GITHUB_CLIENT_ID,
    //             clientSecret: process.env.GITHUB_CLIENT_SECRET,
    //         },
    //     }
    //     : {}),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
        }
        : {}),
};

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: authSchema,
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            const template = await getEmailTemplate("password_reset", {
                name: user.name ?? "Hello there",
                email: user.email,
                url,
            });

            await sendEmail({
                to: user.email,
                subject: template.subject,
                html: template.htmlBody,
                text: template.textBody,
            });
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            const template = await getEmailTemplate("register_verification", {
                name: user.name ?? "Hello there",
                email: user.email,
                url,
            });

            await sendEmail({
                to: user.email,
                subject: template.subject,
                html: template.htmlBody,
                text: template.textBody,
            });
        },
    },
    plugins: [
        passkey(),
        twoFactor({
            otpOptions: {
                sendOTP: async ({ user, otp }) => {
                    const otpMessage = `Your Lyftberan verification code is ${otp}. It expires in 3 minutes.`;

                    await sendEmail({
                        to: user.email,
                        subject: "Your Lyftberan verification code",
                        html: `<p>${otpMessage}</p>`,
                        text: otpMessage,
                    });
                },
            },
        }),
    ],
    ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
});
