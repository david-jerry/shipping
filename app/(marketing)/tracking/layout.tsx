import type { Metadata } from "next"

import { buildMarketingMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMarketingMetadata({
  title: "Track Shipment | Real-Time Delivery Status",
  description:
    "Track your Lyftberan shipment in real time with live status, location updates, and delivery checkpoint history.",
  path: "/tracking",
  keywords: [
    "shipment tracking",
    "track package",
    "delivery status",
    "logistics tracking",
  ],
})

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
