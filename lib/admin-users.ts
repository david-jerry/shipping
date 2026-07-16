export type AdminUserSummary = {
    id: string
    name: string
    email: string
    createdAt: string
    roles: string[]
    isBlocked: boolean
    mfaEnabled: boolean
    passkeysCount: number
    activeSessionsCount: number
}

export type AdminUsersListData = {
    users: AdminUserSummary[]
}

export type AdminUserSession = {
    id: string
    createdAt: string
    updatedAt: string
    expiresAt: string
    ipAddress: string | null
    userAgent: string | null
}

export type AdminUserPasskey = {
    id: string
    name: string | null
    deviceType: string
    backedUp: boolean
    createdAt: string | null
}

export type AdminUserDetails = {
    user: AdminUserSummary
    availableRoles: string[]
    sessions: AdminUserSession[]
    passkeys: AdminUserPasskey[]
    mfa: {
        enabled: boolean
        verified: boolean
        failedVerificationCount: number
        lockedUntil: string | null
    }
}
