"use server"

import {
    and,
    desc,
    eq,
    gt,
    ilike,
    inArray,
    or,
    sql,
} from "drizzle-orm"
import { headers } from "next/headers"
import { hashPassword } from "better-auth/crypto"

import { account, passkey, session, twoFactor, user } from "@/drizzle/schema/auth"
import { roles, userRoles } from "@/drizzle/schema/roles"
import {
    type AdminUserDetails,
    type AdminUsersListData,
    type AdminUserSummary,
} from "@/types"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { renderMarketingEmailTemplate } from "@/lib/email-template-react"
import { sendEmail } from "@/lib/messaging"

type GetAdminUsersInput = {
    query?: string
    page?: number
    pageSize?: number
}

type GetAdminUserDetailsInput = {
    userId: string
}

type TerminateSessionInput = {
    sessionId: string
}

type TerminateAllSessionsInput = {
    userId: string
}

type SetUserBlockedInput = {
    userId: string
    blocked: boolean
}

type UpdateUserRolesInput = {
    userId: string
    roleNames: string[]
}

type CreateActivatedUserInput = {
    name: string
    email: string
    password: string
    roleNames?: string[]
}

type PromoteAuthenticatedUserInput = {
    token?: string
}

type SendPromotionalBulkEmailInput = {
    subject: string
    message: string
    discountCode?: string
    audienceQuery?: string
    ctaUrl?: string
}

async function requireAuthenticatedUserId() {
    const authSession = await auth.api.getSession({
        headers: await headers(),
    })

    if (!authSession?.user?.id) {
        throw new Error("Unauthorized")
    }

    return authSession.user.id
}

async function requireAdminUserId() {
    const authSession = await auth.api.getSession({
        headers: await headers(),
    })

    if (!authSession?.user?.id) {
        throw new Error("Unauthorized")
    }

    const [adminRole] = await db
        .select({ roleId: userRoles.roleId })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .where(and(eq(userRoles.userId, authSession.user.id), ilike(roles.name, "admin")))
        .limit(1)

    if (!adminRole) {
        throw new Error("Forbidden")
    }

    return authSession.user.id
}

function toIso(value: Date | null) {
    return value ? value.toISOString() : null
}

function normalizeRoles(roleNames: string[]) {
    return roleNames.map((role) => role.toLowerCase())
}

function sanitizeRoleNames(roleNames: string[]) {
    return Array.from(
        new Set(
            roleNames
                .map((role) => role.trim())
                .filter((role) => role.length > 0)
        )
    )
}

