"use client"

import { type FormEvent, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CheckCircle2, Clock, Package, Route } from "lucide-react"
import { toast } from "sonner"

import {
  getAccountOverviewDataAction,
  updateDeliveryStatusAction,
} from "@/app/actions/deliveries"
import { AccountsDeliveriesTable } from "@/components/layout/AccountsDeliveriesTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  calculateDeliveryStats,
  mapDeliveryStatus,
  type AccountOverviewData,
  type DeliveryDbStatus,
  type DeliveryRow,
} from "@/lib/deliveries"

const emptyOverviewData: AccountOverviewData = {
  stats: {
    total: 0,
    inTransit: 0,
    pending: 0,
    delivered: 0,
  },
  deliveries: [],
  searchedDelivery: null,
}

export default function AccountsOverviewPage() {
  const searchParams = useSearchParams()
  const initialTrackingParam = searchParams.get("tracking") ?? ""

  const [trackingCode, setTrackingCode] = useState("")
  const [submittedCode, setSubmittedCode] = useState<string | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    const normalized = initialTrackingParam.trim()
    if (!normalized) {
      return
    }
    setTrackingCode(normalized)
    setSubmittedCode(normalized)
  }, [initialTrackingParam])

  const normalizedSubmittedCode = useMemo(
    () => submittedCode?.trim() || "",
    [submittedCode]
  )

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["account", "overview", normalizedSubmittedCode],
    queryFn: () =>
      getAccountOverviewDataAction({
        trackingCode: normalizedSubmittedCode || undefined,
      }),
    staleTime: 1_000,
    refetchInterval: 3_000,
    refetchOnWindowFocus: true,
  })

  const overviewData = data ?? emptyOverviewData

  const nextStatusByCurrent: Partial<
    Record<DeliveryRow["status"], DeliveryDbStatus>
  > = {
    Pending: "assigned",
    Assigned: "in_transit",
    "In Transit": "delivered",
  }

  const updateDeliveryStatusMutation = useMutation({
    mutationFn: updateDeliveryStatusAction,
    onMutate: async ({ deliveryId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["account", "overview"] })

      const cacheKey = ["account", "overview", normalizedSubmittedCode] as const

      const previousData =
        queryClient.getQueryData<AccountOverviewData>(cacheKey)

      if (previousData) {
        const nowIso = new Date().toISOString()
        const mappedStatus = mapDeliveryStatus(status)

        const updatedDeliveries = previousData.deliveries.map((delivery) =>
          delivery.id === deliveryId
            ? {
                ...delivery,
                status: mappedStatus,
                receivedAt:
                  status === "delivered" ? nowIso : delivery.receivedAt,
                updatedAt: nowIso,
              }
            : delivery
        )

        const updatedSearchedDelivery =
          previousData.searchedDelivery?.id === deliveryId
            ? {
                ...previousData.searchedDelivery,
                status: mappedStatus,
                receivedAt:
                  status === "delivered"
                    ? nowIso
                    : previousData.searchedDelivery.receivedAt,
                updatedAt: nowIso,
              }
            : previousData.searchedDelivery

        queryClient.setQueryData<AccountOverviewData>(cacheKey, {
          ...previousData,
          deliveries: updatedDeliveries,
          searchedDelivery: updatedSearchedDelivery,
          stats: calculateDeliveryStats(updatedDeliveries),
        })
      }

      return { previousData, cacheKey }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context.cacheKey, context.previousData)
      }
      toast.error("Could not update delivery status.")
    },
    onSuccess: () => {
      toast.success("Delivery status updated.")
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account", "overview"] })
    },
  })

  const stats = [
    {
      label: "Total Deliveries",
      value: String(overviewData.stats.total),
      icon: Package,
      tone: "text-sky-600",
    },
    {
      label: "In Transit",
      value: String(overviewData.stats.inTransit),
      icon: Route,
      tone: "text-amber-600",
    },
    {
      label: "Pending Pickup",
      value: String(overviewData.stats.pending),
      icon: Clock,
      tone: "text-violet-600",
    },
    {
      label: "Received",
      value: String(overviewData.stats.delivered),
      icon: CheckCircle2,
      tone: "text-emerald-600",
    },
  ]

  const hasSearched = submittedCode !== null

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmittedCode(trackingCode)
  }

  const handleAdvanceStatus = async (
    deliveryId: string,
    currentStatus: DeliveryRow["status"]
  ) => {
    const nextStatus = nextStatusByCurrent[currentStatus]
    if (!nextStatus) {
      return
    }

    await updateDeliveryStatusMutation.mutateAsync({
      deliveryId,
      status: nextStatus,
    })
  }

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Accounts Overview</h1>
        <p className="text-sm text-muted-foreground">
          View your delivery stats and past deliveries received in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <article
              key={item.label}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {item.label}
                </p>
                <Icon className={`h-4 w-4 ${item.tone}`} />
              </div>
              <p className="text-3xl font-bold tracking-tight">{item.value}</p>
            </article>
          )
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">
            Track Delivery
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter a tracking code to quickly view the delivery status.
          </p>
        </div>

        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={handleSearchSubmit}
        >
          <Input
            value={trackingCode}
            onChange={(event) => setTrackingCode(event.target.value)}
            placeholder="e.g. LYFT-20944"
            aria-label="Tracking code"
          />
          <Button type="submit" className="sm:w-auto">
            Search
          </Button>
        </form>

        {hasSearched ? (
          overviewData.searchedDelivery ? (
            <div className="mt-4 rounded-lg border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium">
                  {overviewData.searchedDelivery.trackingNumber}
                </p>
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {overviewData.searchedDelivery.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {overviewData.searchedDelivery.pickup} to{" "}
                {overviewData.searchedDelivery.dropoff}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Last known location:{" "}
                {overviewData.searchedDelivery.lastKnownLocation ??
                  "No location updates"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {overviewData.searchedDelivery.locationCount} checkpoint
                {overviewData.searchedDelivery.locationCount === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {overviewData.searchedDelivery.receivedAt
                  ? `Received ${new Date(overviewData.searchedDelivery.receivedAt).toLocaleDateString()}`
                  : "Not delivered yet"}
              </p>

              {overviewData.searchedDelivery.locations.length > 0 ? (
                <div className="mt-3 space-y-2 rounded-md border border-border bg-card/60 p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Route Timeline
                  </p>
                  {overviewData.searchedDelivery.locations.map((location) => (
                    <div
                      key={location.id}
                      className="text-xs text-muted-foreground"
                    >
                      <span className="font-medium text-foreground">
                        #{location.sequence} {location.fullAddress}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {location.reachedAt
                          ? new Date(location.reachedAt).toLocaleString()
                          : "time not set"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-destructive">
              No delivery found for{" "}
              {submittedCode?.trim() || "that tracking code"}.
            </p>
          )
        ) : null}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">
          Past Deliveries
        </h2>
        <p className="text-sm text-muted-foreground">
          Delivery records for your recent shipments.
        </p>
      </div>

      {isPending ? (
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Loading deliveries...
        </div>
      ) : (
        <AccountsDeliveriesTable
          deliveries={overviewData.deliveries}
          onAdvanceStatus={handleAdvanceStatus}
          updatingDeliveryId={
            updateDeliveryStatusMutation.isPending
              ? (updateDeliveryStatusMutation.variables?.deliveryId ?? null)
              : null
          }
        />
      )}

      {isFetching && !isPending ? (
        <p className="text-xs text-muted-foreground">
          Syncing latest delivery updates...
        </p>
      ) : null}
    </section>
  )
}
