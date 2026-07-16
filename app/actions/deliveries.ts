"use server"

import { and, desc, eq, gte, ilike, sql } from "drizzle-orm"
import { headers } from "next/headers"

import { user } from "@/drizzle/schema/auth"
import {
    createDeliveryByAdminSchema,
    createDeliveryLocationByAdminSchema,
    deleteDeliveryLocationByAdminSchema,
    deliveries,
    deliveryRoutes,
    updateDeliveryRouteByAdminSchema,
    updateDeliveryLocationByAdminSchema,
} from "@/drizzle/schema/delivery"
import { roles, userRoles } from "@/drizzle/schema/roles"
import {
    type AccountOverviewData,
    type AdminDeliveryTableData,
    type AdminDeliveryTableFilters,
    type AdminDashboardData,
    type DeliveryDbStatus,
    type DeliveryLocationRow,
    toDeliveryRow,
} from "@/lib/deliveries"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type GetAccountOverviewInput = {
    trackingCode?: string
}

type UpdateDeliveryStatusInput = {
    deliveryId: string
    status: DeliveryDbStatus
}

type CreateDeliveryByAdminInput = {
    userId: string
    status: DeliveryDbStatus
    pickupAddress: string
    dropoffAddress: string
    notes?: string | null
}

type UpdateDeliveryByAdminInput = {
    deliveryId: string
    status: DeliveryDbStatus
    pickupAddress: string
    dropoffAddress: string
    notes?: string | null
}

type DeleteDeliveryByAdminInput = {
    deliveryId: string
}

type CreateDeliveryLocationByAdminInput = {
    deliveryId: string
    streetAddress: string
    country: string
    transitNote?: string | null
    reachedAt?: string | Date | null
    isCurrentLocation?: boolean
}

type UpdateDeliveryLocationByAdminInput = {
    locationId: string
    streetAddress: string
    country: string
    transitNote?: string | null
    reachedAt?: string | Date | null
    isCurrentLocation?: boolean
}

type DeleteDeliveryLocationByAdminInput = {
    locationId: string
}

type GetDeliveryLocationsByAdminInput = {
    deliveryId: string
}

type GetDeliveryUsersInput = {
    emailQuery?: string
    page?: number
    pageSize?: number
}

type DeliveryUserSelectOption = {
    id: string
    name: string
    email: string
}

type DeliveryUserSelectData = {
    users: DeliveryUserSelectOption[]
    page: number
    pageSize: number
    total: number
    totalPages: number
}

type SearchOpenStreetAddressesInput = {
    query: string
    limit?: number
}

type TrackDeliveryByCodeInput = {
    trackingCode: string
}

type OpenStreetAddressOption = {
    displayName: string
    street: string
    country: string
}

type OpenStreetAddressSearchData = {
    results: OpenStreetAddressOption[]
}

type OverviewStatsRow = {
    total: number
    inTransit: number
    pending: number
    delivered: number
}

type AdminOverviewStatsRow = OverviewStatsRow & {
    failed: number
    cancelled: number
}

type TrendRow = {
    day: string
    pending: number
    inTransit: number
    delivered: number
}

type DeliverySummaryRow = {
    id: string
    trackingNumber: string
    status: DeliveryDbStatus
    pickupAddress: string
    dropoffAddress: string
    deliveredAt: Date | null
    updatedAt: Date
    lastKnownLocation: string | null
    locationCount: number
}

type DeliveryLocationDbRow = {
    id: string
    sequence: number
    streetAddress: string
    country: string
    transitNote: string | null
    reachedAt: Date | null
    isCurrentLocation: boolean
}

function buildTrackingNumberCandidate() {
    const randomPart = crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()
    return `LYFT-${randomPart}`
}

async function generateUniqueTrackingNumber() {
    for (let attempt = 0; attempt < 10; attempt += 1) {
        const candidate = buildTrackingNumberCandidate()
        const [existing] = await db
            .select({ id: deliveries.id })
            .from(deliveries)
            .where(eq(deliveries.trackingNumber, candidate))
            .limit(1)

        if (!existing) {
            return candidate
        }
    }

    throw new Error("Could not generate a unique tracking number")
}

