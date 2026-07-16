"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

import { getAdminDeliveriesTableDataAction } from "@/app/actions/deliveries"
import { AdminDeliveriesTable } from "@/components/admin/AdminDeliveriesTable"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { type AdminDeliveryTableFilters } from "@/lib/deliveries"

export default function AdminDeliveriesPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<AdminDeliveryTableFilters>({
    status: "all",
    dateRange: "30d",
    trackingCode: "",
    limit: 50,
  })

  const normalizedTrackingCode = useMemo(
    () => filters.trackingCode?.trim() ?? "",
    [filters.trackingCode]
  )

  const shouldOpenCreateDrawer = searchParams.get("create") === "1"

  const {
    data: filteredDeliveries,
    isPending: isTablePending,
    isFetching: isTableFetching,
  } = useQuery({
    queryKey: [
      "admin",
      "deliveries",
      filters.status,
      filters.dateRange,
      normalizedTrackingCode,
      filters.limit,
    ],
    queryFn: () =>
      getAdminDeliveriesTableDataAction({
        ...filters,
        trackingCode: normalizedTrackingCode,
      }),
    staleTime: 1_000,
    refetchInterval: 3_000,
    refetchOnWindowFocus: true,
  })

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-card p-4">
                  <h1 className="text-xl font-semibold tracking-tight">
                    Deliveries Management
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create, update, and remove deliveries while monitoring
                    current shipment status.
                  </p>
                </div>
              </div>
              <div className="px-4 lg:px-6">
                <AdminDeliveriesTable
                  deliveries={filteredDeliveries?.deliveries ?? []}
                  filters={filters}
                  onFiltersChange={setFilters}
                  isLoading={isTablePending}
                  isFetching={isTableFetching}
                  openCreateOnLoad={shouldOpenCreateDrawer}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