export async function getAdminUsersDataAction(
    input: GetAdminUsersInput = {}
): Promise<AdminUsersListData> {
    await requireAdminUserId()

    const pageSize = Math.min(Math.max(input.pageSize ?? 20, 1), 100)
    const requestedPage = Math.max(input.page ?? 1, 1)
    const normalizedQuery = input.query?.trim()

    const [countRow] = await db
        .select({ total: sql<number>`count(*)` })
        .from(user)
        .where(normalizedQuery ? orLikeUser(normalizedQuery) : undefined)

    const total = Number(countRow?.total ?? 0)
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const page = Math.min(requestedPage, totalPages)
    const offset = (page - 1) * pageSize

    const users = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            twoFactorEnabled: user.twoFactorEnabled,
        })
        .from(user)
        .where(normalizedQuery ? orLikeUser(normalizedQuery) : undefined)
        .orderBy(desc(user.createdAt))
        .limit(pageSize)
        .offset(offset)

    if (users.length === 0) {
        return {
            users: [],
            pagination: {
                page,
                pageSize,
                total,
                totalPages,
            },
        }
    }

    const userIds = users.map((item) => item.id)

    const [userRoleRows, passkeyRows, sessionRows] = await Promise.all([
        db
            .select({ userId: userRoles.userId, roleName: roles.name })
            .from(userRoles)
            .innerJoin(roles, eq(userRoles.roleId, roles.id))
            .where(inArray(userRoles.userId, userIds)),
        db
            .select({ userId: passkey.userId })
            .from(passkey)
            .where(inArray(passkey.userId, userIds)),
        db
            .select({ userId: session.userId })
            .from(session)
            .where(and(inArray(session.userId, userIds), gt(session.expiresAt, new Date()))),
    ])

    const rolesByUser = new Map<string, string[]>()
    for (const row of userRoleRows) {
        const existing = rolesByUser.get(row.userId) ?? []
        existing.push(row.roleName)
        rolesByUser.set(row.userId, existing)
    }

    const passkeysCountByUser = new Map<string, number>()
    for (const row of passkeyRows) {
        passkeysCountByUser.set(row.userId, (passkeysCountByUser.get(row.userId) ?? 0) + 1)
    }

    const sessionsCountByUser = new Map<string, number>()
    for (const row of sessionRows) {
        sessionsCountByUser.set(row.userId, (sessionsCountByUser.get(row.userId) ?? 0) + 1)
    }

    const mappedUsers: AdminUserSummary[] = users.map((item) => {
        const roleNames = rolesByUser.get(item.id) ?? []
        const normalizedRoleNames = normalizeRoles(roleNames)

        return {
            id: item.id,
            name: item.name,
            email: item.email,
            createdAt: item.createdAt.toISOString(),
            roles: roleNames,
            isBlocked: normalizedRoleNames.includes("blocked"),
            mfaEnabled: item.twoFactorEnabled,
            passkeysCount: passkeysCountByUser.get(item.id) ?? 0,
            activeSessionsCount: sessionsCountByUser.get(item.id) ?? 0,
        }
    })

    return {
        users: mappedUsers,
        pagination: {
            page,
            pageSize,
            total,
            totalPages,
        },
    }
}

function orLikeUser(query: string) {
    const value = `%${query}%`
    return or(ilike(user.name, value), ilike(user.email, value))
}

export async function getAdminUserDetailsAction(
    input: GetAdminUserDetailsInput
): Promise<AdminUserDetails> {
    await requireAdminUserId()

    const [targetUser] = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            twoFactorEnabled: user.twoFactorEnabled,
        })
        .from(user)
        .where(eq(user.id, input.userId))
        .limit(1)

    if (!targetUser) {
        throw new Error("User not found")
    }

    const [roleRows, availableRolesRows, passkeyRows, sessionRows, mfaRows] =
        await Promise.all([
            db
                .select({ roleName: roles.name })
                .from(userRoles)
                .innerJoin(roles, eq(userRoles.roleId, roles.id))
                .where(eq(userRoles.userId, input.userId)),
            db.select({ roleName: roles.name }).from(roles).orderBy(roles.name),
            db
                .select({
                    id: passkey.id,
                    name: passkey.name,
                    deviceType: passkey.deviceType,
                    backedUp: passkey.backedUp,
                    createdAt: passkey.createdAt,
                })
                .from(passkey)
                .where(eq(passkey.userId, input.userId))
                .orderBy(desc(passkey.createdAt)),
            db
                .select({
                    id: session.id,
                    createdAt: session.createdAt,
                    updatedAt: session.updatedAt,
                    expiresAt: session.expiresAt,
                    ipAddress: session.ipAddress,
                    userAgent: session.userAgent,
                })
                .from(session)
                .where(and(eq(session.userId, input.userId), gt(session.expiresAt, new Date())))
                .orderBy(desc(session.updatedAt)),
            db
                .select({
                    verified: twoFactor.verified,
                    failedVerificationCount: twoFactor.failedVerificationCount,
                    lockedUntil: twoFactor.lockedUntil,
                })
                .from(twoFactor)
                .where(eq(twoFactor.userId, input.userId))
                .limit(1),
        ])

    const roleNames = roleRows.map((row) => row.roleName)
    const normalizedRoleNames = normalizeRoles(roleNames)

    return {
        user: {
            id: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
            createdAt: targetUser.createdAt.toISOString(),
            roles: roleNames,
            isBlocked: normalizedRoleNames.includes("blocked"),
            mfaEnabled: targetUser.twoFactorEnabled,
            passkeysCount: passkeyRows.length,
            activeSessionsCount: sessionRows.length,
        },
        availableRoles: availableRolesRows.map((row) => row.roleName),
        sessions: sessionRows.map((row) => ({
            id: row.id,
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
            expiresAt: row.expiresAt.toISOString(),
            ipAddress: row.ipAddress,
            userAgent: row.userAgent,
        })),
        passkeys: passkeyRows.map((row) => ({
            id: row.id,
            name: row.name,
            deviceType: row.deviceType,
            backedUp: row.backedUp,
            createdAt: toIso(row.createdAt),
        })),
        mfa: {
            enabled: targetUser.twoFactorEnabled,
            verified: mfaRows[0]?.verified ?? false,
            failedVerificationCount: mfaRows[0]?.failedVerificationCount ?? 0,
            lockedUntil: toIso(mfaRows[0]?.lockedUntil ?? null),
        },
    }
}

