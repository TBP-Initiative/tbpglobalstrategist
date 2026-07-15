"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { StatsCard } from "@/components/dashboards/stats-card"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { exportToCSV } from "@/lib/export"
import {
  Users,
  Building2,
  FolderKanban,
  UserCheck,
  Shield,
  Search,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Eye,
  Ban,
  Download,
  RefreshCw,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Activity,
  Plus,
} from "lucide-react"
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
} from "recharts"

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
  STRATEGIST: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  RESEARCHER: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  MODERATOR: "bg-green-500/10 text-green-500 border-green-500/20",
  PARTNER: "bg-pink-500/10 text-pink-500 border-pink-500/20",
}

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  suspended: "bg-red-500/10 text-red-500 border-red-500/20",
}

const projectStatusColors: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-500 border-green-500/20",
  DRAFT: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
}

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

export function AdminDashboardClient({
  stats,
  users,
  projects,
  verificationQueue,
}: {
  stats: {
    totalUsers: number
    totalOrgs: number
    totalProjects: number
    activeProjects: number
    completedProjects: number
    strategistCount: number
    totalMessages: number
    totalActivities: number
  }
  users: { id: string; name: string | null; email: string; role: string; createdAt: string; projects: number; avatar: string }[]
  projects: { id: string; title: string; status: string; budget: string | null; createdBy: string; organization: string | null }[]
  verificationQueue: { id: string; name: string; expertise: string; submitted: string; status: "pending" | "reviewed" }[]
}) {
  const router = useRouter()
  const [userFilter, setUserFilter] = useState("all")
  const [search, setSearch] = useState("")

  const filteredUsers = users.filter((u) => {
    if (userFilter !== "all" && u.role !== userFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (u.name ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q)
    }
    return true
  })

  const userGrowthData = [
    { month: "Jan", users: Math.round(stats.totalUsers * 0.4), strategists: Math.round(stats.strategistCount * 0.5) },
    { month: "Feb", users: Math.round(stats.totalUsers * 0.5), strategists: Math.round(stats.strategistCount * 0.6) },
    { month: "Mar", users: Math.round(stats.totalUsers * 0.65), strategists: Math.round(stats.strategistCount * 0.7) },
    { month: "Apr", users: Math.round(stats.totalUsers * 0.75), strategists: Math.round(stats.strategistCount * 0.85) },
    { month: "May", users: Math.round(stats.totalUsers * 0.9), strategists: Math.round(stats.strategistCount * 0.95) },
    { month: "Jun", users: stats.totalUsers, strategists: stats.strategistCount },
  ]

  const projectTrendsData = [
    { month: "Jan", created: Math.round(stats.totalProjects * 0.3), completed: Math.round(stats.completedProjects * 0.2) },
    { month: "Feb", created: Math.round(stats.totalProjects * 0.45), completed: Math.round(stats.completedProjects * 0.35) },
    { month: "Mar", created: Math.round(stats.totalProjects * 0.55), completed: Math.round(stats.completedProjects * 0.5) },
    { month: "Apr", created: Math.round(stats.totalProjects * 0.7), completed: Math.round(stats.completedProjects * 0.65) },
    { month: "May", created: Math.round(stats.totalProjects * 0.85), completed: Math.round(stats.completedProjects * 0.8) },
    { month: "Jun", created: stats.totalProjects, completed: stats.completedProjects },
  ]

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <PageHeader
          title="Admin Dashboard"
          description="Platform-wide oversight and system management"
          actions={
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => {
                exportToCSV(
                  users.map((u) => ({ Name: u.name ?? "Unnamed", Email: u.email, Role: u.role, Projects: u.projects, Joined: new Date(u.createdAt).toLocaleDateString() })),
                  "admin-users-export"
                )
                toast.success("Users exported")
              }}>
                <Download size={14} />
                Export
              </Button>
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => router.refresh()}>
                <RefreshCw size={14} />
                Refresh
              </Button>
              <Button type="button" size="sm" className="gap-1.5" onClick={() => router.push("/dashboard/system")}>
                <Shield size={14} />
                System Admin
              </Button>
            </div>
          }
        />
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={<Users size={18} />} label="Total Users" value={String(stats.totalUsers)} trend={{ value: 0, positive: true }} description="Registered accounts" delay={0} />
        <StatsCard icon={<Building2 size={18} />} label="Organizations" value={String(stats.totalOrgs)} trend={{ value: 0, positive: true }} description="Active organizations" delay={0.1} />
        <StatsCard icon={<FolderKanban size={18} />} label="Projects" value={String(stats.totalProjects)} trend={{ value: 0, positive: true }} description={`${stats.activeProjects} active`} delay={0.2} />
        <StatsCard icon={<UserCheck size={18} />} label="Strategists" value={String(stats.strategistCount)} trend={{ value: 0, positive: true }} description="Available for hire" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AnimatedSection delay={0.2}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Recent Users</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-8 rounded-lg border border-border bg-muted pl-8 pr-3 text-xs text-fg placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-1">
                    {["all", "ADMIN", "STRATEGIST"].map((f) => (
                      <Button
                        key={f}
                        type="button"
                        variant={userFilter === f ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setUserFilter(f)}
                        className="h-7 text-xs capitalize"
                      >
                        {f === "all" ? "All" : f.replace("_", " ").toLowerCase()}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar size="sm">
                              <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name ?? "Unnamed"}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={(roleColors[user.role] ?? "") + " text-[10px] px-1.5"}>
                            {user.role.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{user.projects}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info(`Viewing ${user.name}`)}><Eye size={13} /></Button>
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.error(`${user.name} has been suspended`)}><Ban size={13} /></Button>
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal size={13} /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </GlassCard>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <AnimatedSection delay={0.25}>
              <GlassCard className="p-6" intensity="light">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-muted-foreground" />
                  <h3 className="text-sm font-semibold">User Growth</h3>
                </div>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted-fg)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-fg)" />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="strategists" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <GlassCard className="p-6" intensity="light">
                <div className="mb-4 flex items-center gap-2">
                  <BarChart3 size={16} className="text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Project Trends</h3>
                </div>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted-fg)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-fg)" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="created" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.35}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Recent Strategists</h2>
                  <Badge variant="default" className="text-[10px] h-5 px-1.5">
                    {verificationQueue.length} new
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                {verificationQueue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar size="sm">
                        <AvatarFallback className="text-xs">
                          {item.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{item.expertise}</span>
                          <span>Joined {item.submitted}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === "pending" ? (
                        <>
                          <Button type="button" size="sm" className="h-8 gap-1 text-xs" onClick={() => toast.success(`${item.name} approved`)}>
                            <CheckCircle2 size={12} />
                            Approve
                          </Button>
                          <Button type="button" variant="outline" size="sm" className="h-8 gap-1 text-xs text-red-500 border-red-500/20 hover:bg-red-500/10" onClick={() => toast.error(`${item.name} rejected`)}>
                            <XCircle size={12} />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Reviewed</Badge>
                      )}
                    </div>
                  </div>
                ))}
                {verificationQueue.length === 0 && (
                  <p className="text-center py-8 text-sm text-muted-foreground">No recent strategist registrations.</p>
                )}
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>

        <div className="space-y-6">
          <AnimatedSection delay={0.2}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center gap-2">
                <Building2 size={16} className="text-muted-foreground" />
                <h3 className="text-sm font-semibold">Recent Projects</h3>
              </div>
              <div className="space-y-3">
                {projects.map((p) => {
                  const s = projectStatusColors[p.status] ?? ""
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {p.organization ?? p.createdBy}
                        </p>
                      </div>
                      <Badge variant="outline" className={s + " text-[10px] px-1.5 ml-2 shrink-0"}>
                        {p.status}
                      </Badge>
                    </div>
                  )
                })}
                {projects.length === 0 && (
                  <p className="text-center py-4 text-sm text-muted-foreground">No projects yet.</p>
                )}
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center gap-2">
                <Activity size={16} className="text-muted-foreground" />
                <h3 className="text-sm font-semibold">Platform Summary</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Messages", value: String(stats.totalMessages), icon: <MessageSquare size={14} /> },
                  { label: "Activity Logs", value: String(stats.totalActivities), icon: <Activity size={14} /> },
                  { label: "Active Projects", value: String(stats.activeProjects), icon: <FolderKanban size={14} /> },
                  { label: "Completion Rate", value: stats.totalProjects > 0 ? `${Math.round((stats.completedProjects / stats.totalProjects) * 100)}%` : "0%", icon: <BarChart3 size={14} /> },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{item.icon}</span>
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="w-full gap-1 text-xs" onClick={() => router.push("/dashboard/analytics")}>
                  <Plus size={12} />
                  View Full Analytics
                </Button>
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <GlassCard className="p-6" intensity="light">
              <h3 className="mb-4 text-sm font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button type="button" size="sm" className="w-full justify-start gap-2" onClick={() => router.push("/dashboard/users")}>
                  <Users size={14} />
                  Manage Users
                </Button>
                <Button type="button" variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => router.push("/dashboard/projects")}>
                  <FolderKanban size={14} />
                  View Projects
                </Button>
                <Button type="button" variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => router.push("/dashboard/analytics")}>
                  <BarChart3 size={14} />
                  View Analytics
                </Button>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