async function requireUserId() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    return session.user.id
}

async function requireAdminUserId() {
    const userId = await requireUserId()

    const [adminRole] = await db
        .select({ roleId: userRoles.roleId })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .where(and(eq(userRoles.userId, userId), ilike(roles.name, "admin")))
        .limit(1)

    if (!adminRole) {
        throw new Error("Forbidden")
    }

    return userId
}

function toNumber(value: number | string | null | undefined) {
    if (typeof value === "number") {
        return value
    }

    if (typeof value === "string") {
        return Number(value)
    }

    return 0
}

const lastKnownLocationSql = sql<string | null>`(
    select concat_ws(', ', dr.street_address, dr.country)
    from delivery_routes dr
    where dr.delivery_id = ${deliveries.id}
    order by coalesce(dr.reached_at, dr.created_at) desc, dr.sequence desc
    limit 1
)`

const locationCountSql = sql<number>`(
    select count(*)::int
    from delivery_routes dr
    where dr.delivery_id = ${deliveries.id}
)`

function toDeliveryLocationRow(row: DeliveryLocationDbRow): DeliveryLocationRow {
    return {
        id: row.id,
        sequence: row.sequence,
        streetAddress: row.streetAddress,
        country: row.country,
        fullAddress: `${row.streetAddress}, ${row.country}`,
        transitNote: row.transitNote,
        reachedAt: row.reachedAt ? row.reachedAt.toISOString() : null,
        isCurrentLocation: row.isCurrentLocation,
    }
}

async function getDeliveryLocations(deliveryId: string): Promise<DeliveryLocationRow[]> {
    const routeRows = await db
        .select({
            id: deliveryRoutes.id,
            sequence: deliveryRoutes.sequence,
            streetAddress: deliveryRoutes.streetAddress,
            country: deliveryRoutes.country,
            transitNote: deliveryRoutes.transitNote,
            reachedAt: deliveryRoutes.reachedAt,
            isCurrentLocation: deliveryRoutes.isCurrentLocation,
        })
        .from(deliveryRoutes)
        .where(eq(deliveryRoutes.deliveryId, deliveryId))
        .orderBy(deliveryRoutes.sequence)

    return routeRows.map((row) =>
        toDeliveryLocationRow({
            ...row,
            transitNote: row.transitNote ?? null,
        })
    )
}

function toDeliveryRowFromSummary(
    row: DeliverySummaryRow,
    locations: DeliveryLocationRow[] = []
) {
    return toDeliveryRow({
        ...row,
        status: row.status as DeliveryDbStatus,
        locationCount: toNumber(row.locationCount),
        locations,
    })
}

