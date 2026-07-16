import { redirect } from "next/navigation"

import { promoteAuthenticatedUserToAdminAction } from "@/app/actions/admin-users"

type BecomeAdminPageProps = {
  searchParams?: Promise<{
    token?: string
  }>
}

export default async function BecomeAdminPage({
  searchParams,
}: BecomeAdminPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}

  try {
    await promoteAuthenticatedUserToAdminAction({
      token: resolvedSearchParams.token,
    })
  } catch {
    redirect("/")
  }

  redirect("/admin/dashboard")
}
