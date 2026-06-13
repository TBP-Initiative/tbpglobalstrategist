"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { PageHeader } from "@/components/shared/page-header"
import { StatsCard } from "@/components/dashboards/stats-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import {
  Users,
  FolderKanban,
  UserCheck,
  TrendingUp,
  Plus,
  Mail,
  Link2,
  Copy,
  Check,
  ArrowRight,
  Clock,
  Building2,
  BarChart3,
  UserPlus,
  MoreHorizontal,
  Send,
  Sparkles,
  Search,
  Shield,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react"

const teamMembers = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Lead Strategist",
    email: "sarah@acmecorp.com",
    status: "active" as const,
    projects: 4,
    avatar: "SC",
  },
  {
    id: "2",
    name: "Marcus Rivera",
    role: "Innovation Lead",
    email: "marcus@acmecorp.com",
    status: "active" as const,
    projects: 3,
    avatar: "MR",
  },
  {
    id: "3",
    name: "Priya Sharma",
    role: "Sustainability Consultant",
    email: "priya@acmecorp.com",
    status: "active" as const,
    projects: 2,
    avatar: "PS",
  },
  {
    id: "4",
    name: "James Wilson",
    role: "Data Analyst",
    email: "james@acmecorp.com",
    status: "pending" as const,
    projects: 0,
    avatar: "JW",
  },
  {
    id: "5",
    name: "Emma Rodriguez",
    role: "Strategy Associate",
    email: "emma@acmecorp.com",
    status: "inactive" as const,
    projects: 1,
    avatar: "ER",
  },
]

const strategistRoster = [
  { id: "s1", name: "Dr. Alan Turing", expertise: "AI & ML", rating: 4.9, projects: 12, available: true },
  { id: "s2", name: "Jane Goodall", expertise: "Sustainability", rating: 4.8, projects: 8, available: true },
  { id: "s3", name: "Richard Feynman", expertise: "Innovation", rating: 4.7, projects: 15, available: false },
  { id: "s4", name: "Marie Curie", expertise: "R&D Strategy", rating: 4.9, projects: 10, available: true },
]

const initiatives = [
  { id: "i1", title: "Digital Transformation", status: "active" as const, progress: 65, strategist: "Sarah Chen" },
  { id: "i2", title: "Market Expansion APAC", status: "active" as const, progress: 40, strategist: "Marcus Rivera" },
  { id: "i3", title: "ESG Framework Development", status: "draft" as const, progress: 20, strategist: "Priya Sharma" },
  { id: "i4", title: "AI Readiness Assessment", status: "on-hold" as const, progress: 55, strategist: "James Wilson" },
]

const projectGrowthData = [
  { month: "Jan", projects: 4, strategists: 3 },
  { month: "Feb", projects: 6, strategists: 4 },
  { month: "Mar", projects: 8, strategists: 5 },
  { month: "Apr", projects: 10, strategists: 6 },
  { month: "May", projects: 14, strategists: 7 },
  { month: "Jun", projects: 18, strategists: 8 },
]

const engagementData = [
  { week: "W1", meetings: 12, proposals: 5, reviews: 8 },
  { week: "W2", meetings: 15, proposals: 7, reviews: 10 },
  { week: "W3", meetings: 18, proposals: 6, reviews: 12 },
  { week: "W4", meetings: 22, proposals: 9, reviews: 15 },
  { week: "W5", meetings: 20, proposals: 8, reviews: 14 },
  { week: "W6", meetings: 25, proposals: 11, reviews: 18 },
]

const collaborationRequests = [
  {
    id: "cr1",
    from: "TechVentures Inc.",
    type: "Project Collaboration",
    message: "Seeking partners for AI-driven supply chain optimization project",
    timestamp: "2 hours ago",
    status: "pending",
  },
  {
    id: "cr2",
    from: "GreenFuture Labs",
    type: "Strategist Request",
    message: "Looking for sustainability strategist for 6-month engagement",
    timestamp: "1 day ago",
    status: "pending",
  },
  {
    id: "cr3",
    from: "DataSphere Analytics",
    type: "Partnership",
    message: "Proposal for joint market research initiative",
    timestamp: "3 days ago",
    status: "read",
  },
]

