import type { Metadata } from "next"

import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Header"
import { MarketingMobileDock } from "@/components/layout/MarketingMobileDock"
import { MarketingAnimator } from "@/components/layout/MarketingAnimator"
import { ScrollToTopButton } from "@/components/layout/ScrollToTopButton"
import { buildMarketingMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMarketingMetadata({
  title: "Lyftberan | Smart Global Logistics",
  description:
    "AI-driven freight, tracking, and supply chain operations across ocean, air, and ground shipping.",
  path: "/",
  keywords: [
    "global logistics",
    "freight forwarding",
    "shipment tracking",
    "supply chain",
    "ocean freight",
    "air freight",
  ],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <MarketingAnimator>{children}</MarketingAnimator>
      </main>
      <ScrollToTopButton />
      <MarketingMobileDock />
      <Footer />
    </>
  )
}
