"use client"

import { useEffect } from "react"

type AccountRouteGroupErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AccountRouteGroupError({
  error,
  reset,
}: AccountRouteGroupErrorProps) {
  useEffect(() => {
    console.error("Account route group error", error)
  }, [error])

  return (
    <section className="rounded-xl border border-destructive/30 bg-card p-6">
      <h2 className="text-lg font-semibold tracking-tight">
        Account area failed to load
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We could not render your account page right now. Try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        Retry
      </button>
    </section>
  )
}
