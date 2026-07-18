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

export type PaginationMeta = {
    page: number
    pageSize: number
    total: number
    totalPages: number
}

export type AccountOverviewData = {
    stats: DeliveryStats
    deliveries: DeliveryRow[]
    searchedDelivery: DeliveryRow | null
    pagination: PaginationMeta
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
    page?: number
    pageSize?: number
}

export type AdminDeliveryTableData = {
    deliveries: DeliveryRow[]
    pagination: PaginationMeta
}
