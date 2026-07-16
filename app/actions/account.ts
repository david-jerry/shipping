"use server"

import { and, eq, ilike } from "drizzle-orm"
import { headers } from "next/headers"

import { roles, userRoles } from "@/drizzle/schema/roles"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type AccountSidebarMeta = {
    isAdmin: boolean
}

export async function getAccountSidebarMetaAction(): Promise<AccountSidebarMeta> {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.id) {
        return { isAdmin: false }
    }

    const [adminRole] = await db
        .select({ roleId: userRoles.roleId })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .where(and(eq(userRoles.userId, session.user.id), ilike(roles.name, "admin")))
        .limit(1)

    return {
        isAdmin: !!adminRole,
    }
}
