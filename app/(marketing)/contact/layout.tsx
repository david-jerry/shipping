import type { Metadata } from "next"

import { buildMarketingMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMarketingMetadata({
  title: "Contact Lyftberan | Sales and Logistics Support",
  description:
    "Contact Lyftberan for freight quotes, enterprise logistics support, partnership opportunities, and operational assistance.",
  path: "/contact",
  keywords: [
    "contact lyftberan",
    "logistics support",
    "freight quote",
    "enterprise shipping",
  ],
})

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
