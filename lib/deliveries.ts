import type {
    DeliveryDbStatus,
    DeliveryLocationRow,
    DeliveryRow,
    DeliveryStats,
} from "@/types"

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

export const toDeliveryRow = (record: {
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
}): DeliveryRow => ({
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