export async function getAccountOverviewDataAction(
    input: GetAccountOverviewInput = {}
): Promise<AccountOverviewData> {
    const userId = await requireUserId()
    const trackingCode = input.trackingCode?.trim()

    const [statsRaw] = await db
        .select({
            total: sql<number>`count(*)`,
            inTransit:
                sql<number>`count(*) filter (where ${deliveries.status} = 'in_transit')`,
            pending:
                sql<number>`count(*) filter (where ${deliveries.status} in ('pending', 'assigned'))`,
            delivered:
                sql<number>`count(*) filter (where ${deliveries.status} = 'delivered')`,
        })
        .from(deliveries)
        .where(eq(deliveries.userId, userId))

    const deliveryRows = await db
        .select({
            id: deliveries.id,
            trackingNumber: deliveries.trackingNumber,
            status: deliveries.status,
            pickupAddress: deliveries.pickupAddress,
            dropoffAddress: deliveries.dropoffAddress,
            deliveredAt: deliveries.deliveredAt,
            updatedAt: deliveries.updatedAt,
            lastKnownLocation: lastKnownLocationSql,
            locationCount: locationCountSql,
        })
        .from(deliveries)
        .where(eq(deliveries.userId, userId))
        .orderBy(desc(deliveries.updatedAt))
        .limit(50)

    const searchedDeliveryRow = trackingCode
        ? await db
            .select({
                id: deliveries.id,
                trackingNumber: deliveries.trackingNumber,
                status: deliveries.status,
                pickupAddress: deliveries.pickupAddress,
                dropoffAddress: deliveries.dropoffAddress,
                deliveredAt: deliveries.deliveredAt,
                updatedAt: deliveries.updatedAt,
                lastKnownLocation: lastKnownLocationSql,
                locationCount: locationCountSql,
            })
            .from(deliveries)
            .where(
                and(
                    eq(deliveries.userId, userId),
                    eq(deliveries.trackingNumber, trackingCode.toUpperCase())
                )
            )
            .limit(1)
        : []

    const searchedDeliveryLocations = searchedDeliveryRow.length
        ? await getDeliveryLocations(searchedDeliveryRow[0].id)
        : []

    const stats = {
        total: toNumber((statsRaw as OverviewStatsRow | undefined)?.total),
        inTransit: toNumber((statsRaw as OverviewStatsRow | undefined)?.inTransit),
        pending: toNumber((statsRaw as OverviewStatsRow | undefined)?.pending),
        delivered: toNumber((statsRaw as OverviewStatsRow | undefined)?.delivered),
    }

    return {
        stats,
        deliveries: deliveryRows.map((row) =>
            toDeliveryRowFromSummary(row as DeliverySummaryRow)
        ),
        searchedDelivery:
            searchedDeliveryRow.length > 0
                ? toDeliveryRowFromSummary(
                    searchedDeliveryRow[0] as DeliverySummaryRow,
                    searchedDeliveryLocations
                )
                : null,
    }
}

export async function updateDeliveryStatusAction(input: UpdateDeliveryStatusInput) {
    const userId = await requireUserId()

    const deliveredAt = input.status === "delivered" ? new Date() : null

    const [updatedRow] = await db
        .update(deliveries)
        .set({
            status: input.status,
            deliveredAt,
            updatedAt: new Date(),
        })
        .where(and(eq(deliveries.id, input.deliveryId), eq(deliveries.userId, userId)))
        .returning({
            id: deliveries.id,
            trackingNumber: deliveries.trackingNumber,
            status: deliveries.status,
            pickupAddress: deliveries.pickupAddress,
            dropoffAddress: deliveries.dropoffAddress,
            deliveredAt: deliveries.deliveredAt,
            updatedAt: deliveries.updatedAt,
        })

    if (!updatedRow) {
        throw new Error("Delivery not found")
    }

    return toDeliveryRow({
        ...updatedRow,
        status: updatedRow.status as DeliveryDbStatus,
        lastKnownLocation: null,
        locationCount: 0,
        locations: [],
    })
}

