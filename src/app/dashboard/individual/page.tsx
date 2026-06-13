"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { PageHeader } from "@/components/shared/page-header"
import { StatsCard } from "@/components/dashboards/stats-card"
import { ActivityFeed } from "@/components/dashboards/activity-feed"
import { NotificationsPanel } from "@/components/dashboards/notifications-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  FolderKanban,
  Users,
  UserPlus,
  FileText,
  Plus,
  Search,
  UserCog,
  Bookmark,
  ExternalLink,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart3,
  Globe,
  Zap,
} from "lucide-react"

const profileProgress = 75

const projects = [
  {
    id: "1",
    title: "Digital Transformation Strategy",
    description: "Enterprise-wide digital transformation roadmap for a Fortune 500 manufacturing client.",
    status: "active" as const,
    progress: 65,
    team: ["AS", "MK", "JL"],
    deadline: "2026-08-15",
  },
  {
    id: "2",
    title: "Market Expansion APAC",
    description: "Strategic market entry analysis for Southeast Asian markets.",
    status: "active" as const,
    progress: 40,
    team: ["AS", "RN"],
    deadline: "2026-09-30",
  },
  {
    id: "3",
    title: "Sustainability Framework",
    description: "Developing ESG measurement framework for financial services sector.",
    status: "draft" as const,
    progress: 15,
    team: ["AS"],
    deadline: "2026-10-01",
  },
  {
    id: "4",
    title: "Operational Excellence Review",
    description: "Process optimization and operational efficiency analysis.",
    status: "completed" as const,
    progress: 100,
    team: ["AS", "MK", "JL", "RN"],
    deadline: "2026-05-01",
  },
]

const activities = [
  {
    id: "a1",
    type: "project_created" as const,
    title: "New project created",
    description: "Digital Transformation Strategy has been initiated",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    user: "Alex Strategist",
  },
  {
    id: "a2",
    type: "collaboration" as const,
    title: "Collaboration request accepted",
    description: "Michael K. joined Market Expansion APAC",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    user: "Michael K.",
  },
  {
    id: "a3",
    type: "message" as const,
    title: "New message from Sarah",
    description: "Feedback on the sustainability framework draft",
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    user: "Sarah Chen",
  },
  {
    id: "a4",
    type: "project_completed" as const,
    title: "Project completed",
    description: "Operational Excellence Review marked as complete",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    user: "Alex Strategist",
  },
  {
    id: "a5",
    type: "profile_update" as const,
    title: "Profile updated",
    description: "Expertise areas and skills section updated",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    user: "Alex Strategist",
  },
  {
    id: "a6",
    type: "project_created" as const,
    title: "Market Expansion project scoped",
    description: "APAC market research phase defined with milestones",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    user: "Alex Strategist",
  },
]

const notifications = [
  {
    id: "n1",
    type: "info" as const,
    title: "Project deadline approaching",
    description: "Digital Transformation Strategy deliverable due in 3 days",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: "n2",
    type: "achievement" as const,
    title: "Milestone unlocked: 5 Projects",
    description: "You've reached 5 completed projects milestone",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: "n3",
    type: "reminder" as const,
    title: "Profile completion reminder",
    description: "Add your portfolio to reach 100% profile completion",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: false,
  },
  {
    id: "n4",
    type: "warning" as const,
    title: "Collaboration request expiring",
    description: "Request from TechVentures Inc. expires in 2 days",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true,
  },
  {
    id: "n5",
    type: "alert" as const,
    title: "New platform feature",
    description: "AI-powered project insights now available",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    read: true,
  },
  {
    id: "n6",
    type: "info" as const,
    title: "Team member joined",
    description: "Jessica L. has joined your network",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96),
    read: true,
  },
]

const collaborationRequests = [
  {
    id: "c1",
    name: "Sarah Chen",
    role: "Innovation Strategist",
    expertise: ["Digital Transformation", "AI Strategy"],
    avatar: "SC",
    mutualConnections: 4,
  },
  {
    id: "c2",
    name: "Marcus Rivera",
    role: "Organizational Design Lead",
    expertise: ["Change Management", "Org Design"],
    avatar: "MR",
    mutualConnections: 2,
  },
  {
    id: "c3",
    name: "Priya Sharma",
    role: "Sustainability Consultant",
    expertise: ["ESG", "Circular Economy"],
    avatar: "PS",
    mutualConnections: 7,
  },
]

const savedInitiatives = [
  { id: "s1", title: "AI Governance Framework", saves: 234, category: "Innovation" },
  { id: "s2", title: "Net Zero Roadmap 2030", saves: 189, category: "Sustainability" },
  { id: "s3", title: "Future of Work Report", saves: 156, category: "Trends" },
]

