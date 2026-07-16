import { Navbar } from "@/components/layout/Header"
import { DashboardShell } from "@/components/layout/DashboardShell"

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DashboardShell>{children}</DashboardShell>
      </main>
    </>
  )
}
