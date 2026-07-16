import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Header"
import { MarketingMobileDock } from "@/components/layout/MarketingMobileDock"
import { MarketingAnimator } from "@/components/layout/MarketingAnimator"
import { ScrollToTopButton } from "@/components/layout/ScrollToTopButton"

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
