import Image from "next/image"
import Link from "next/link"
import {
  Route,
  Globe,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Ship,
  Plane,
  Truck,
  Warehouse,
  Thermometer,
  FileText,
} from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Hero Section */}
      <section className="relative flex min-h-[45vh] items-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80"
            alt="Container ship at port"
            fill
            sizes="100vw"
            className="object-cover opacity-15 brightness-[0.8] dark:brightness-[0.4]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold tracking-tight text-primary">
              Capabilities
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Comprehensive Logistics{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed font-light text-muted-foreground sm:text-lg">
              From ocean freight to last-mile delivery, we offer end-to-end
              shipping services powered by AI automation and engineered for
              global scale.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-32 px-6 py-24">
        {/* Smart Logistics Features */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
              alt="Smart logistics warehouse"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="rounded-lg border border-border bg-background/80 px-3 py-1.5 shadow-sm backdrop-blur-md">
                <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Telemetry Link
                </div>
                <div className="text-xs font-medium text-foreground">
                  2.4M data points processed daily
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
              <Route className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Smart Logistics Platforms
              </h2>
              <p className="text-sm leading-relaxed font-light text-muted-foreground">
                Dynamic routing models automatically select optimal channels
                across land, air, and sea networks. The neural platform
                processes live parameters to identify exceptions before arrival.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "Predictive Routing",
                  desc: "ML models forecast optimal paths 14 days out",
                },
                {
                  title: "Load Optimization",
                  desc: "Maximize container & aircraft capacity metrics",
                },
                {
                  title: "Carbon Management",
                  desc: "Net-zero offsets configured automatically",
                },
                {
                  title: "Risk Mitigation",
                  desc: "Geopolitical and dynamic weather monitoring",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-lg border border-border/50 bg-card p-3 shadow-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold tracking-tight">
                      {item.title}
                    </div>
                    <div className="text-[11px] leading-normal font-light text-muted-foreground">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Freight Metrics */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 space-y-6 lg:order-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
              <Globe className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Global Ocean & Air Forwarding
              </h2>
              <p className="text-sm leading-relaxed font-light text-muted-foreground">
                Complete cross-border freight management handling declarations,
                intermodal transfers, and localized terminal integration.
                Executing unified containerized freight paths without
                operational friction.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { value: "850+", label: "Vessel Outlets" },
                { value: "120", label: "Air Hubs" },
                { value: "24h", label: "Clearance Target" },
                { value: "99.2%", label: "Doc Accuracy" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border bg-card p-3 text-center shadow-sm"
                >
                  <div className="text-xl font-bold tracking-tight text-indigo-500">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                "FCL / LCL Shipping",
                "Air Cargo Paths",
                "Customs Brokerage",
                "Warehousing Networks",
                "Breakbulk Logistics",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-xl border border-border shadow-sm lg:order-2">
            <Image
              src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80"
              alt="Global freight shipping"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="rounded-lg border border-border bg-background/80 px-3 py-1.5 shadow-sm backdrop-blur-md">
                <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Network Span
                </div>
                <div className="text-xs font-medium text-foreground">
                  190+ Countries Serviced
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Express Networks */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&q=80"
              alt="Express courier delivery"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="rounded-lg border border-border bg-background/80 px-3 py-1.5 shadow-sm backdrop-blur-md">
                <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Terminal Capacity
                </div>
                <div className="text-xs font-medium text-foreground">
                  85 Metro sectors mapped
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
              <Zap className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Last-Mile Express Channels
              </h2>
              <p className="text-sm leading-relaxed font-light text-muted-foreground">
                High-priority shipping arrays designed for secure metropolitan
                delivery windows. Synchronized verification systems track
                parcels directly to distribution boxes and enterprise
                destinations.
              </p>
            </div>
            <div className="space-y-2.5">
              {[
                "Same-day local distribution networks (cutoff 14:00)",
                "Dynamic localized route asset positioning via live telemetry",
                "Cryptographic proof-of-delivery configurations",
                "Managed reverse logistics and asset processing pipelines",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-xs font-light text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="leading-normal">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Capabilities Layout */}
        <div className="space-y-10">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Core Capabilities Array
            </h2>
            <p className="mx-auto max-w-xl text-sm font-light text-muted-foreground">
              Integrated infrastructure built to support multi-layered technical
              logistics demands.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Ship,
                title: "Ocean Freight",
                desc: "Full container capabilities with certified dynamic reefer operations.",
                color: "text-blue-500",
                border: "hover:border-blue-500/30",
              },
              {
                icon: Plane,
                title: "Air Freight",
                desc: "Pharma-certified cold supply chains, direct air charter coordination.",
                color: "text-sky-500",
                border: "hover:border-sky-500/30",
              },
              {
                icon: Truck,
                title: "Ground Fleet",
                desc: "Cross-border transit configurations integrated with custom telemetry.",
                color: "text-amber-500",
                border: "hover:border-amber-500/30",
              },
              {
                icon: Warehouse,
                title: "Warehousing",
                desc: "Bonded network yards with custom temperature monitoring options.",
                color: "text-purple-500",
                border: "hover:border-purple-500/30",
              },
              {
                icon: FileText,
                title: "Customs Clearance",
                desc: "Licensed handling structures with active status validation across 45 countries.",
                color: "text-emerald-500",
                border: "hover:border-emerald-500/30",
              },
              {
                icon: Thermometer,
                title: "Cold Storage Chain",
                desc: "Strict environment configuration limits from -196°C to room ambient thresholds.",
                color: "text-cyan-500",
                border: "hover:border-cyan-500/30",
              },
            ].map((service) => (
              <div
                key={service.title}
                className={`group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 ${service.border}`}
              >
                <div
                  className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background ${service.color} transition-colors group-hover:bg-muted`}
                >
                  <service.icon className="h-4 w-4" />
                </div>
                <h3 className="mb-1 text-sm font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {service.title}
                </h3>
                <p className="text-xs leading-relaxed font-light text-muted-foreground">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Activation Action Box */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-muted/20 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-semibold tracking-tight">
                  Live Cross-Carrier Dashboards
                </h3>
                <p className="max-w-md text-xs leading-normal font-light text-muted-foreground">
                  Consolidated tracking coordinates updated directly via
                  regional endpoint signals.
                </p>
              </div>
            </div>
            <Link
              href="/tracking"
              className="inline-flex h-9 w-full shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-center text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none sm:w-auto"
            >
              Open Tracking Dashboard
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
