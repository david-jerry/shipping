"use client"

import { MarketingPageError } from "@/components/layout/MarketingPageError"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ reset }: ErrorProps) {
  return <MarketingPageError reset={reset} />
}