export async function getAdminDashboardDataAction(): Promise<AdminDashboardData> {
    await requireAdminUserId()

    const [statsRaw] = await db
        .select({
            total: sql<number>`count(*)`,
            inTransit:
                sql<number>`count(*) filter (where ${deliveries.status} = 'in_transit')`,
            pending:
                sql<number>`count(*) filter (where ${deliveries.status} in ('pending', 'assigned'))`,
            delivered:
                sql<number>`count(*) filter (where ${deliveries.status} = 'delivered')`,
            failed:
                sql<number>`count(*) filter (where ${deliveries.status} = 'failed')`,
            cancelled:
                sql<number>`count(*) filter (where ${deliveries.status} = 'cancelled')`,
        })
        .from(deliveries)

    const deliveryRows = await db
        .select({
            id: deliveries.id,
            trackingNumber: deliveries.trackingNumber,
            status: deliveries.status,
            pickupAddress: deliveries.pickupAddress,
            dropoffAddress: deliveries.dropoffAddress,
            deliveredAt: deliveries.deliveredAt,
            updatedAt: deliveries.updatedAt,
            lastKnownLocation: lastKnownLocationSql,
            locationCount: locationCountSql,
        })
        .from(deliveries)
        .orderBy(desc(deliveries.updatedAt))
        .limit(50)

    const trendRows = await db
        .select({
            day: sql<string>`to_char(date_trunc('day', ${deliveries.updatedAt}), 'YYYY-MM-DD')`,
            pending:
                sql<number>`count(*) filter (where ${deliveries.status} in ('pending', 'assigned'))`,
            inTransit:
                sql<number>`count(*) filter (where ${deliveries.status} = 'in_transit')`,
            delivered:
                sql<number>`count(*) filter (where ${deliveries.status} = 'delivered')`,
        })
        .from(deliveries)
        .groupBy(sql`date_trunc('day', ${deliveries.updatedAt})`)
        .orderBy(sql`date_trunc('day', ${deliveries.updatedAt}) asc`)
        .limit(90)

    return {
        stats: {
            total: toNumber((statsRaw as AdminOverviewStatsRow | undefined)?.total),
            inTransit: toNumber((statsRaw as AdminOverviewStatsRow | undefined)?.inTransit),
            pending: toNumber((statsRaw as AdminOverviewStatsRow | undefined)?.pending),
            delivered: toNumber((statsRaw as AdminOverviewStatsRow | undefined)?.delivered),
            failed: toNumber((statsRaw as AdminOverviewStatsRow | undefined)?.failed),
            cancelled: toNumber((statsRaw as AdminOverviewStatsRow | undefined)?.cancelled),
        },
        deliveries: deliveryRows.map((row) =>
            toDeliveryRowFromSummary(row as DeliverySummaryRow)
        ),
        trend: trendRows.map((row) => ({
            date: row.day,
            pending: toNumber((row as TrendRow).pending),
            inTransit: toNumber((row as TrendRow).inTransit),
            delivered: toNumber((row as TrendRow).delivered),
        })),
    }
}

export async function getAdminDeliveriesTableDataAction(
    input: AdminDeliveryTableFilters
): Promise<AdminDeliveryTableData> {
    await requireAdminUserId()

    const normalizedTrackingCode = input.trackingCode?.trim()
    const safeLimit = Math.min(Math.max(input.limit ?? 50, 1), 200)

    const filters = []

    if (input.status !== "all") {
        filters.push(eq(deliveries.status, input.status))
    }

    if (normalizedTrackingCode) {
        filters.push(ilike(deliveries.trackingNumber, `%${normalizedTrackingCode}%`))
    }

    if (input.dateRange !== "all") {
        const days = input.dateRange === "90d" ? 90 : input.dateRange === "30d" ? 30 : 7
        const dateFrom = new Date()
        dateFrom.setDate(dateFrom.getDate() - days)
        filters.push(gte(deliveries.updatedAt, dateFrom))
    }

    const rows = await db
        .select({
            id: deliveries.id,
            trackingNumber: deliveries.trackingNumber,
            status: deliveries.status,
            pickupAddress: deliveries.pickupAddress,
            dropoffAddress: deliveries.dropoffAddress,
            deliveredAt: deliveries.deliveredAt,
            updatedAt: deliveries.updatedAt,
            lastKnownLocation: lastKnownLocationSql,
            locationCount: locationCountSql,
        })
        .from(deliveries)
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(desc(deliveries.updatedAt))
        .limit(safeLimit)

    return {
        deliveries: rows.map((row) =>
            toDeliveryRowFromSummary(row as DeliverySummaryRow)
        ),
    }
}

export async function getDeliveryUsersForSelectAction(
    input: GetDeliveryUsersInput = {}
): Promise<DeliveryUserSelectData> {
    await requireAdminUserId()

    const normalizedQuery = input.emailQuery?.trim() ?? ""
    const pageSize = Math.min(Math.max(input.pageSize ?? 10, 1), 50)
    const page = Math.max(input.page ?? 1, 1)
    const offset = (page - 1) * pageSize

    const whereClause = normalizedQuery
        ? ilike(user.email, `%${normalizedQuery}%`)
        : undefined

    const [countRow] = await db
        .select({ total: sql<number>`count(*)` })
        .from(user)
        .where(whereClause)

    const total = Number(countRow?.total ?? 0)
    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    const users = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
        })
        .from(user)
        .where(whereClause)
        .orderBy(user.email)
        .limit(pageSize)
        .offset(offset)

    return {
        users,
        page,
        pageSize,
        total,
        totalPages,
    }
}

