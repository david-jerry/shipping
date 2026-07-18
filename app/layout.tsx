import { Geist_Mono, Roboto, Oxanium } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { siteUrl } from "@/lib/seo"
import { cn } from "@/lib/utils"

const oxaniumHeading = Oxanium({
  subsets: ["latin"],
  variable: "--font-heading",
})

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Lyftberan | Global Smart Logistics Platform",
  description:
    "Tech-driven freight and logistics platform providing seamless end-to-end shipping solutions across land, air, and sea.",
  openGraph: {
    title: "Lyftberan | Global Smart Logistics Platform",
    description:
      "Tech-driven freight and logistics platform providing seamless end-to-end shipping solutions across land, air, and sea.",
    type: "website",
    locale: "en_US",
    siteName: "Lyftberan",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Lyftberan logistics network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyftberan | Global Smart Logistics Platform",
    description:
      "Tech-driven freight and logistics platform providing seamless end-to-end shipping solutions across land, air, and sea.",
    images: ["/twitter-image"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon/favicon.ico"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        roboto.variable,
        oxaniumHeading.variable
      )}
    >
      <body>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen w-screen flex-col">
              {children}
            </div>
            <Toaster richColors />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
