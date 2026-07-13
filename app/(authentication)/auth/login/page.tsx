"use client"

import Link from "next/link"
import { useState } from "react"
import { Package, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Authentication logic would go here
  }

  return (
    <div className="z-0 min-h-screen antialiased flex flex-col justify-center relative px-6 py-24 sm:px-8">

      {/* Center Layout Container */}
      <div className="mx-auto w-full max-w-[360px] sm:max-w-[400px] flex flex-col space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
        
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground/80 hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Context Controls */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-light text-muted-foreground select-none">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-input bg-background text-primary focus:ring-0 focus:ring-offset-0"
              />
              Remember choice
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-primary underline-offset-4 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Form Action */}
          <button
            type="submit"
            className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none"
          >
            Sign In
          </button>
        </form>

        {/* Context Switching Link */}
        <p className="text-center text-xs text-muted-foreground font-light">
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