"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Mail, Package } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import {
  requestPasswordResetSchema,
  type RequestPasswordResetInput,
} from "@/lib/validation/auth"

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: RequestPasswordResetInput) => {
    try {
      const redirectTo = `${window.location.origin}/auth/reset-password`
      const { error } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo,
      })

      if (error) {
        toast.error(error.message ?? "Unable to request password reset")
        return
      }

      setSubmitted(true)
      toast.success("Password reset email sent")
    } catch {
      toast.error("Unable to request password reset")
    }
  }

  const isLoading = isSubmitting

  return (
    <div className="relative z-0 flex min-h-screen flex-col justify-center bg-background px-6 py-24 text-foreground antialiased sm:px-8">
      {/* Center Layout Container */}
      <div className="mx-auto flex w-full max-w-90 animate-in flex-col space-y-8 duration-300 fade-in-50 slide-in-from-bottom-4 sm:max-w-100">
        {/* Header Stack */}
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm font-light text-muted-foreground/90">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Dynamic Form Area */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="name@company.com"
                disabled={isLoading}
                aria-invalid={Boolean(errors.email)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.email ? (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            {/* Form Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none"
            >
              <Mail className="h-3.5 w-3.5" />
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="animate-in rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center shadow-sm backdrop-blur-sm duration-200 fade-in-50">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-background shadow-sm">
              <Mail className="h-4 w-4 text-emerald-500" />
            </div>
            <h3 className="mb-1 text-base font-bold tracking-tight">
              Check your email
            </h3>
            <p className="mx-auto mb-4 max-w-xs text-xs leading-normal font-light text-muted-foreground">
              We&apos;ve sent a password reset link to your email address. The
              link will expire in 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                reset()
              }}
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Didn&apos;t receive it? Try again
            </button>
          </div>
        )}

        {/* Return Pathway */}
        <div className="text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-xs font-light text-muted-foreground/90 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
