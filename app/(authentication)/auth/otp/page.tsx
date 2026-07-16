"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Package, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { verifyOtpSchema, type VerifyOtpInput } from "@/lib/validation/auth"

export default function OtpPage() {
  const router = useRouter()
  const [isSendingCode, setIsSendingCode] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      code: "",
      trustDevice: false,
    },
  })

  const sendCode = async () => {
    setIsSendingCode(true)

    try {
      const { error } = await authClient.twoFactor.sendOtp()

      if (error) {
        toast.error(error.message ?? "Unable to send OTP")
        return
      }

      toast.success("OTP sent")
    } catch {
      toast.error("Unable to send OTP")
    } finally {
      setIsSendingCode(false)
    }
  }

  useEffect(() => {
    void sendCode()
  }, [])

  const onSubmit = async (values: VerifyOtpInput) => {
    try {
      const { error } = await authClient.twoFactor.verifyOtp({
        code: values.code,
        trustDevice: values.trustDevice,
      })

      if (error) {
        toast.error(error.message ?? "Invalid verification code")
        return
      }

      toast.success("Two-factor verification complete")
      router.push("/")
      router.refresh()
    } catch {
      toast.error("Invalid verification code")
    }
  }

  const isLoading = isSubmitting || isSendingCode

  return (
    <div className="relative z-0 flex min-h-screen flex-col justify-center bg-background px-6 py-24 text-foreground antialiased sm:px-8">
      <div className="mx-auto flex w-full max-w-90 animate-in flex-col space-y-8 duration-300 fade-in-50 slide-in-from-bottom-4 sm:max-w-100">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Two-factor check
          </h1>
          <p className="text-sm font-light text-muted-foreground/90">
            Enter the one-time code sent to your registered channel
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              OTP Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              {...register("code")}
              placeholder="123456"
              disabled={isLoading}
              aria-invalid={Boolean(errors.code)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-center text-lg tracking-[0.35em] shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            />
            {errors.code ? (
              <p className="text-xs text-destructive">{errors.code.message}</p>
            ) : null}
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-xs font-light text-muted-foreground select-none">
            <input
              type="checkbox"
              {...register("trustDevice")}
              disabled={isLoading}
              className="h-3.5 w-3.5 rounded border-input bg-background text-primary focus:ring-0 focus:ring-offset-0"
            />
            Trust this device for 30 days
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {isSubmitting ? "Verifying..." : "Verify and continue"}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={sendCode}
            className="inline-flex h-9 w-full items-center justify-center rounded-md border border-input bg-transparent px-4 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none"
          >
            {isSendingCode ? "Sending code..." : "Resend code"}
          </button>
        </form>

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
