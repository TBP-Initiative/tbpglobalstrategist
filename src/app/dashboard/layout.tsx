"use client"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import DashboardLayout from "@/components/layout/dashboard-layout"

const adminPaths = ["/dashboard/users", "/dashboard/projects", "/dashboard/analytics", "/dashboard/system", "/dashboard/settings", "/dashboard/admin"]

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const role =
    pathname.startsWith("/dashboard/individual")
      ? "individual"
      : adminPaths.some((p) => pathname.startsWith(p)) || pathname.startsWith("/dashboard/admin")
        ? "admin"
        : "individual"

  const user = session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        organization: "TBP Global",
      }
    : role === "admin"
      ? { name: "System Admin", email: "admin@tbpglobal.com", organization: "TBP Global" }
      : { name: "Strategist", email: "strategist@tbpglobal.com", organization: "TBP Global" }

  return (
    <DashboardLayout role={role} user={user}>
      {children}
    </DashboardLayout>
  )
}