const statusConfig = {
  active: { label: "Active", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  draft: { label: "Draft", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  completed: { label: "Completed", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  "on-hold": { label: "On Hold", color: "bg-red-500/10 text-red-500 border-red-500/20" },
}

export default function IndividualDashboard() {
  const [showAllProjects, setShowAllProjects] = useState(false)
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 3)

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, Alex
              </h1>
              <Sparkles size={20} className="text-amber-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              Here's your strategic overview for today. You have{" "}
              <span className="font-medium text-primary">3 active projects</span> and{" "}
              <span className="font-medium text-primary">2 pending requests</span>.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 sm:w-64">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Profile completion</span>
                  <span className="font-medium">{profileProgress}%</span>
                </div>
                <Progress value={profileProgress} variant="default" className="h-2" />
              </div>
              <span className="text-xs text-muted-foreground">
                {profileProgress < 100 ? "Complete your profile to unlock more features" : "Profile complete!"}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Search size={14} />
              Browse Projects
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus size={14} />
              New Project
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<FolderKanban size={18} />}
          label="Active Projects"
          value="3"
          trend={{ value: 12, positive: true }}
          description="2 in progress, 1 in draft"
          delay={0}
        />
        <StatsCard
          icon={<UserPlus size={18} />}
          label="Collaborations"
          value="8"
          trend={{ value: 5, positive: true }}
          description="3 pending requests"
          delay={0.1}
        />
        <StatsCard
          icon={<Globe size={18} />}
          label="Network Size"
          value="142"
          trend={{ value: 8, positive: true }}
          description="+6 this month"
          delay={0.2}
        />
        <StatsCard
          icon={<FileText size={18} />}
          label="Publications"
          value="12"
          trend={{ value: 0, positive: true }}
          description="2 under review"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AnimatedSection delay={0.2}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderKanban size={16} className="text-muted-foreground" />
                  <h2 className="text-lg font-semibold">My Projects</h2>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-xs" asChild>
                  <Link href="/dashboard/projects">
                    View all
                    <ArrowRight size={12} />
                  </Link>
                </Button>
              </div>
              <div className="space-y-3">
                {visibleProjects.map((project, index) => {
                  const status = statusConfig[project.status]
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.3 }}
                      className="group rounded-xl border border-border p-4 transition-all duration-200 hover:border-primary/30 hover:bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{project.title}</h3>
                            <Badge variant="outline" className={status.color}>
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 max-w-xs">
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <Progress
                                value={project.progress}
                                variant={project.status === "completed" ? "success" : "default"}
                                className="h-1.5"
                              />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={10} className="text-muted-foreground" />
                              <span className="text-[10px] text-muted-foreground">
                                {project.deadline}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <ExternalLink size={14} />
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              {projects.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllProjects(!showAllProjects)}
                  className="mt-3 w-full text-xs text-muted-foreground"
                >
                  {showAllProjects ? "Show less" : `Show all ${projects.length} projects`}
                </Button>
              )}
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <ActivityFeed items={activities} title="Recent Activity" />
          </AnimatedSection>
        </div>

        <div className="space-y-6">
          <AnimatedSection delay={0.25}>
            <NotificationsPanel items={notifications} />
          </AnimatedSection>

          <AnimatedSection delay={0.35}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center gap-2">
                <UserPlus size={16} className="text-muted-foreground" />
                <h3 className="text-sm font-semibold">Collaboration Requests</h3>
              </div>
              <div className="space-y-3">
                {collaborationRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
                  >
                    <Avatar size="sm">
                      <AvatarFallback className="text-xs">{req.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{req.name}</p>
                      <p className="text-xs text-muted-foreground">{req.role}</p>
                      <div className="flex flex-wrap gap-1">
                        {req.expertise.map((exp) => (
                          <Badge
                            key={exp}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {exp}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {req.mutualConnections} mutual connections
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="sm" className="h-7 text-xs px-2">
                        Accept
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2 text-muted-foreground"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center gap-2">
                <Bookmark size={16} className="text-muted-foreground" />
                <h3 className="text-sm font-semibold">Saved Initiatives</h3>
              </div>
              <div className="space-y-2">
                {savedInitiatives.map((initiative) => (
                  <div
                    key={initiative.id}
                    className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium">{initiative.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {initiative.category} &middot; {initiative.saves} saves
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ExternalLink size={12} />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground"
                  asChild
                >
                  <Link href="/dashboard/initiatives">
                    Browse all initiatives
                    <ArrowRight size={12} className="ml-1" />
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.45}>
            <GlassCard className="p-6" intensity="light">
              <h3 className="mb-4 text-sm font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="default" size="sm" className="w-full justify-start gap-2">
                  <Plus size={14} />
                  Create Project
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Search size={14} />
                  Find Collaborators
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <UserCog size={14} />
                  Update Profile
                </Button>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
