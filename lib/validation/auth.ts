import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { user } from "@/drizzle/schema/auth";

const userInsertSchema = createInsertSchema(user);

const emailSchema = userInsertSchema.shape.email;

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be 128 characters or fewer");

export const signInSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    rememberMe: z.boolean(),
});

export const signUpSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    email: emailSchema,
    password: passwordSchema,
    acceptedTerms: z
        .boolean()
        .refine((value) => value, "Please accept terms and privacy policy"),
});

export const requestPasswordResetSchema = z.object({
    email: emailSchema,
});

export const resendVerificationEmailSchema = z.object({
    email: emailSchema,
});

export const verifyOtpSchema = z.object({
    code: z
        .string()
        .trim()
        .length(6, "Code must be exactly 6 digits")
        .regex(/^\d+$/, "Code must contain only numbers"),
    trustDevice: z.boolean(),
});

export const resetPasswordSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;
export type ResendVerificationEmailInput = z.infer<typeof resendVerificationEmailSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