const statusVariant = {
  active: { label: "Active", class: "bg-green-500/10 text-green-500 border-green-500/20" },
  pending: { label: "Pending", class: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  inactive: { label: "Inactive", class: "bg-red-500/10 text-red-500 border-red-500/20" },
  draft: { label: "Draft", class: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  "on-hold": { label: "On Hold", class: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
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

export default function CorporateDashboard() {
  const [inviteCode] = useState("TBP-ACME-2X4K9M")
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <PageHeader
          title="Corporate Dashboard"
          description="Acme Corporation - Strategic Operations Overview"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <BarChart3 size={14} />
                Analytics
              </Button>
              <Button size="sm" className="gap-1.5">
                <Plus size={14} />
                New Project
              </Button>
            </div>
          }
        />
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<Users size={18} />}
          label="Team Members"
          value="24"
          trend={{ value: 8, positive: true }}
          description="5 new this quarter"
          delay={0}
        />
        <StatsCard
          icon={<FolderKanban size={18} />}
          label="Active Projects"
          value="12"
          trend={{ value: 20, positive: true }}
          description="3 in pipeline"
          delay={0.1}
        />
        <StatsCard
          icon={<UserCheck size={18} />}
          label="Assigned Strategists"
          value="8"
          trend={{ value: 14, positive: true }}
          description="2 available for hire"
          delay={0.2}
        />
        <StatsCard
          icon={<TrendingUp size={18} />}
          label="Innovation Score"
          value="87"
          trend={{ value: 5, positive: true }}
          description="Top 15% of organizations"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AnimatedSection delay={0.2}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Team Management</h2>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <UserPlus size={14} />
                  Invite Member
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => {
                      const s = statusVariant[member.status]
                      return (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar size="sm">
                                <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{member.role}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={s.class}>
                              {s.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">{member.projects}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 size={16} className="text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Invite System</h2>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Copy size={14} />
                  </div>
                  <p className="mb-1 text-sm font-medium">Invite Code</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded-lg bg-muted px-2 py-1 text-xs font-mono">
                      {inviteCode}
                    </code>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={copyCode}>
                      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    </Button>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">Expires in 7 days</p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Link2 size={14} />
                  </div>
                  <p className="mb-1 text-sm font-medium">Invite Link</p>
                  <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                    <Copy size={12} />
                    Copy Link
                  </Button>
                  <p className="mt-2 text-[10px] text-muted-foreground">Unlimited uses</p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Send size={14} />
                  </div>
                  <p className="mb-1 text-sm font-medium">Send Invite</p>
                  <Button variant="default" size="sm" className="w-full gap-1 text-xs">
                    <Mail size={12} />
                    Email Invite
                  </Button>
                  <p className="mt-2 text-[10px] text-muted-foreground">Send via email</p>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Analytics</h2>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    Project & Member Growth
                  </p>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={projectGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted-fg)" />
                        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-fg)" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="projects" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="strategists" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    Weekly Engagement
                  </p>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-fg)" />
                        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-fg)" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="meetings"
                          stroke="var(--primary)"
                          fill="var(--primary)"
                          fillOpacity={0.1}
                        />
                        <Area
                          type="monotone"
                          dataKey="proposals"
                          stroke="var(--accent)"
                          fill="var(--accent)"
                          fillOpacity={0.1}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>

        <div className="space-y-6">
          <AnimatedSection delay={0.2}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center gap-2">
                <UserCheck size={16} className="text-muted-foreground" />
                <h3 className="text-sm font-semibold">Strategist Roster</h3>
              </div>
              <div className="space-y-3">
                {strategistRoster.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
                  >
                    <Avatar size="sm">
                      <AvatarFallback className="text-xs">
                        {s.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.expertise}</p>
                      <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>Rating: {s.rating}</span>
                        <span>{s.projects} projects</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {s.available ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px]">
                          Busy
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2">
                        Assign
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                  Browse all strategists
                  <ArrowRight size={12} className="ml-1" />
                </Button>
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderKanban size={16} className="text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Active Initiatives</h3>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                  <Link href="/dashboard/projects">
                    View all
                  </Link>
                </Button>
              </div>
              <div className="space-y-2">
                {initiatives.map((init) => {
                  const s = statusVariant[init.status]
                  return (
                    <div
                      key={init.id}
                      className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <p className="text-sm font-medium">{init.title}</p>
                        <Badge variant="outline" className={s.class + " text-[10px] px-1.5"}>
                          {s.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>Strategist: {init.strategist}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {init.progress}%
                        </span>
                      </div>
                      <Progress value={init.progress} className="mt-2 h-1" />
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Collaboration Inbox</h3>
                  <Badge variant="default" className="text-[10px] h-5 px-1.5">
                    {collaborationRequests.filter((r) => r.status === "pending").length} new
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                {collaborationRequests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium">{req.from}</p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{req.timestamp}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] px-1.5 mb-1">
                      {req.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{req.message}</p>
                    {req.status === "pending" && (
                      <div className="mt-2 flex gap-1.5">
                        <Button size="sm" className="h-7 text-xs px-3 gap-1">
                          <CheckCircle2 size={12} />
                          Accept
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-3 gap-1">
                          <XCircle size={12} />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.35}>
            <GlassCard className="p-6" intensity="light">
              <h3 className="mb-4 text-sm font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="default" size="sm" className="w-full justify-start gap-2">
                  <UserPlus size={14} />
                  Invite Member
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Plus size={14} />
                  Create Project
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <UserCheck size={14} />
                  Assign Strategist
                </Button>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
