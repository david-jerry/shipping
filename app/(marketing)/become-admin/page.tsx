import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { promoteAuthenticatedUserToAdminAction } from "@/app/actions/admin-users"
import { buildMarketingMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMarketingMetadata({
  title: "Admin Bootstrap | Lyftberan",
  description:
    "Internal admin bootstrap route for authorized account promotion.",
  path: "/become-admin",
  noIndex: true,
})

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
