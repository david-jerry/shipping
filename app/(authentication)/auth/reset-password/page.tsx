"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Eye, EyeOff, Lock, Package } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validation/auth"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  )
}

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const hasToken = useMemo(() => Boolean(token), [token])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: ResetPasswordInput) => {
    if (!token) {
      toast.error("Invalid or missing reset token")
      return
    }

    try {
      const { error } = await authClient.resetPassword({
        token,
        newPassword: values.password,
      })

      if (error) {
        toast.error(error.message ?? "Unable to reset password")
        return
      }

      setIsDone(true)
      toast.success("Password reset successful")
    } catch {
      toast.error("Unable to reset password")
    }
  }

  const isLoading = isSubmitting

  return (
    <div className="relative z-0 flex min-h-screen flex-col justify-center bg-background px-6 py-24 text-foreground antialiased sm:px-8">
      <div className="mx-auto flex w-full max-w-90 animate-in flex-col space-y-8 duration-300 fade-in-50 slide-in-from-bottom-4 sm:max-w-100">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Set a new password
          </h1>
          <p className="text-sm font-light text-muted-foreground/90">
            Choose a secure password for your account
          </p>
        </div>

        {!hasToken ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            Missing or invalid token. Please request a new reset link.
          </div>
        ) : isDone ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Your password has been reset. You can sign in now.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  disabled={isLoading}
                  aria-invalid={Boolean(errors.password)}
                  placeholder="••••••••"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground/80 transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  disabled={isLoading}
                  aria-invalid={Boolean(errors.confirmPassword)}
                  placeholder="••••••••"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground/80 transition-colors hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword ? (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none"
            >
              <Lock className="h-3.5 w-3.5" />
              {isLoading ? "Updating..." : "Reset Password"}
            </button>
          </form>
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

function ResetPasswordFallback() {
  return (
    <div className="relative z-0 flex min-h-screen flex-col justify-center bg-background px-6 py-24 text-foreground antialiased sm:px-8">
      <div className="mx-auto flex w-full max-w-90 flex-col space-y-4 sm:max-w-100">
        <div className="h-8 w-48 rounded-md bg-muted" />
        <div className="h-4 w-64 rounded-md bg-muted" />
        <div className="h-9 w-full rounded-md bg-muted" />
        <div className="h-9 w-full rounded-md bg-muted" />
        <div className="h-9 w-full rounded-md bg-muted" />
      </div>
    </div>
  )
}