export async function terminateSessionAction(input: TerminateSessionInput) {
    await requireAdminUserId()

    await db.delete(session).where(eq(session.id, input.sessionId))

    return { success: true }
}

export async function terminateAllUserSessionsAction(input: TerminateAllSessionsInput) {
    await requireAdminUserId()

    await db.delete(session).where(eq(session.userId, input.userId))

    return { success: true }
}

async function getOrCreateBlockedRoleId() {
    const [existing] = await db
        .select({ id: roles.id })
        .from(roles)
        .where(ilike(roles.name, "blocked"))
        .limit(1)

    if (existing) {
        return existing.id
    }

    const [created] = await db
        .insert(roles)
        .values({
            name: "blocked",
            description: "User is blocked from platform access",
        })
        .returning({ id: roles.id })

    return created.id
}

async function getOrCreateAdminRoleId() {
    const [existing] = await db
        .select({ id: roles.id })
        .from(roles)
        .where(ilike(roles.name, "admin"))
        .limit(1)

    if (existing) {
        return existing.id
    }

    const [created] = await db
        .insert(roles)
        .values({
            name: "admin",
            description: "Administrative access role",
        })
        .returning({ id: roles.id })

    return created.id
}

export async function setUserBlockedAction(input: SetUserBlockedInput) {
    await requireAdminUserId()

    const blockedRoleId = await getOrCreateBlockedRoleId()

    const [existingRole] = await db
        .select({ roleId: userRoles.roleId })
        .from(userRoles)
        .where(and(eq(userRoles.userId, input.userId), eq(userRoles.roleId, blockedRoleId)))
        .limit(1)

    if (input.blocked) {
        if (!existingRole) {
            await db.insert(userRoles).values({
                userId: input.userId,
                roleId: blockedRoleId,
            })
        }

        await db.delete(session).where(eq(session.userId, input.userId))
    } else if (existingRole) {
        await db
            .delete(userRoles)
            .where(and(eq(userRoles.userId, input.userId), eq(userRoles.roleId, blockedRoleId)))
    }

    return { success: true }
}

export async function updateUserRolesAction(input: UpdateUserRolesInput) {
    await requireAdminUserId()

    const uniqueRoleNames = sanitizeRoleNames(input.roleNames)

    const matchedRoles = uniqueRoleNames.length
        ? await db
            .select({ id: roles.id, name: roles.name })
            .from(roles)
            .where(inArray(roles.name, uniqueRoleNames))
        : []

    await db.transaction(async (tx) => {
        await tx.delete(userRoles).where(eq(userRoles.userId, input.userId))

        if (matchedRoles.length > 0) {
            await tx.insert(userRoles).values(
                matchedRoles.map((role) => ({
                    userId: input.userId,
                    roleId: role.id,
                }))
            )
        }
    })

    if (uniqueRoleNames.includes("blocked")) {
        await db.delete(session).where(eq(session.userId, input.userId))
    }

    return { success: true }
}

