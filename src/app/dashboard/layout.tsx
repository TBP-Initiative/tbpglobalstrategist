"use client"

import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Loader2 } from "lucide-react"

const adminPaths = ["/dashboard/users", "/dashboard/projects", "/dashboard/analytics", "/dashboard/system", "/dashboard/settings", "/dashboard/admin"]

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isActive, setIsActive] = useState<boolean | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (!session?.user?.email) {
      router.push("/login")
      return
    }

    fetch("/api/auth/check-active", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.inactive) {
          router.push("/onboarding")
        } else {
          setIsActive(true)
        }
      })
      .catch(() => {
        setIsActive(true)
      })
  }, [session, status, router])

  if (status === "loading" || isActive === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 size={24} className="mx-auto animate-spin text-gray-400" />
          <p className="mt-3 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

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
