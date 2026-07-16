"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ShieldCheck, User } from "lucide-react"

import { getAccountSidebarMetaAction } from "@/app/actions/account"

type ShellItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const accountItems: ShellItem[] = [
  { href: "/accounts", label: "Overview", icon: LayoutDashboard },
  { href: "/accounts/profile", label: "Profile & Settings", icon: User },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: sidebarMeta } = useQuery({
    queryKey: ["account", "sidebar", "meta"],
    queryFn: () => getAccountSidebarMetaAction(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-24 sm:px-6 lg:px-8">
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-24 rounded-xl border border-border bg-card/70 p-3 backdrop-blur">
          <p className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Accounts
          </p>
          <nav className="space-y-1">
            {accountItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {sidebarMeta?.isAdmin ? (
            <div className="mt-3 border-t border-border pt-3">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ShieldCheck className="h-4 w-4" />
                Switch to Admin
              </Link>
            </div>
          ) : null}
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
