"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Package } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { signUpSchema, type SignUpInput } from "@/lib/validation/auth"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      acceptedTerms: false,
    },
  })

  const onSubmit = async (values: SignUpInput) => {
    const name = `${values.firstName} ${values.lastName}`.trim()

    try {
      const { error } = await authClient.signUp.email({
        name,
        email: values.email,
        password: values.password,
        callbackURL: "/",
      })

      if (error) {
        toast.error(error.message ?? "Unable to create account")
        return
      }

      await authClient.sendVerificationEmail({
        email: values.email,
        callbackURL: `${window.location.origin}/auth/email-confirmation`,
      })

      toast.success("Account created. Check your inbox for verification")
      router.push(
        `/auth/email-confirmation?email=${encodeURIComponent(values.email)}`
      )
      router.refresh()
    } catch {
      toast.error("Unable to create account")
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
            Create an account
          </h1>
          <p className="text-sm font-light text-muted-foreground/90">
            Get started with your Lyftberan enterprise workspace
          </p>
        </div>

        {/* Dynamic Form Area */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                First Name
              </label>
              <input
                type="text"
                {...register("firstName")}
                placeholder="John"
                disabled={isLoading}
                aria-invalid={Boolean(errors.firstName)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
              />
              {errors.firstName ? (
                <p className="text-xs text-destructive">
                  {errors.firstName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Last Name
              </label>
              <input
                type="text"
                {...register("lastName")}
                placeholder="Doe"
                disabled={isLoading}
                aria-invalid={Boolean(errors.lastName)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
              />
              {errors.lastName ? (
                <p className="text-xs text-destructive">
                  {errors.lastName.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Work Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="name@company.com"
              disabled={isLoading}
              aria-invalid={Boolean(errors.email)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
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
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
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

          {/* Terms Compliance Check */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              {...register("acceptedTerms")}
              disabled={isLoading}
              className="mt-0.5 h-3.5 w-3.5 rounded border-input bg-background text-primary focus:ring-0 focus:ring-offset-0"
            />
            <label
              htmlFor="terms"
              className="text-xs leading-normal font-light text-muted-foreground select-none"
            >
              I accept the{" "}
              <Link
                href="/legal/terms"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/legal/privacy"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.acceptedTerms ? (
            <p className="text-xs text-destructive">
              {errors.acceptedTerms.message}
            </p>
          ) : null}

          {/* Form Action */}
          <button
            type="submit"
            disabled={isLoading || isSessionPending || !!session}
            className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none"
          >
            {isLoading
              ? "Creating account..."
              : session
                ? "Already signed in"
                : "Create Account"}
          </button>
        </form>

        {/* Context Switching Link */}
        <p className="text-center text-xs font-light text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
