export type DeliveryDbStatus =
    | "pending"
    | "assigned"
    | "in_transit"
    | "delivered"
    | "failed"
    | "cancelled"

export type DeliveryRow = {
    id: string
    trackingNumber: string
    status: "Pending" | "Assigned" | "In Transit" | "Delivered" | "Failed" | "Cancelled"
    pickup: string
    dropoff: string
    lastKnownLocation: string | null
    locationCount: number
    locations: DeliveryLocationRow[]
    receivedAt: string | null
    updatedAt: string
}

export type DeliveryLocationRow = {
    id: string
    sequence: number
    streetAddress: string
    country: string
    fullAddress: string
    transitNote: string | null
    reachedAt: string | null
    isCurrentLocation: boolean
}

export type DeliveryStats = {
    total: number
    inTransit: number
    pending: number
    delivered: number
}

export type AccountOverviewData = {
    stats: DeliveryStats
    deliveries: DeliveryRow[]
    searchedDelivery: DeliveryRow | null
}

export type AdminDeliveriesTrendPoint = {
    date: string
    pending: number
    inTransit: number
    delivered: number
}

export type AdminDashboardStats = DeliveryStats & {
    failed: number
    cancelled: number
}

export type AdminDashboardData = {
    stats: AdminDashboardStats
    deliveries: DeliveryRow[]
    trend: AdminDeliveriesTrendPoint[]
}

export type AdminDeliveryTableFilters = {
    status: DeliveryDbStatus | "all"
    trackingCode?: string
    dateRange: "7d" | "30d" | "90d" | "all"
    limit?: number
}

export type AdminDeliveryTableData = {
    deliveries: DeliveryRow[]
}

export const calculateDeliveryStats = (rows: DeliveryRow[]): DeliveryStats => ({
    total: rows.length,
    inTransit: rows.filter((row) => row.status === "In Transit").length,
    pending: rows.filter(
        (row) => row.status === "Pending" || row.status === "Assigned"
    ).length,
    delivered: rows.filter((row) => row.status === "Delivered").length,
})

export const mapDeliveryStatus = (status: DeliveryDbStatus): DeliveryRow["status"] => {
    switch (status) {
        case "pending":
            return "Pending"
        case "assigned":
            return "Assigned"
        case "in_transit":
            return "In Transit"
        case "delivered":
            return "Delivered"
        case "failed":
            return "Failed"
        case "cancelled":
            return "Cancelled"
    }
}

type DeliveryRecordInput = {
    id: string
    trackingNumber: string
    status: DeliveryDbStatus
    pickupAddress: string
    dropoffAddress: string
    lastKnownLocation?: string | null
    locationCount?: number
    locations?: DeliveryLocationRow[]
    deliveredAt: Date | null
    updatedAt: Date
}

export const toDeliveryRow = (record: DeliveryRecordInput): DeliveryRow => ({
    id: record.id,
    trackingNumber: record.trackingNumber,
    status: mapDeliveryStatus(record.status),
    pickup: record.pickupAddress,
    dropoff: record.dropoffAddress,
    lastKnownLocation: record.lastKnownLocation ?? null,
    locationCount: record.locationCount ?? 0,
    locations: record.locations ?? [],
    receivedAt: record.deliveredAt ? record.deliveredAt.toISOString() : null,
    updatedAt: record.updatedAt.toISOString(),
})
