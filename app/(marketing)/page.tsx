"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Zap,
  Globe,
  Clock,
  Shield,
  Truck,
  BarChart3,
  CheckCircle2,
  Ship,
  Warehouse,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  MapPin,
  Phone,
  Plane,
  Coins,
  Leaf,
  Layers,
  Sparkles,
} from "lucide-react"

// Types & Data Structures
type TransportMode = "ocean" | "air" | "ground" | "express"

const modeContent: Record<
  TransportMode,
  {
    title: string
    subtitle: string
    description: string
    stats: Array<{ value: string; label: string }>
    image: string
    icon: typeof Ship
  }
> = {
  ocean: {
    title: "Ocean Freight",
    subtitle: "FCL & LCL Solutions",
    description:
      "Full-container and less-than-container load shipping across 850+ vessel partnerships. AI-optimized stowage planning reduces costs by up to 28% while ensuring cargo integrity across trans-Pacific, trans-Atlantic, and intra-Asia routes.",
    stats: [
      { value: "850+", label: "Vessel Partners" },
      { value: "4,200", label: "TEU Capacity" },
      { value: "99.1%", label: "On-Time Sailing" },
    ],
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80",
    icon: Ship,
  },
  air: {
    title: "Air Freight",
    subtitle: "Time-Critical Cargo",
    description:
      "Express air cargo via 120+ airport hubs worldwide. Temperature-controlled solutions for pharma and perishables. Charter services available for oversized or urgent shipments with door-to-door clearance in 24 hours.",
    stats: [
      { value: "120+", label: "Airport Hubs" },
      { value: "48h", label: "Max Transit Time" },
      { value: "B747-8F", label: "Largest Fleet" },
    ],
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    icon: Plane,
  },
  ground: {
    title: "Ground Transport",
    subtitle: "FTL & LTL Networks",
    description:
      "Full-truckload and less-than-truckload services across North America, Europe, and Asia-Pacific. Real-time GPS tracking, dedicated fleet options, and cross-border trucking with pre-cleared customs documentation.",
    stats: [
      { value: "12,000+", label: "Trucks Connected" },
      { value: "190", label: "Countries Covered" },
      { value: "24/7", label: "Dispatch Hubs" },
    ],
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80",
    icon: Truck,
  },
  express: {
    title: "Express Courier",
    subtitle: "Last-Mile Delivery",
    description:
      "Same-day and next-day delivery in 85 major metropolitan areas. Electric vehicle fleets, secure locker networks, and real-time driver tracking with photo proof-of-delivery. Cross-border e-commerce optimized.",
    stats: [
      { value: "85", label: "Metro Areas" },
      { value: "2h", label: "Avg. Turnaround" },
      { value: "100%", label: "Proof of Delivery" },
    ],
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    icon: Zap,
  },
}

