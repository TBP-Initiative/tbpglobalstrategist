import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SystemClient } from "./system-client"

export default async function AdminSystemPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard")

  const [userCount, projectCount, orgCount, messageCount, activityCount] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.organization.count(),
    prisma.message.count(),
    prisma.activityLog.count(),
  ])

  return (
    <SystemClient
      stats={{
        userCount,
        projectCount,
        orgCount,
        messageCount,
        activityCount,
        uptime: process.uptime(),
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage(),
      }}
    />
  )
}
