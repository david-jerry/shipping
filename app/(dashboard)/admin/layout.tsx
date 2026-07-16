import { and, eq, ilike } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { roles, userRoles } from "@/drizzle/schema/roles"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function requireAdminAccess() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const [adminRole] = await db
    .select({ roleId: userRoles.roleId })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(
      and(eq(userRoles.userId, session.user.id), ilike(roles.name, "admin"))
    )
    .limit(1)

  if (!adminRole) {
    redirect("/accounts")
  }
}

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminAccess()

  return children
}
