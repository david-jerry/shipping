import { Geist, Geist_Mono, Roboto, Oxanium } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Header";

const oxaniumHeading = Oxanium({subsets:['latin'],variable:'--font-heading'});

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Lyftberan | Global Smart Logistics Platform",
  description:
    "Tech-driven freight and logistics platform providing seamless end-to-end shipping solutions across land, air, and sea.",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="relative flex min-h-screen flex-col">
              {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
