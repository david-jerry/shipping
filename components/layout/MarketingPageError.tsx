"use client"

import { AlertTriangle, RefreshCw, Ship } from "lucide-react"

import { Button } from "@/components/ui/button"

type MarketingPageErrorProps = {
  reset: () => void
}

export function MarketingPageError({ reset }: MarketingPageErrorProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--destructive)/0.12),_transparent_58%)]" />

      <div className="relative mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-5 px-6 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.16em] text-destructive uppercase">
            Route Exception
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            We hit turbulence loading this page
          </h2>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">
            Our logistics control plane could not render this marketing route
            right now. Retry to request a fresh response.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset} size="lg" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry request
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => window.location.assign("/")}
          >
            <Ship className="h-4 w-4" />
            Back to home
          </Button>
        </div>
      </div>
    </section>
  )
}
