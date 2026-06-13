"use client"

import { usePathname } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"

const adminPaths = ["/dashboard/users", "/dashboard/projects", "/dashboard/analytics", "/dashboard/system", "/dashboard/settings", "/dashboard/admin"]

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const role =
    pathname.startsWith("/dashboard/individual")
      ? "individual"
      : pathname.startsWith("/dashboard/corporate")
        ? "corporate"
        : adminPaths.some((p) => pathname.startsWith(p)) || pathname.startsWith("/dashboard/admin")
          ? "admin"
          : "individual"

  const user =
    role === "corporate"
      ? { name: "Acme Corp", email: "admin@acmecorp.com", organization: "Acme Corporation" }
      : role === "admin"
        ? { name: "System Admin", email: "admin@tbpglobal.com", organization: "TBP Global" }
        : { name: "Alex Strategist", email: "alex@example.com", organization: "TBP Global" }

  return (
    <DashboardLayout role={role} user={user}>
      {children}
    </DashboardLayout>
  )
}
