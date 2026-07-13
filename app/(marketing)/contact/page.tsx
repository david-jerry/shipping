"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Globe,
  MessageSquare,
} from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      {/* Hero Section */}
      <section className="relative flex min-h-[35vh] items-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80"
            alt="Logistics highway"
            fill
            className="object-cover opacity-15 brightness-[0.8] dark:brightness-[0.4]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold tracking-tight text-primary">
              Connect
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Get in Touch
            </h1>
            <p className="text-base leading-relaxed font-light text-muted-foreground">
              Whether you need a custom freight routing quote, localized
              dispatch support, or structural partnerships, our teams respond
              within global operational windows.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid items-start gap-8 lg:grid-cols-5">
          {/* Information Column */}
          <div className="space-y-4 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                {
                  icon: Mail,
                  title: "Email Channels",
                  lines: ["hello@lyftberan.com", "support@lyftberan.com"],
                },
                {
                  icon: Phone,
                  title: "Phone Lines",
                  lines: [
                    "+1 (888) 555-0199 (Toll-Free)",
                    "+44 20 7946 0958 (UK)",
                  ],
                },
                {
                  icon: MapPin,
                  title: "Headquarters",
                  lines: [
                    "350 Mission Street, Suite 200",
                    "San Francisco, CA 94105, USA",
                  ],
                },
                {
                  icon: Clock,
                  title: "Support Operations",
                  lines: [
                    "24/7 Monitored for Enterprise Matrix",
                    "Mon–Fri 6AM–10PM PST for Standard",
                  ],
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      {item.title}
                    </h3>
                    {item.lines.map((line) => (
                      <p
                        key={line}
                        className="text-sm font-medium tracking-tight text-foreground"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Regional Outlets */}
            <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Regional Facilities
                </h3>
                <div className="grid gap-3 border-t border-border pt-3 text-xs">
                  {[
                    {
                      region: "Europe Hub",
                      address: "Weena 290, 3012 NJ Rotterdam, Netherlands",
                    },
                    {
                      region: "Asia-Pacific",
                      address: "9 Raffles Place, #40-00, Singapore 048619",
                    },
                    {
                      region: "Middle East",
                      address: "Dubai Logistics City, Dubai, UAE",
                    },
                  ].map((office, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="font-semibold tracking-tight text-foreground">
                        {office.region}
                      </div>
                      <div className="leading-normal font-light text-muted-foreground">
                        {office.address}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interaction Area Form / Response */}
          <div className="lg:col-span-3">
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Doe"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Company Entity
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Inc."
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Phone Vector
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Inquiry Scope *
                  </label>
                  <div className="relative">
                    <select
                      required
                      className="flex h-9 w-full appearance-none items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                    >
                      <option value="" className="bg-card">
                        Select a operational focus...
                      </option>
                      <option className="bg-card">Freight Quote</option>
                      <option className="bg-card">Tracking Support</option>
                      <option className="bg-card">
                        Enterprise Partnership
                      </option>
                      <option className="bg-card">Customs & Compliance</option>
                      <option className="bg-card">Careers</option>
                      <option className="bg-card">General Inquiry</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                      <span className="text-[10px]">▼</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Estimated Monthly Output Volume
                  </label>
                  <div className="relative">
                    <select className="flex h-9 w-full appearance-none items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:outline-none">
                      <option className="bg-card">
                        Not sure / Just exploring
                      </option>
                      <option className="bg-card">Under 50 shipments</option>
                      <option className="bg-card">50–500 shipments</option>
                      <option className="bg-card">500–2,000 shipments</option>
                      <option className="bg-card">2,000+ shipments</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                      <span className="text-[10px]">▼</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Message Context *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide continuous criteria regarding cargo type definitions, dynamic weights, metrics, destinations, or explicit system setups..."
                    className="flex min-h-[60px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none"
                >
                  <Send className="h-3.5 w-3.5" />
                  Transmit Transmission
                </button>

                <p className="text-center text-[11px] leading-normal font-light text-muted-foreground/80">
                  Submission initializes context validation. Data handled
                  pursuant to our{" "}
                  <Link
                    href="/legal/privacy"
                    className="text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    Privacy Rules
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/legal/terms"
                    className="text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    Terms Architecture
                  </Link>
                  .
                </p>
              </form>
            ) : (
              <div className="animate-in rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-12 text-center shadow-sm backdrop-blur-sm duration-200 fade-in-50">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-background shadow-sm">
                  <MessageSquare className="h-5 w-5 text-emerald-500" />
                </div>
                <h3 className="mb-1 text-lg font-bold tracking-tight">
                  Transmission Verified
                </h3>
                <p className="mx-auto mb-4 max-w-sm text-sm leading-normal font-light text-muted-foreground">
                  Thank you for reaching out. A systems logistics specialist
                  will review your operational matrix and reply within 24 hours.
                </p>
                <div className="border-t border-border pt-4 text-xs text-muted-foreground">
                  For active exceptions, utilize direct escalation line:{" "}
                  <span className="font-mono font-semibold text-primary">
                    +1 (888) 555-0199
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