const industries = [
  {
    icon: "💊",
    title: "Healthcare & Pharma",
    desc: "Cold chain logistics with temperature monitoring down to -196°C. GDP-compliant handling for vaccines, biologics, and medical devices.",
  },
  {
    icon: "⚡",
    title: "Energy & Renewables",
    desc: "Specialized project cargo for wind turbines, solar panels, and oilfield equipment. End-to-end energy logistics from upstream to downstream.",
  },
  {
    icon: "🚗",
    title: "Automotive",
    desc: "Just-in-time parts delivery, finished vehicle logistics, and battery transport compliance. Protecting production schedules across 40+ assembly plants.",
  },
  {
    icon: "👗",
    title: "Retail & E-Commerce",
    desc: "Peak-season readiness, returns management, and omnichannel fulfillment. Supporting 11.11, Black Friday, and holiday surges seamlessly.",
  },
  {
    icon: "📱",
    title: "Technology",
    desc: "High-value electronics shipping with anti-static packaging, lithium battery compliance (UN38.3), and white-glove installation services.",
  },
  {
    icon: "🍎",
    title: "Food & Beverage",
    desc: "Fresh produce, frozen goods, and wine logistics with HACCP-certified facilities. Temperature-controlled from farm to fork.",
  },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TransportMode>("ocean")

  return (
    <div className="bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] border-b border-border/40 bg-muted/20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80"
            alt="Global shipping terminal"
            fill
            className="object-cover opacity-[0.07] contrast-125 grayscale filter dark:opacity-[0.12]"
            priority
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Content Column */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Global Logistics Network &bull; 190+ Countries
              </div>

              <h1 className="text-4xl leading-none font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                The World&apos;s <br />
                <span className="tracking-tighter text-primary">
                  Smartest
                </span>{" "}
                Supply Chain
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                AI-optimized routing across land, air, and sea. Real-time
                visibility for every package. From enterprise freight to
                last-mile delivery — we move over $2.4 billion in cargo annually
                with 98.7% on-time precision.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/tracking"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Clock className="h-4 w-4" />
                  Track Your Shipment
                </Link>
                <Link
                  href="/services"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Explore Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />{" "}
                  Real-time GPS Tracking
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 190+
                  Countries
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 24/7
                  Human Support
                </span>
              </div>
            </div>

            {/* Right Interactive Dashboard Card */}
            <div className="relative lg:col-span-5">
              <div className="rounded-xl border border-border bg-card text-card-foreground shadow-xl">
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-border/60 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm leading-none font-semibold">
                        Live Fleet Status
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        2,847 active vehicles worldwide
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    Operational
                  </span>
                </div>

                {/* Dashboard Entries */}
                <div className="space-y-3 p-5">
                  {[
                    {
                      code: "A1",
                      route: "Shanghai → Rotterdam",
                      desc: "Container Vessel • 4,200 TEU",
                      status: "On Time",
                      color: "text-emerald-500",
                      eta: "ETA 14h",
                    },
                    {
                      code: "B7",
                      route: "Dubai → Frankfurt",
                      desc: "Cargo Aircraft • B747-8F",
                      status: "Delayed +2h",
                      color: "text-amber-500",
                      eta: "ETA 6h",
                    },
                    {
                      code: "C3",
                      route: "Mexico City → Houston",
                      desc: "Truck Fleet • 12 Vehicles",
                      status: "In Transit",
                      color: "text-emerald-500",
                      eta: "ETA 2h",
                    },
                  ].map((item) => (
                    <div
                      key={item.code}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/40 p-3 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                          {item.code}
                        </span>
                        <div>
                          <p className="leading-none font-medium">
                            {item.route}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "text-xs leading-none font-medium",
                            item.color
                          )}
                        >
                          {item.status}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.eta}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Metrics */}
                <div className="flex justify-between border-t border-border/60 bg-muted/20 px-5 py-3 text-xs text-muted-foreground">
                  <span>
                    Load: <strong>78%</strong>
                  </span>
                  <span>
                    Avg Transit: <strong>3.2d</strong>
                  </span>
                  <span>
                    CO₂ Saved: <strong>12.4t</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:divide-x md:divide-border/60">
            {[
              { value: "$2.4B", label: "Freight Under Management" },
              { value: "190+", label: "Countries & Territories" },
              { value: "98.7%", label: "On-Time Delivery Rate" },
              { value: "4,000+", label: "Enterprise Clients" },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className={cn("text-center", idx > 0 && "md:pl-4")}
              >
                <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MULTIMODAL TRANSPORT SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Multimodal Transport Solutions
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Seamlessly switch between ocean, air, ground, and express — all
            orchestrated by a single AI brain that selects the optimal mode for
            cost, speed, and sustainability.
          </p>

          {/* Mode Tabs Structure */}
          <div className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            {(["ocean", "air", "ground", "express"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveTab(mode)}
                className={cn(
                  "inline-flex items-center justify-center rounded-md px-4 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                  activeTab === mode
                    ? "bg-background text-foreground shadow-sm"
                    : "hover:bg-background/50 hover:text-foreground"
                )}
              >
                <span className="capitalize">
                  {mode === "ground" ? "Ground" : mode}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Context View */}
        <div className="grid gap-8 rounded-xl border border-border bg-card p-6 shadow-sm lg:grid-cols-2 lg:p-8">
          <div className="relative aspect-video min-h-[260px] w-full overflow-hidden rounded-lg border bg-muted lg:aspect-auto">
            <Image
              src={modeContent[activeTab].image}
              alt={modeContent[activeTab].title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-primary">
                  {(() => {
                    const IconComponent = modeContent[activeTab].icon
                    return <IconComponent className="h-4 w-4" />
                  })()}
                </div>
                <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                  {modeContent[activeTab].subtitle}
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                {modeContent[activeTab].title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {modeContent[activeTab].description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-border/60 pt-6">
              {modeContent[activeTab].stats.map((s) => (
                <div key={s.label} className="space-y-0.5">
                  <p className="text-lg font-bold tracking-tight text-foreground">
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Learn more about {modeContent[activeTab].title}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CAPABILITIES GRID */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
          <div className="mx-auto mb-16 max-w-3xl space-y-3 text-center">
            <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" /> Platform Capabilities
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for Modern Logistics
            </h2>
            <p className="text-base text-muted-foreground">
              End-to-end visibility and control across every mode of
              transportation, powered by predictive AI and real-time telemetry.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Smart Routing",
                desc: "AI dynamically selects optimal transit channels across multimodal networks, reducing costs by up to 34%.",
              },
              {
                icon: Globe,
                title: "Global Coverage",
                desc: "Seamless handoffs between regional partners across 190+ countries with unified customs protocols.",
              },
              {
                icon: Clock,
                title: "Real-Time Tracking",
                desc: "GPS telemetry updates every 30 seconds. Coordinates, temperature, humidity, and shock profiles.",
              },
              {
                icon: Shield,
                title: "Secure Handling",
                desc: "End-to-end encryption, chain-of-custody logging, tamper-evident seals, and secure assets insurance.",
              },
              {
                icon: Truck,
                title: "Express Courier",
                desc: "Same-day delivery variants across major metros with electric vehicle options and last-mile routing modules.",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                desc: "Enterprise-grade reporting with predictive delay metrics, carbon visibility indicators, and spend analytics.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-border bg-card p-6 text-card-foreground transition-all hover:border-border/80 hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-4 w-4" />
                </div>
                <h3 className="mb-1.5 text-base font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INDUSTRIES WE SERVE */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="mx-auto mb-16 max-w-3xl space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Industries We Serve
          </h2>
          <p className="text-base text-muted-foreground">
            Specialized logistics expertise tailored to the unique demands of
            healthcare, energy, automotive, retail, technology, and food
            sectors.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <div
              key={industry.title}
              className="rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:bg-muted/40"
            >
              <div className="mb-3 text-2xl">{industry.icon}</div>
              <h3 className="mb-1 text-base font-semibold tracking-tight">
                {industry.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {industry.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. GLOBAL NETWORK MAP / INFRASTRUCTURE */}
      <section className="border-t border-border bg-muted/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                Global Infrastructure
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Connected Across Every Continent and Ocean
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Our network spans 190+ countries with strategically placed hubs,
                bonded warehouses, and customs clearance centers. From the Port
                of Shanghai to Rotterdam, from Dubai to São Paulo — your cargo
                moves through the world&apos;s most efficient trade corridors.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  {
                    icon: Warehouse,
                    label: "340+ Warehouses",
                    desc: "Bonded & FTZ facilities",
                  },
                  {
                    icon: MapPin,
                    label: "85 Hub Airports",
                    desc: "Priority cargo handling",
                  },
                  {
                    icon: Ship,
                    label: "45 Port Terminals",
                    desc: "Direct vessel structures",
                  },
                  {
                    icon: Phone,
                    label: "24/7 Control Tower",
                    desc: "Multi-language support",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3 text-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="leading-tight font-semibold">
                        {item.label}
                      </h4>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                <div className="border-b border-border bg-muted/30 px-5 py-4">
                  <h3 className="text-sm font-semibold tracking-tight">
                    Key Corporate Trade Lanes
                  </h3>
                </div>
                <div className="divide-y divide-border/60 px-5">
                  {[
                    {
                      route: "Asia → North America",
                      volume: "840K TEU/year",
                      time: "12-16 days",
                    },
                    {
                      route: "Asia → Europe",
                      volume: "1.2M TEU/year",
                      time: "18-24 days",
                    },
                    {
                      route: "Europe → North America",
                      volume: "420K TEU/year",
                      time: "8-12 days",
                    },
                    {
                      route: "Intra-Asia",
                      volume: "2.1M TEU/year",
                      time: "3-7 days",
                    },
                  ].map((lane) => (
                    <div
                      key={lane.route}
                      className="flex items-center justify-between py-3.5 text-xs"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {lane.route}
                        </p>
                        <p className="mt-0.5 text-muted-foreground">
                          {lane.volume}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          {lane.time}
                        </p>
                        <p className="mt-0.5 text-muted-foreground">
                          Transit Window
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE LYFTBERAN */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-square max-h-[460px] w-full overflow-hidden rounded-xl border bg-muted shadow-sm lg:max-h-none">
            <Image
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
              alt="Automated warehouse fulfillment"
              fill
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-lg border border-border/80 bg-background/95 p-5 shadow backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-lg font-bold tracking-tight">
                    34% Cost Drop
                  </h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Continuous automated carrier load consolidation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why Global Leaders Choose Lyftberan
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We don&apos;t just move freight — we engineer supply chain
                resilience. Our platform integrates with your ERP, WMS, and
                e-commerce layers to spin up a single, unified logistics
                workspace.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Users,
                  title: "Dedicated Account Teams",
                  desc: "Named logistics handlers and customs brokers directly accessible via direct support pipelines instead of typical ticketing call centers.",
                },
                {
                  icon: Award,
                  title: "Certified Global Excellence",
                  desc: "ISO 9001, GDP, IATA CEIV Pharma, and C-TPAT structures guarantee absolute cross-jurisdiction regulatory handling safety.",
                },
                {
                  icon: Coins,
                  title: "Flexible Contract Terms",
                  desc: "No complex enterprise lock-ins. Easily scale volume pipelines up or down seasonally with transparent structural pay-per-shipment profiles.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-lg border border-border/40 p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS / PROOF */}
      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
          <div className="mx-auto mb-16 max-w-3xl space-y-3 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by Industry Leaders
            </h2>
            <p className="text-base text-muted-foreground">
              From Fortune 500 manufactures to hyper-growth e-commerce ventures,
              teams leverage Lyftberan daily.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "Lyftberan reduced our ocean freight costs by 31% while improving on-time delivery from 82% to 97%. Their AI routing model is genuinely transformative.",
                author: "Elena Vasquez",
                role: "VP Supply Chain, Novatech",
              },
              {
                quote:
                  "The real-time visibility platform provides absolute precision. We can pinpoint potential delays 72 hours out and safely reroute cargo flows seamlessly.",
                author: "David Chen",
                role: "Logistics Director, Pacific Auto",
              },
              {
                quote:
                  "Cross-border compliance was our largest operational bottleneck. Lyftberan managed automated clearances, custom handoffs, and logistics without errors.",
                author: "Sarah Okafor",
                role: "CEO, AfriStyle Marketplace",
              },
            ].map((t) => (
              <div
                key={t.author}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <p className="text-xs leading-relaxed text-muted-foreground italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                  <div>
                    <p className="text-xs leading-tight font-semibold text-foreground">
                      {t.author}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SUSTAINABILITY COMMITMENT */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Leaf className="h-3 w-3" /> Sustainability Commitment
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Delivering a Greener Future
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We are unconditionally aligned with targeting zero carbon
              logistics thresholds by 2040. Our specialized GoGreen workflow
              module computes path optimizations to drastically trim dead miles
              utilizing alternative EV distribution and sustainable load
              groupings.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "45%", label: "CO₂ Trimed via SAF" },
                { value: "2,400", label: "Electric Fleet Assets" },
                { value: "100%", label: "Renewable Hub Centers" },
                { value: "12.4M", label: "Trees Planted (2025)" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-border bg-muted/20 p-4"
                >
                  <p className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                    {item.value}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-video min-h-[320px] w-full overflow-hidden rounded-xl border bg-muted shadow-sm lg:aspect-auto">
            <Image
              src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80"
              alt="Sustainable infrastructure development"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 10. ACTION CONSTRUCT (CTA) */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:pb-24">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8 text-center shadow-md sm:p-12 md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent" />
          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to Transform Your Logistics?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Join 4,000+ enterprises that rely on Lyftberan to keep asset
              pipelines running flawlessly. Generate a tailored pricing
              configuration in under two minutes.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/services"
                className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground sm:w-auto"
              >
                Explore All Services
              </Link>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Zero immediate obligations. Meet directly with an available
              logistics specialist inside 15 minutes.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
