"use client"

import React from "react"
import { ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AuthHeader() {
  const router = useRouter()

  return (
    <>
      {/* Top Navigation Utilities */}
      <div className="z-50 absolute top-6 right-6 left-6 mx-auto flex w-full max-w-7xl items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          type="button"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>

        <Link
          href="/"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
          aria-label="Go to Home"
        >
          <Home className="h-4 w-4" />
        </Link>
      </div>
    </>
  )
}