export async function createActivatedUserByAdminAction(
    input: CreateActivatedUserInput
) {
    await requireAdminUserId()

    const name = input.name.trim()
    const email = input.email.trim().toLowerCase()
    const password = input.password

    if (!name || !email || !password) {
        throw new Error("Name, email, and password are required")
    }

    const [existingUser] = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, email))
        .limit(1)

    if (existingUser) {
        throw new Error("A user with this email already exists")
    }

    const now = new Date()
    const userId = crypto.randomUUID()
    const accountId = crypto.randomUUID()
    const hashedPassword = await hashPassword(password)

    const requestedRoleNames = sanitizeRoleNames(input.roleNames ?? [])
    const matchedRoles = requestedRoleNames.length
        ? await db
            .select({ id: roles.id, name: roles.name })
            .from(roles)
            .where(inArray(roles.name, requestedRoleNames))
        : []

    await db.transaction(async (tx) => {
        await tx.insert(user).values({
            id: userId,
            name,
            email,
            emailVerified: true,
            twoFactorEnabled: false,
            image: null,
            createdAt: now,
            updatedAt: now,
        })

        await tx.insert(account).values({
            id: accountId,
            accountId: userId,
            providerId: "credential",
            userId,
            password: hashedPassword,
            createdAt: now,
            updatedAt: now,
        })

        if (matchedRoles.length > 0) {
            await tx.insert(userRoles).values(
                matchedRoles.map((role) => ({
                    userId,
                    roleId: role.id,
                }))
            )
        }
    })

    return { success: true, userId }
}

export async function promoteAuthenticatedUserToAdminAction(
    input: PromoteAuthenticatedUserInput
) {
    const userId = await requireAuthenticatedUserId()

    const configuredToken = process.env.ADMIN_BOOTSTRAP_TOKEN
    if (!configuredToken || input.token !== configuredToken) {
        throw new Error("Forbidden")
    }

    const adminRoleId = await getOrCreateAdminRoleId()

    const [existingRole] = await db
        .select({ roleId: userRoles.roleId })
        .from(userRoles)
        .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, adminRoleId)))
        .limit(1)

    if (!existingRole) {
        await db.insert(userRoles).values({
            userId,
            roleId: adminRoleId,
        })
    }

    return { success: true }
}

export async function sendPromotionalBulkEmailAction(
    input: SendPromotionalBulkEmailInput
) {
    await requireAdminUserId()

    const subject = input.subject.trim()
    const message = input.message.trim()
    const discountCode = input.discountCode?.trim() ?? ""
    const audienceQuery = input.audienceQuery?.trim().toLowerCase() ?? ""
    const ctaUrl = input.ctaUrl?.trim() ?? ""

    if (!subject || !message) {
        throw new Error("Subject and message are required")
    }

    const allUsers = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
        })
        .from(user)

    const blockedRows = await db
        .select({ userId: userRoles.userId })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .where(ilike(roles.name, "blocked"))

    const blockedUserIds = new Set(blockedRows.map((row) => row.userId))

    const recipients = allUsers.filter((candidate) => {
        if (blockedUserIds.has(candidate.id)) {
            return false
        }

        if (!audienceQuery) {
            return true
        }

        const haystack = `${candidate.name} ${candidate.email}`.toLowerCase()
        return haystack.includes(audienceQuery)
    })

    if (recipients.length === 0) {
        throw new Error("No eligible users matched the selected audience")
    }

    const results = await Promise.allSettled(
        recipients.map(async (recipient) => {
            const rendered = await renderMarketingEmailTemplate({
                subject,
                recipientName: recipient.name,
                messageText: message,
                discountCode,
                ctaUrl,
            })

            return sendEmail({
                to: recipient.email,
                subject: rendered.subject,
                html: rendered.htmlBody,
                text: rendered.textBody,
            })
        })
    )

    const sentCount = results.filter((result) => result.status === "fulfilled").length
    const failedCount = results.length - sentCount

    return {
        success: true,
        recipients: recipients.length,
        sentCount,
        failedCount,
    }
}
