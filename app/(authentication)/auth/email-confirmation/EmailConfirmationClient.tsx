"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Package,
  RefreshCcw,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import {
  resendVerificationEmailSchema,
  type ResendVerificationEmailInput,
} from "@/lib/validation/auth"

type VerificationState = "idle" | "verifying" | "verified" | "failed"

export function EmailConfirmationClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const error = searchParams.get("error")
  const initialEmail = searchParams.get("email") ?? ""

  const [verificationState, setVerificationState] = useState<VerificationState>(
    token ? "verifying" : "idle"
  )
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResendVerificationEmailInput>({
    resolver: zodResolver(resendVerificationEmailSchema),
    defaultValues: {
      email: initialEmail,
    },
  })

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        return
      }

      try {
        const { error: verifyError } = await authClient.verifyEmail({
          query: { token },
        })

        if (verifyError) {
          setVerificationState("failed")
          toast.error(verifyError.message ?? "Email verification failed")
          return
        }

        setVerificationState("verified")
        toast.success("Email verified successfully")
      } catch {
        setVerificationState("failed")
        toast.error("Email verification failed")
      }
    }

    void verify()
  }, [token])

  const onResend = async (values: ResendVerificationEmailInput) => {
    try {
      const { error: resendError } = await authClient.sendVerificationEmail({
        email: values.email,
        callbackURL: `${window.location.origin}/auth/email-confirmation`,
      })

      if (resendError) {
        toast.error(
          resendError.message ?? "Unable to resend verification email"
        )
        return
      }

      toast.success("Verification email sent")
    } catch {
      toast.error("Unable to resend verification email")
    }
  }

  const resolvedState = useMemo<VerificationState>(() => {
    if (verificationState !== "idle") {
      return verificationState
    }

    if (error) {
      return "failed"
    }

    return "idle"
  }, [error, verificationState])

  return (
    <div className="relative z-0 flex min-h-screen flex-col justify-center bg-background px-6 py-24 text-foreground antialiased sm:px-8">
      <div className="mx-auto flex w-full max-w-90 animate-in flex-col space-y-8 duration-300 fade-in-50 slide-in-from-bottom-4 sm:max-w-100">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Confirm your email
          </h1>
          <p className="text-sm font-light text-muted-foreground/90">
            Verify your account to complete onboarding
          </p>
        </div>

        {resolvedState === "verifying" ? (
          <div className="rounded-lg border border-border bg-card p-5 text-center text-sm text-muted-foreground">
            Verifying your email...
          </div>
        ) : null}

        {resolvedState === "verified" ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Your email is verified. You can sign in now.
            </p>
          </div>
        ) : null}

        {resolvedState === "failed" ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5 text-center">
            <XCircle className="mx-auto mb-2 h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">
              Verification link is invalid or expired. Request a new one below.
            </p>
          </div>
        ) : null}

        {resolvedState !== "verified" ? (
          <form
            onSubmit={handleSubmit(onResend)}
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
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.email)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
              />
              {errors.email ? (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              {isSubmitting ? "Sending..." : "Resend verification email"}
            </button>
          </form>
        ) : (
          <Link
            href="/auth/login"
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none"
          >
            <Mail className="h-3.5 w-3.5" />
            Continue to sign in
          </Link>
        )}

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
