import { Suspense } from "react"

import { EmailConfirmationClient } from "./EmailConfirmationClient"

function LoadingFallback() {
  return (
    <div className="relative z-0 flex min-h-screen flex-col justify-center bg-background px-6 py-24 text-foreground antialiased sm:px-8">
      <div className="mx-auto flex w-full max-w-90 flex-col space-y-8 sm:max-w-100">
        <div className="rounded-lg border border-border bg-card p-5 text-center text-sm text-muted-foreground">
          Loading confirmation...
        </div>
      </div>
    </div>
  )
}

export default function EmailConfirmationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EmailConfirmationClient />
    </Suspense>
  )
}
