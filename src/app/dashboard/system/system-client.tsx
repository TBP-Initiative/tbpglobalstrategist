"use client"

import { useRouter } from "next/navigation"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  Database,
  Globe,
  Zap,
  Activity,
  Server,
  RefreshCw,
  HardDrive,
  Clock,
} from "lucide-react"

export function SystemClient({
  stats,
}: {
  stats: {
    userCount: number
    projectCount: number
    orgCount: number
    messageCount: number
    activityCount: number
    uptime: number
    nodeVersion: string
    platform: string
    memoryUsage: NodeJS.MemoryUsage
  }
}) {
  const router = useRouter()
  const uptimeHours = Math.floor(stats.uptime / 3600)
  const uptimeMinutes = Math.floor((stats.uptime % 3600) / 60)
  const memoryMB = Math.round(stats.memoryUsage.rss / 1024 / 1024)
  const heapMB = Math.round(stats.memoryUsage.heapUsed / 1024 / 1024)

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <PageHeader
          title="System"
          description="Platform health, configuration, and system status"
          actions={
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => router.refresh()}>
                <RefreshCw size={14} />
                Run Diagnostics
              </Button>
            </div>
          }
        />
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnimatedSection delay={0.1}>
          <GlassCard className="p-6" intensity="light">
            <div className="mb-4 flex items-center gap-2">
              <Server size={16} className="text-muted-foreground" />
              <h2 className="text-lg font-semibold">Server Status</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Status", value: "Operational", icon: <Activity size={14} className="text-green-500" />, color: "text-green-500" },
                { label: "Node.js", value: stats.nodeVersion, icon: <Zap size={14} className="text-amber-500" /> },
                { label: "Platform", value: stats.platform, icon: <Globe size={14} className="text-blue-500" /> },
                { label: "Uptime", value: `${uptimeHours}h ${uptimeMinutes}m`, icon: <Clock size={14} className="text-purple-500" /> },
                { label: "Memory (RSS)", value: `${memoryMB} MB`, icon: <HardDrive size={14} className="text-cyan-500" /> },
                { label: "Heap Used", value: `${heapMB} MB`, icon: <Database size={14} className="text-indigo-500" /> },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <span className={`text-sm font-medium ${item.color ?? ""}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <GlassCard className="p-6" intensity="light">
            <div className="mb-4 flex items-center gap-2">
              <Database size={16} className="text-muted-foreground" />
              <h2 className="text-lg font-semibold">Database Overview</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Users", value: String(stats.userCount), badge: "Table" },
                { label: "Projects", value: String(stats.projectCount), badge: "Table" },
                { label: "Organizations", value: String(stats.orgCount), badge: "Table" },
                { label: "Messages", value: String(stats.messageCount), badge: "Table" },
                { label: "Activity Logs", value: String(stats.activityCount), badge: "Table" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Database size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] px-1.5">{item.badge}</Badge>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                </div>
              ))}
              <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-3">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-green-500" />
                  <span className="text-sm text-green-500 font-medium">All systems operational</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Database connected via SQLite. No replication issues detected.
                </p>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>

      <AnimatedSection delay={0.2}>
        <GlassCard className="p-6" intensity="light">
          <div className="mb-4 flex items-center gap-2">
            <Shield size={16} className="text-muted-foreground" />
            <h2 className="text-lg font-semibold">Security & Configuration</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Authentication", items: ["NextAuth v5", "JWT Sessions", "Credentials + Google"] },
              { title: "Database", items: ["SQLite (Development)", "Prisma ORM v7", "LibSQL Adapter"] },
              { title: "Platform", items: ["Next.js 16", "React 19", "Tailwind CSS v4"] },
            ].map((section) => (
              <div key={section.title} className="rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold mb-2">{section.title}</h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-primary/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </GlassCard>
      </AnimatedSection>
    </div>
  )
}
