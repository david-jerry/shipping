import Image from "next/image"
import Link from "next/link"
import { AnimatedStat } from "@/components/layout/AnimatedStat"
import {
  CheckCircle2,
  Zap,
  Leaf,
  Award,
  Target,
  Heart,
  Lightbulb,
  ArrowRight,
  MapPin,
  Building2,
  Plane,
  Ship,
} from "lucide-react"

export default function AboutPage() {
  const milestones = [
    {
      year: "2019",
      title: "Founded in San Francisco",
      desc: "Lyftberan launched with a mission to digitize global freight forwarding, starting with trans-Pacific ocean routes.",
    },
    {
      year: "2020",
      title: "AI Routing Engine v1",
      desc: "Deployed our first neural network for multimodal route optimization, reducing average transit times by 18%.",
    },
    {
      year: "2021",
      title: "Series B & Global Expansion",
      desc: "Raised $180M to expand into Europe and Asia-Pacific. Opened hubs in Rotterdam, Singapore, and Dubai.",
    },
    {
      year: "2022",
      title: "Express Courier Launch",
      desc: "Acquired LastMile Technologies to build same-day delivery capabilities in 45 major metro areas.",
    },
    {
      year: "2023",
      title: "Carbon Neutral Program",
      desc: "Introduced GoGreen Plus with sustainable aviation fuel partnerships, offsetting 2.4M tonnes of CO₂.",
    },
    {
      year: "2024",
      title: "Enterprise Platform 3.0",
      desc: "Launched predictive delay alerts, autonomous warehouse robotics integration, and ERP sync for SAP/Oracle.",
    },
    {
      year: "2025",
      title: "$2.4B Freight Under Management",
      desc: "Surpassed 4,000 enterprise clients and 850 logistics partners across 190 countries.",
    },
    {
      year: "2026",
      title: "Network 2.0 & Autonomous Fleets",
      desc: "Rolling out self-driving truck corridors in the US and EU with Level 4 autonomy partnerships.",
    },
  ]

  const values = [
    {
      icon: CheckCircle2,
      title: "Transparency",
      desc: "Real-time visibility into every shipment, every fee, and every decision. No hidden costs, no black boxes. Our open API gives you direct access to the same data our dispatchers see.",
    },
    {
      icon: Zap,
      title: "Velocity",
      desc: "Speed without sacrifice. We optimize for the fastest reliable path, not the cheapest slow one. Our AI evaluates 2.4M data points daily to keep your cargo moving.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      desc: "Carbon-neutral routing options, electric last-mile fleets, and offset programs built into every quote. Committed to net-zero logistics by 2040.",
    },
    {
      icon: Heart,
      title: "Customer Obsession",
      desc: "Every enterprise client gets a dedicated logistics manager, not a ticket number. We measure success by your NPS, not just our margins.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      desc: "From blockchain-backed chain-of-custody to predictive maintenance on our fleet, we invest 15% of revenue annually into R&D.",
    },
    {
      icon: Target,
      title: "Accountability",
      desc: "We own the outcome. If we commit to a delivery window, we meet it — or we make it right. No excuses, no finger-pointing at carriers.",
    },
  ]

  const leaders = [
    {
      initials: "MK",
      name: "Marcus Kline",
      role: "CEO & Co-Founder",
      bio: "Former VP of Operations at Amazon Logistics. Built Lyftberan to solve the visibility gap he experienced firsthand managing cross-border fulfillment.",
    },
    {
      initials: "SR",
      name: "Sarah Rodriguez",
      role: "CTO & Co-Founder",
      bio: "PhD in Operations Research from MIT. Led the development of Lyftberan's AI routing engine and predictive analytics platform.",
    },
    {
      initials: "JC",
      name: "James Chen",
      role: "COO",
      bio: "20 years in global freight at DHL and Maersk. Oversees our 850+ partner network and ensures operational excellence across all trade lanes.",
    },
    {
      initials: "AP",
      name: "Anna Petrov",
      role: "VP of Global Operations",
      bio: "Former regional director at FedEx Express. Manages our 340+ warehouse facilities and customs clearance operations in 190 countries.",
    },
  ]

  const certifications = [
    "ISO 9001:2015 Quality Management",
    "IATA CEIV Pharma Certified",
    "AEO Authorized Economic Operator",
    "C-TPAT Customs-Trade Partnership",
    "GDP Good Distribution Practice",
    "SOC 2 Type II Data Security",
  ]

  return (
    <div className="antineal min-h-screen bg-background font-sans text-foreground">
      {/* Hero */}
      <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden border-b border-border px-6 py-32">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&q=80"
            alt="Global shipping port aerial view"
            fill
            sizes="100vw"
            className="object-cover opacity-40 brightness-[0.7] dark:brightness-[0.4]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/80 px-4 py-1.5 text-xs font-medium tracking-tight text-muted-foreground backdrop-blur-sm">
            <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            About Lyftberan
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl">
            Engineering the Future of{" "}
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
              Global Trade
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-muted-foreground sm:text-xl">
            We believe moving goods across the planet should be as simple as
            sending an email. Founded in 2019, Lyftberan is now the centralized
            nervous system for 4,000+ enterprises shipping across 190 countries.
          </p>
        </div>
      </section>

      {/* Mission & Stats */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="grid items-start gap-16 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Making Global Logistics Invisible
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Lyftberan was founded to eliminate the friction, opacity, and
                inefficiency that plagues traditional freight forwarding. We
                built a platform that orchestrates over $2.4 billion in annual
                freight volume.
              </p>
            </div>
            <p className="leading-relaxed font-light text-muted-foreground">
              Our technology doesn&apos;t just track shipments; it predicts
              disruptions before they happen, automatically reroutes cargo
              around geopolitical events and weather patterns, and negotiates
              optimal carrier rates in real-time.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
              {[
                { value: "2019", label: "Founded" },
                { value: "4,000+", label: "Enterprise Clients" },
                { value: "850+", label: "Logistics Partners" },
                { value: "584", label: "Team Members" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="text-2xl font-bold tracking-tight">
                    <AnimatedStat value={stat.value} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 lg:col-span-5">
            {[
              { value: "2.4M", label: "Data points processed daily" },
              { value: "34%", label: "Average cost reduction" },
              { value: "98.7%", label: "On-time delivery rate" },
              { value: "24/7", label: "Human support available" },
            ].map((metric, i) => (
              <div
                key={metric.label}
                className={`flex min-h-[140px] flex-col justify-between rounded-2xl border border-border bg-card p-6 ${
                  i === 1 || i === 2 ? "bg-muted/30" : ""
                }`}
              >
                <div className="text-4xl font-extrabold tracking-tight text-foreground">
                  <AnimatedStat value={metric.value} />
                </div>
                <div className="text-sm leading-snug tracking-tight text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story / Timeline */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="mb-16 max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Our Journey
            </h2>
            <p className="font-light text-muted-foreground">
              From a small startup in San Francisco to a global logistics
              platform moving billions in cargo — here&apos;s how we got here.
            </p>
          </div>

          <div className="relative ml-2 space-y-12 border-l border-border md:ml-0 md:grid md:grid-cols-4 md:gap-6 md:space-y-0 md:border-l-0">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="group relative pl-6 md:border-t md:border-border md:pt-6 md:pl-0"
              >
                {/* Visual marker */}
                <div className="absolute top-1.5 left-0 h-3 w-3 -translate-x-1.5 rounded-full bg-primary transition-transform group-hover:scale-125 md:top-0 md:left-0 md:-translate-y-1.5" />
                <div className="text-sm font-semibold tracking-wider text-primary">
                  {m.year}
                </div>
                <h3 className="mt-2 text-base font-semibold tracking-tight text-foreground">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed font-light text-muted-foreground">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="mb-16 max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Our Core Values
          </h2>
          <p className="font-light text-muted-foreground">
            These principles guide every decision we make — from product
            development to partner selection to how we treat our team.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="group rounded-xl border border-border bg-card p-8 transition-all hover:bg-muted/30"
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <value.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-bold tracking-tight">
                {value.title}
              </h3>
              <p className="text-sm leading-relaxed font-light text-muted-foreground">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Global Presence */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="mb-16 max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Global Presence
            </h2>
            <p className="font-light text-muted-foreground">
              Strategically positioned hubs, warehouses, and customs centers
              across six continents to ensure your cargo is never far from its
              destination.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                region: "North America",
                hubs: "San Francisco, Chicago, New York, Vancouver, Mexico City",
                facilities: "85 warehouses, 12 port terminals",
                icon: Building2,
              },
              {
                region: "Europe",
                hubs: "Rotterdam, Frankfurt, London, Warsaw, Istanbul",
                facilities: "72 warehouses, 9 port terminals",
                icon: MapPin,
              },
              {
                region: "Asia-Pacific",
                hubs: "Shanghai, Singapore, Tokyo, Sydney, Mumbai",
                facilities: "120 warehouses, 18 port terminals",
                icon: Ship,
              },
              {
                region: "Middle East & Africa",
                hubs: "Dubai, Johannesburg, Lagos, Nairobi, Cairo",
                facilities: "38 warehouses, 4 port terminals",
                icon: Plane,
              },
            ].map((region) => (
              <div
                key={region.region}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-6"
              >
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                      <region.icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-semibold tracking-tight">
                      {region.region}
                    </h3>
                  </div>
                  <div className="mb-6 text-sm leading-relaxed font-light text-muted-foreground">
                    <span className="mb-1 block text-xs font-semibold tracking-wider text-foreground/70 uppercase">
                      Key Hubs
                    </span>
                    {region.hubs}
                  </div>
                </div>
                <div className="border-t border-border/60 pt-4">
                  <span className="mb-1 block text-xs font-semibold tracking-wider text-foreground/70 uppercase">
                    Facilities
                  </span>
                  <div className="text-sm font-medium tracking-tight text-primary">
                    {region.facilities}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-8 lg:grid-cols-3">
          <div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">
              Certifications & Compliance
            </h2>
            <p className="text-sm font-light text-muted-foreground">
              We maintain the highest standards of quality, security, and
              regulatory compliance across every market we serve.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-2">
            {certifications.map((cert) => (
              <div
                key={cert}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-3.5"
              >
                <Award className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-xs leading-snug font-medium tracking-tight">
                  {cert}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="mb-16 max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Leadership Team
            </h2>
            <p className="font-light text-muted-foreground">
              Seasoned operators, engineers, and logistics veterans united by a
              shared mission to transform global trade.
            </p>
          </div>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((person) => (
              <div key={person.name} className="group flex flex-col space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-card text-xl font-bold tracking-tight shadow-sm transition-colors group-hover:border-primary/50">
                  {person.initials}
                </div>
                <div>
                  <div className="text-base font-bold tracking-tight">
                    {person.name}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-primary">
                    {person.role}
                  </div>
                </div>
                <p className="text-sm leading-relaxed font-light text-muted-foreground">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-8 py-12 sm:px-12 sm:py-16">
          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Join the Team Reshaping Global Logistics
              </h2>
              <p className="mb-8 leading-relaxed font-light text-muted-foreground">
                We&apos;re hiring across engineering, operations, sales, and
                customs expertise. Work with cutting-edge AI, a global team, and
                meaningful problems that impact billions of deliveries every
                year.
              </p>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
              >
                View Open Positions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid w-full grid-cols-2 gap-4 lg:col-span-5">
              {[
                { value: "584", label: "Team Members" },
                { value: "42", label: "Nationalities" },
                { value: "15%", label: "Revenue to R&D" },
                { value: "4.8", label: "Employee Rating" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-muted/40 p-5 text-center"
                >
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    <AnimatedStat value={s.value} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