export async function searchOpenStreetAddressesAction(
    input: SearchOpenStreetAddressesInput
): Promise<OpenStreetAddressSearchData> {
    await requireAdminUserId()

    const normalizedQuery = input.query.trim()
    if (normalizedQuery.length < 3) {
        return { results: [] }
    }

    const limit = Math.min(Math.max(input.limit ?? 6, 1), 10)
    const params = new URLSearchParams({
        q: normalizedQuery,
        format: "jsonv2",
        addressdetails: "1",
        limit: String(limit),
    })

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${params.toString()}`,
            {
                headers: {
                    "User-Agent": "Lyftberan/1.0 (admin-address-search)",
                    "Accept-Language": "en",
                },
                cache: "no-store",
            }
        )

        if (!response.ok) {
            return { results: [] }
        }

        const rows = (await response.json()) as Array<{
            display_name?: string
            address?: {
                road?: string
                pedestrian?: string
                neighbourhood?: string
                suburb?: string
                city?: string
                town?: string
                village?: string
                country?: string
            }
        }>

        const results = rows.map((row) => {
            const street =
                row.address?.road ??
                row.address?.pedestrian ??
                row.address?.neighbourhood ??
                row.address?.suburb ??
                row.address?.city ??
                row.address?.town ??
                row.address?.village ??
                ""

            return {
                displayName: row.display_name ?? "",
                street,
                country: row.address?.country ?? "",
            }
        }).filter((entry) => entry.displayName.length > 0)

        return { results }
    } catch {
        return { results: [] }
    }
}

export async function createDeliveryByAdminAction(
    input: CreateDeliveryByAdminInput
) {
    await requireAdminUserId()

    const trackingNumber = await generateUniqueTrackingNumber()

    const payload = createDeliveryByAdminSchema.omit({ trackingNumber: true }).parse({
        ...input,
        userId: input.userId.trim(),
        pickupAddress: input.pickupAddress.trim(),
        dropoffAddress: input.dropoffAddress.trim(),
        notes: input.notes?.trim() || null,
    })

    const [created] = await db
        .insert(deliveries)
        .values({
            trackingNumber,
            userId: payload.userId,
            status: payload.status,
            pickupAddress: payload.pickupAddress,
            dropoffAddress: payload.dropoffAddress,
            notes: payload.notes ?? null,
            updatedAt: new Date(),
        })
        .returning({
            id: deliveries.id,
            trackingNumber: deliveries.trackingNumber,
            status: deliveries.status,
            pickupAddress: deliveries.pickupAddress,
            dropoffAddress: deliveries.dropoffAddress,
            deliveredAt: deliveries.deliveredAt,
            updatedAt: deliveries.updatedAt,
        })

    if (!created) {
        throw new Error("Could not create delivery")
    }

    return toDeliveryRow({
        ...created,
        status: created.status as DeliveryDbStatus,
        lastKnownLocation: null,
        locationCount: 0,
        locations: [],
    })
}

export async function updateDeliveryByAdminAction(
    input: UpdateDeliveryByAdminInput
) {
    await requireAdminUserId()

    const payload = updateDeliveryRouteByAdminSchema
        .extend({
            status: createDeliveryByAdminSchema.shape.status,
        })
        .parse({
            ...input,
            deliveryId: input.deliveryId,
            pickupAddress: input.pickupAddress.trim(),
            dropoffAddress: input.dropoffAddress.trim(),
            notes: input.notes?.trim() || null,
        })

    const deliveredAt = payload.status === "delivered" ? new Date() : null

    const [updated] = await db
        .update(deliveries)
        .set({
            status: payload.status,
            pickupAddress: payload.pickupAddress,
            dropoffAddress: payload.dropoffAddress,
            notes: payload.notes ?? null,
            deliveredAt,
            updatedAt: new Date(),
        })
        .where(eq(deliveries.id, payload.deliveryId))
        .returning({
            id: deliveries.id,
            trackingNumber: deliveries.trackingNumber,
            status: deliveries.status,
            pickupAddress: deliveries.pickupAddress,
            dropoffAddress: deliveries.dropoffAddress,
            deliveredAt: deliveries.deliveredAt,
            updatedAt: deliveries.updatedAt,
        })

    if (!updated) {
        throw new Error("Delivery not found")
    }

    return toDeliveryRow({
        ...updated,
        status: updated.status as DeliveryDbStatus,
        lastKnownLocation: null,
        locationCount: 0,
        locations: [],
    })
}

export async function deleteDeliveryByAdminAction(
    input: DeleteDeliveryByAdminInput
) {
    await requireAdminUserId()

    const parsed = updateDeliveryRouteByAdminSchema.pick({
        deliveryId: true,
    }).parse({
        deliveryId: input.deliveryId,
    })

    const [deleted] = await db
        .delete(deliveries)
        .where(eq(deliveries.id, parsed.deliveryId))
        .returning({
            id: deliveries.id,
        })

    if (!deleted) {
        throw new Error("Delivery not found")
    }

    return { id: deleted.id }
}

export async function getDeliveryLocationsByAdminAction(
    input: GetDeliveryLocationsByAdminInput
) {
    await requireAdminUserId()

    const parsed = updateDeliveryRouteByAdminSchema.pick({
        deliveryId: true,
    }).parse({
        deliveryId: input.deliveryId,
    })

    return getDeliveryLocations(parsed.deliveryId)
}

export async function createDeliveryLocationByAdminAction(
    input: CreateDeliveryLocationByAdminInput
) {
    await requireAdminUserId()

    const payload = createDeliveryLocationByAdminSchema.parse({
        ...input,
        deliveryId: input.deliveryId,
        streetAddress: input.streetAddress.trim(),
        country: input.country.trim(),
        transitNote: input.transitNote?.trim() || null,
        reachedAt: input.reachedAt ?? null,
        isCurrentLocation: input.isCurrentLocation ?? false,
    })

    const [deliveryRow] = await db
        .select({ id: deliveries.id })
        .from(deliveries)
        .where(eq(deliveries.id, payload.deliveryId))
        .limit(1)

    if (!deliveryRow) {
        throw new Error("Delivery not found")
    }

    const [maxSequenceRow] = await db
        .select({ maxSequence: sql<number>`coalesce(max(${deliveryRoutes.sequence}), 0)` })
        .from(deliveryRoutes)
        .where(eq(deliveryRoutes.deliveryId, payload.deliveryId))

    const nextSequence = toNumber(maxSequenceRow?.maxSequence) + 1

    if (payload.isCurrentLocation) {
        await db
            .update(deliveryRoutes)
            .set({
                isCurrentLocation: false,
                updatedAt: new Date(),
            })
            .where(eq(deliveryRoutes.deliveryId, payload.deliveryId))
    }

    const [created] = await db
        .insert(deliveryRoutes)
        .values({
            deliveryId: payload.deliveryId,
            sequence: nextSequence,
            streetAddress: payload.streetAddress,
            country: payload.country,
            transitNote: payload.transitNote ?? null,
            reachedAt: payload.reachedAt ?? null,
            isCurrentLocation: payload.isCurrentLocation ?? false,
            updatedAt: new Date(),
        })
        .returning({
            id: deliveryRoutes.id,
            sequence: deliveryRoutes.sequence,
            streetAddress: deliveryRoutes.streetAddress,
            country: deliveryRoutes.country,
            transitNote: deliveryRoutes.transitNote,
            reachedAt: deliveryRoutes.reachedAt,
            isCurrentLocation: deliveryRoutes.isCurrentLocation,
        })

    if (!created) {
        throw new Error("Could not create delivery location")
    }

    await db
        .update(deliveries)
        .set({ updatedAt: new Date() })
        .where(eq(deliveries.id, payload.deliveryId))

    return toDeliveryLocationRow({
        ...created,
        transitNote: created.transitNote ?? null,
    })
}

export async function updateDeliveryLocationByAdminAction(
    input: UpdateDeliveryLocationByAdminInput
) {
    await requireAdminUserId()

    const payload = updateDeliveryLocationByAdminSchema.parse({
        ...input,
        locationId: input.locationId,
        streetAddress: input.streetAddress.trim(),
        country: input.country.trim(),
        transitNote: input.transitNote?.trim() || null,
        reachedAt: input.reachedAt ?? null,
        isCurrentLocation: input.isCurrentLocation ?? false,
    })

    const [existingLocation] = await db
        .select({
            id: deliveryRoutes.id,
            deliveryId: deliveryRoutes.deliveryId,
        })
        .from(deliveryRoutes)
        .where(eq(deliveryRoutes.id, payload.locationId))
        .limit(1)

    if (!existingLocation) {
        throw new Error("Delivery location not found")
    }

    if (payload.isCurrentLocation) {
        await db
            .update(deliveryRoutes)
            .set({
                isCurrentLocation: false,
                updatedAt: new Date(),
            })
            .where(eq(deliveryRoutes.deliveryId, existingLocation.deliveryId))
    }

    const [updated] = await db
        .update(deliveryRoutes)
        .set({
            streetAddress: payload.streetAddress,
            country: payload.country,
            transitNote: payload.transitNote ?? null,
            reachedAt: payload.reachedAt ?? null,
            isCurrentLocation: payload.isCurrentLocation ?? false,
            updatedAt: new Date(),
        })
        .where(eq(deliveryRoutes.id, payload.locationId))
        .returning({
            id: deliveryRoutes.id,
            sequence: deliveryRoutes.sequence,
            streetAddress: deliveryRoutes.streetAddress,
            country: deliveryRoutes.country,
            transitNote: deliveryRoutes.transitNote,
            reachedAt: deliveryRoutes.reachedAt,
            isCurrentLocation: deliveryRoutes.isCurrentLocation,
        })

    if (!updated) {
        throw new Error("Delivery location not found")
    }

    await db
        .update(deliveries)
        .set({ updatedAt: new Date() })
        .where(eq(deliveries.id, existingLocation.deliveryId))

    return toDeliveryLocationRow({
        ...updated,
        transitNote: updated.transitNote ?? null,
    })
}

export async function deleteDeliveryLocationByAdminAction(
    input: DeleteDeliveryLocationByAdminInput
) {
    await requireAdminUserId()

    const parsed = deleteDeliveryLocationByAdminSchema.parse({
        locationId: input.locationId,
    })

    const [deleted] = await db
        .delete(deliveryRoutes)
        .where(eq(deliveryRoutes.id, parsed.locationId))
        .returning({
            id: deliveryRoutes.id,
            deliveryId: deliveryRoutes.deliveryId,
        })

    if (!deleted) {
        throw new Error("Delivery location not found")
    }

    await db
        .update(deliveries)
        .set({ updatedAt: new Date() })
        .where(eq(deliveries.id, deleted.deliveryId))

    return { id: deleted.id }
}

export async function trackDeliveryByCodeAction(input: TrackDeliveryByCodeInput) {
    const trackingCode = input.trackingCode.trim().toUpperCase()
    if (!trackingCode) {
        return null
    }

    const [deliveryRow] = await db
        .select({
            id: deliveries.id,
            trackingNumber: deliveries.trackingNumber,
            status: deliveries.status,
            pickupAddress: deliveries.pickupAddress,
            dropoffAddress: deliveries.dropoffAddress,
            deliveredAt: deliveries.deliveredAt,
            updatedAt: deliveries.updatedAt,
            lastKnownLocation: lastKnownLocationSql,
            locationCount: locationCountSql,
        })
        .from(deliveries)
        .where(eq(deliveries.trackingNumber, trackingCode))
        .limit(1)

    if (!deliveryRow) {
        return null
    }

    const locations = await getDeliveryLocations(deliveryRow.id)

    return toDeliveryRowFromSummary(deliveryRow as DeliverySummaryRow, locations)
}
