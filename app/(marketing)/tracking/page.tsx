"use client"

import { useState } from "react"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import {
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  AlertCircle,
} from "lucide-react"
import { trackDeliveryByCodeAction } from "@/app/actions/deliveries"
import { type DeliveryRow } from "@/lib/deliveries"
import { cn } from "@/lib/utils"

function deliveryProgress(status: DeliveryRow["status"]) {
  if (status === "Delivered") {
    return 100
  }
  if (status === "In Transit") {
    return 70
  }
  if (status === "Assigned") {
    return 40
  }
  if (status === "Pending") {
    return 15
  }
  return 100
}

function statusVariant(status: DeliveryRow["status"]) {
  if (status === "Delivered") {
    return "primary" as const
  }
  if (status === "In Transit" || status === "Assigned") {
    return "emerald" as const
  }
  return "amber" as const
}

export default function TrackingPage() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<DeliveryRow | null>(null)
  const [searched, setSearched] = useState(false)

  const trackMutation = useMutation({
    mutationFn: trackDeliveryByCodeAction,
  })

  const handleTrack = async () => {
    const trimmed = query.trim().toUpperCase()
    if (!trimmed) {
      return
    }

    setSearched(true)
    const delivery = await trackMutation.mutateAsync({ trackingCode: trimmed })
    setResult(delivery)
  }

  const statusVariantStyles = {
    emerald:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber:
      "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    primary: "border-primary/20 bg-primary/10 text-primary",
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Hero */}
      <section className="relative flex min-h-[35vh] items-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80"
            alt="Logistics tracking"
            fill
            sizes="100vw"
            className="object-cover opacity-20 brightness-[0.8] dark:brightness-[0.4]"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16">
          <div className="max-w-2xl">
            <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Track Your Shipment
            </h1>
            <p className="text-base leading-relaxed font-light text-muted-foreground">
              Enter your tracking number to see real-time location and full
              transit history for your shipment.
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-20 mx-auto -mt-8 max-w-7xl px-6 pb-24">
        {/* Search Input Container */}
        <div className="mx-auto mb-12 max-w-2xl">
          <div className="relative flex items-center rounded-xl border border-border bg-card p-2 shadow-md shadow-foreground/5 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-ring">
            <div className="flex flex-1 items-center pl-3">
              <Search className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                placeholder="Enter tracking number (e.g., LYFT-AB12CD34)"
                className="h-10 w-full border-0 bg-transparent p-0 text-base text-foreground placeholder:text-muted-foreground/70 focus:ring-0 focus:outline-none"
              />
            </div>
            <button
              onClick={handleTrack}
              disabled={trackMutation.isPending}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none"
            >
              {trackMutation.isPending ? "Tracking..." : "Track"}
            </button>
          </div>

          <div className="mt-3 text-center text-xs text-muted-foreground/80">
            Tracking codes are case-insensitive.
          </div>
        </div>

        {/* Not Found State */}
        {searched && !result && (
          <div className="mx-auto max-w-xl rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center backdrop-blur-sm">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-destructive" />
            <h3 className="mb-1 text-base font-semibold tracking-tight">
              Shipment Not Found
            </h3>
            <p className="mx-auto max-w-sm text-sm leading-normal font-light text-muted-foreground">
              We couldn&apos;t locate a shipment with that identifier. Verify
              the code or contact your logistics representative.
            </p>
          </div>
        )}

        {/* Results Found State */}
        {result && (
          <div className="mx-auto max-w-4xl animate-in space-y-6 duration-200 fade-in-50">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              {/* Header Box */}
              <div className="flex flex-col gap-4 border-b border-border bg-muted/20 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs tracking-tight text-muted-foreground">
                      Tracking ID
                    </div>
                    <div className="font-mono text-base font-bold tracking-tight">
                      {query.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <div className="sm:text-right">
                    <div className="text-xs tracking-tight text-muted-foreground">
                      Estimated Arrival
                    </div>
                    <div className="mt-0.5 text-sm font-semibold text-foreground">
                      {result.receivedAt
                        ? `Delivered ${new Date(result.receivedAt).toLocaleDateString()}`
                        : "On the way"}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold tracking-tight shadow-sm",
                      statusVariantStyles[statusVariant(result.status)]
                    )}
                  >
                    {result.status}
                  </div>
                </div>
              </div>

              {/* Grid Specifications */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 border-b border-border p-6 sm:grid-cols-4">
                {[
                  { label: "Tracking Number", value: result.trackingNumber },
                  { label: "Current Status", value: result.status },
                  {
                    label: "Last Known Location",
                    value: result.lastKnownLocation ?? "No updates yet",
                  },
                  {
                    label: "Recorded Checkpoints",
                    value: String(result.locationCount),
                  },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      {item.label}
                    </div>
                    <div className="text-sm font-medium tracking-tight text-foreground">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Horizontal Tracker */}
              <div className="border-b border-border bg-muted/10 p-6">
                <div className="relative pt-2 pb-6">
                  <div className="absolute top-5.5 right-0 left-0 h-1 rounded-full bg-secondary" />
                  <div
                    className="absolute top-5.5 left-0 h-1 rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${deliveryProgress(result.status)}%` }}
                  />
                  <div className="relative flex w-full justify-between">
                    {[
                      "Picked Up",
                      "In Transit",
                      "Customs",
                      "Out for Delivery",
                      "Delivered",
                    ].map((step, i) => {
                      const stepProgress = (i / 4) * 100
                      const isActive =
                        deliveryProgress(result.status) >= stepProgress
                      return (
                        <div
                          key={step}
                          className="group relative flex min-w-15 flex-col items-center"
                        >
                          <div
                            className={cn(
                              "z-10 h-3 w-3 rounded-full border-2 bg-background transition-all duration-300",
                              isActive
                                ? "border-primary bg-primary ring-4 ring-primary/10"
                                : "border-muted-foreground/30 bg-background"
                            )}
                          />
                          <span
                            className={cn(
                              "absolute top-6 hidden text-center text-[11px] font-medium tracking-tight whitespace-nowrap transition-colors sm:block",
                              isActive
                                ? "font-semibold text-foreground"
                                : "text-muted-foreground/80"
                            )}
                          >
                            {step}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* History Timeline */}
              <div className="p-6">
                <h3 className="mb-6 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Shipment Activity Log
                </h3>
                {result.locations.length > 0 ? (
                  <div className="relative space-y-6 pl-2">
                    {result.locations.map((event, i) => (
                      <div key={i} className="group flex gap-4">
                        <div className="flex shrink-0 flex-col items-center">
                          <div
                            className={cn(
                              "z-10 flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-sm",
                              event.reachedAt
                                ? "border-primary/30 text-primary"
                                : "border-border text-muted-foreground/60"
                            )}
                          >
                            {event.reachedAt ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Clock className="h-3.5 w-3.5" />
                            )}
                          </div>
                          {i < result.locations.length - 1 && (
                            <div className="mt-2 -mb-2 w-px flex-1 bg-border" />
                          )}
                        </div>
                        <div className="pb-4">
                          <div
                            className={cn(
                              "text-sm tracking-tight",
                              event.reachedAt
                                ? "font-semibold text-foreground"
                                : "font-medium text-muted-foreground"
                            )}
                          >
                            Checkpoint {event.sequence}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs font-light text-muted-foreground/80">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>{event.fullAddress}</span>
                            <span className="text-border">•</span>
                            <span>
                              {event.reachedAt
                                ? new Date(event.reachedAt).toLocaleString()
                                : "time not set"}
                            </span>
                          </div>
                          {event.transitNote ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {event.transitNote}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No location checkpoints have been added for this shipment
                    yet.
                  </p>
                )}
              </div>

              {/* Route Summary Footer */}
              <div className="border-t border-border bg-muted/30 p-5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Departed
                    </div>
                    <div className="font-semibold tracking-tight">
                      {result.pickup}
                    </div>
                  </div>
                  <div className="mx-4 flex max-w-50 flex-1 items-center">
                    <div className="h-px flex-1 border-dashed bg-border" />
                    <Truck className="mx-2.5 h-4 w-4 text-muted-foreground/70" />
                    <div className="h-px flex-1 border-dashed bg-border" />
                  </div>
                  <div className="space-y-0.5 text-right">
                    <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Destination
                    </div>
                    <div className="font-semibold tracking-tight">
                      {result.dropoff}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
