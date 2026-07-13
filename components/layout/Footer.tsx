import Link from "next/link"
import { Package } from "lucide-react"

const footerLinks = {
  services: [
    { href: "/services", label: "Smart Logistics" },
    { href: "/services", label: "Freight Forwarding" },
    { href: "/services", label: "Express Courier" },
    { href: "/tracking", label: "Live Tracking" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/auth/login", label: "Client Portal" },
  ],
  legal: [
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/terms", label: "Terms of Service" },
    { href: "/legal/non-disclosure", label: "Non-Disclosure" },
    { href: "/legal/cookies", label: "Cookie Policy" },
    { href: "/legal/refunds", label: "Refund Policy" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground antialiased">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-16">
        {/* Main Grid Stack */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5 lg:gap-12">
          {/* Brand Presentation Section */}
          <div className="space-y-3 border-b border-border pb-6 md:col-span-2 md:border-none md:pb-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card shadow-sm">
                <Package className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <span className="text-base font-bold tracking-tight">
                Lyftberan
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed font-light text-muted-foreground">
              Global, tech-driven freight and smart logistics platform.
              Engineered for seamless end-to-end shipping operations worldwide.
            </p>
          </div>

          {/* Links Section structured as an inline dense mobile grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:col-span-3 md:flex md:justify-between md:gap-x-0">
            {[
              { title: "Services", links: footerLinks.services },
              { title: "Company", links: footerLinks.company },
              { title: "Legal", links: footerLinks.legal, isWide: true },
            ].map((group) => (
              <div
                key={group.title}
                className={
                  group.isWide
                    ? "col-span-2 space-y-3 sm:col-span-1"
                    : "space-y-3"
                }
              >
                <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {group.title}
                </h4>
                {/* Changes to a compact 2-column inline subgrid on ultra-small mobile screens for long lists like Legal */}
                <ul
                  className={
                    group.isWide
                      ? "grid grid-cols-2 gap-x-2 gap-y-2 sm:block sm:space-y-2"
                      : "space-y-2"
                  }
                >
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="block py-0.5 text-xs font-light text-muted-foreground/90 transition-colors hover:text-foreground sm:py-0"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* System Metadata Section */}
        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-3 border-t border-border pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-[11px] font-light text-muted-foreground/80">
            © {new Date().getFullYear()} Lyftberan Logistics Inc. All rights
            reserved.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-light text-muted-foreground/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Telemetry Status:{" "}
            <span className="font-medium text-foreground">Operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
