"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Package } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { signInSchema, type SignInInput } from "@/lib/validation/auth"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false)
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  })

  const onSubmit = async (values: SignInInput) => {
    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
        callbackURL: "/",
      })

      if (error) {
        toast.error(error.message ?? "Unable to sign in")
        return
      }

      toast.success("Signed in successfully")
      router.push("/")
      router.refresh()
    } catch {
      toast.error("Unable to sign in")
    }
  }

  const handlePasskeySignIn = async () => {
    setIsPasskeyLoading(true)
    try {
      const result = await authClient.signIn.passkey({ autoFill: true })

      if (result.error) {
        toast.error(result.error.message ?? "Passkey sign in failed")
        return
      }

      toast.success("Signed in with passkey")
      router.push("/")
      router.refresh()
    } finally {
      setIsPasskeyLoading(false)
    }
  }

  const isLoading = isSubmitting || isPasskeyLoading

  return (
    <div className="relative z-0 flex min-h-screen flex-col justify-center px-6 py-24 antialiased sm:px-8">
      {/* Center Layout Container */}
      <div className="mx-auto flex w-full max-w-90 animate-in flex-col space-y-8 duration-300 fade-in-50 slide-in-from-bottom-4 sm:max-w-100">
        {/* Header Stack */}
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm font-light text-muted-foreground/90">
            Sign in to your Lyftberan account
          </p>
        </div>

        {/* Dynamic Form Area */}
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
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                disabled={isLoading}
                aria-invalid={Boolean(errors.password)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowPassword(!showPassword)}
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

          {/* Context Controls */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-light text-muted-foreground select-none">
              <input
                type="checkbox"
                {...register("rememberMe")}
                disabled={isLoading}
                className="h-3.5 w-3.5 rounded border-input bg-background text-primary focus:ring-0 focus:ring-offset-0"
              />
              Remember choice
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Form Action */}
          <button
            type="submit"
            disabled={isLoading || isSessionPending || !!session}
            className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none"
          >
            {isLoading
              ? "Signing in..."
              : session
                ? "Already signed in"
                : "Sign In"}
          </button>

          <button
            type="button"
            disabled={isLoading || isSessionPending}
            onClick={handlePasskeySignIn}
            className="inline-flex h-9 w-full items-center justify-center rounded-md border border-input bg-transparent px-4 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sign In With Passkey
          </button>
        </form>

        {/* Context Switching Link */}
        <p className="text-center text-xs font-light text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
