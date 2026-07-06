"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { exportToCSV } from "@/lib/export"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { StatsCard } from "@/components/dashboards/stats-card"
import { PageHeader } from "@/components/shared/page-header"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  Users,
  FolderKanban,
  Building2,
  DollarSign,
  MessageSquare,
  Activity,
  RefreshCw,
  Download,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl p-3 text-sm shadow-xl">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const statusColors: Record<string, string> = {
  Active: "#10b981",
  Draft: "#f59e0b",
  Completed: "#6366f1",
  Cancelled: "#ef4444",
}

export function AnalyticsClient({
  userGrowth,
  projectTrends,
  stats,
}: {
  userGrowth: { month: string; users: number }[]
  projectTrends: { month: string; created: number; completed: number }[]
  stats: {
    totalUsers: number
    strategistCount: number
    adminCount: number
    totalProjects: number
    totalOrgs: number
    totalBudget: number
    totalMessages: number
    totalActivities: number
    active: number
    draft: number
    completed: number
    cancelled: number
  }
}) {
  const ecosystemData = [
    { name: "Strategists", value: stats.strategistCount, color: "#6366f1" },
    { name: "Admin", value: stats.adminCount, color: "#10b981" },
  ].filter((d) => d.value > 0)

  const router = useRouter()
  const pieData = [
    { name: "Active", value: stats.active, color: "#10b981" },
    { name: "Draft", value: stats.draft, color: "#f59e0b" },
    { name: "Completed", value: stats.completed, color: "#6366f1" },
    { name: "Cancelled", value: stats.cancelled, color: "#ef4444" },
  ].filter((d) => d.value > 0)

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <PageHeader
          title="Analytics"
          description="Platform-wide metrics and insights"
          actions={
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => {
                exportToCSV([
                  { Metric: "Total Users", Value: String(stats.totalUsers) },
                  { Metric: "Strategists", Value: String(stats.strategistCount) },

                  { Metric: "Admin", Value: String(stats.adminCount) },
                  { Metric: "Total Projects", Value: String(stats.totalProjects) },
                  { Metric: "Active Projects", Value: String(stats.active) },
                  { Metric: "Draft Projects", Value: String(stats.draft) },
                  { Metric: "Completed Projects", Value: String(stats.completed) },
                  { Metric: "Cancelled Projects", Value: String(stats.cancelled) },
                  { Metric: "Organizations", Value: String(stats.totalOrgs) },
                  { Metric: "Total Budget", Value: `$${(stats.totalBudget / 1000).toFixed(0)}k` },
                  { Metric: "Messages", Value: String(stats.totalMessages) },
                  { Metric: "Activities", Value: String(stats.totalActivities) },
                ], "analytics-report")
                toast.success("Analytics report exported")
              }}>
                <Download size={14} />
                Export Report
              </Button>
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => router.refresh()}>
                <RefreshCw size={14} />
                Refresh
              </Button>
            </div>
          }
        />
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={<Users size={18} />} label="Total Users" value={String(stats.totalUsers)} delay={0} />
        <StatsCard icon={<FolderKanban size={18} />} label="Projects" value={String(stats.totalProjects)} delay={0.05} />
        <StatsCard icon={<Building2 size={18} />} label="Organizations" value={String(stats.totalOrgs)} delay={0.1} />
        <StatsCard icon={<DollarSign size={18} />} label="Total Budget" value={`$${(stats.totalBudget / 1000).toFixed(0)}k`} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={<MessageSquare size={18} />} label="Messages" value={String(stats.totalMessages)} delay={0} />
        <StatsCard icon={<Activity size={18} />} label="Activities" value={String(stats.totalActivities)} delay={0.05} />
        <StatsCard icon={<BarChart3 size={18} />} label="Active Projects" value={String(stats.active)} trend={{ value: 0, positive: true }} delay={0.1} />
        <StatsCard icon={<TrendingUp size={18} />} label="Completion Rate" value={stats.totalProjects > 0 ? `${Math.round((stats.completed / stats.totalProjects) * 100)}%` : "0%"} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnimatedSection delay={0.2}>
          <GlassCard className="p-6" intensity="light">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-muted-foreground" />
              <h3 className="text-sm font-semibold">User Registrations</h3>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted-fg)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-fg)" allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <GlassCard className="p-6" intensity="light">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-muted-foreground" />
              <h3 className="text-sm font-semibold">Project Trends</h3>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted-fg)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-fg)" allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="created" fill="#6366f1" radius={[4, 4, 0, 0]} name="Created" />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnimatedSection delay={0.3}>
          <GlassCard className="p-6" intensity="light">
            <div className="mb-4 flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              <h3 className="text-sm font-semibold">User Distribution</h3>
            </div>
            <div className="flex items-center justify-center h-[260px]">
              <div className="w-full max-w-[280px]">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={ecosystemData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {ecosystemData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {ecosystemData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-muted-foreground">{entry.name}</span>
                      <span className="font-medium">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>

        <AnimatedSection delay={0.35}>
          <GlassCard className="p-6" intensity="light">
            <div className="mb-4 flex items-center gap-2">
              <FolderKanban size={16} className="text-muted-foreground" />
              <h3 className="text-sm font-semibold">Project Status Distribution</h3>
            </div>
            <div className="flex items-center justify-center h-[260px]">
              <div className="w-full max-w-[280px]">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {pieData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-muted-foreground">{entry.name}</span>
                      <span className="font-medium">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>
    </div>
  )
}
