"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import Link from "next/link"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { ProgressionPathway } from "@/components/dashboards/progression-pathway"
import { SubmissionForm } from "@/components/dashboards/submission-form"
import { StatsCard } from "@/components/dashboards/stats-card"
import { ActivityFeed } from "@/components/dashboards/activity-feed"
import { NotificationsPanel } from "@/components/dashboards/notifications-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { FeaturedProjectSelector } from "@/components/dashboards/featured-project-selector"
import { cn } from "@/lib/utils"
import {
  FolderKanban,
  UserPlus,
  FileText,
  Search,
  UserCog,
  ExternalLink,
  ArrowRight,
  Clock,
  Sparkles,
  Globe,
} from "lucide-react"

const stageColors: Record<string, string> = {
  CANDIDATE: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  STRATEGIST: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
  CONTRIBUTOR: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  PROJECT_ALIGNED: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  SECTOR_LEAD: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  PAID_ADVISER: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
}

const stageLabels: Record<string, string> = {
  CANDIDATE: "Global Strategist Candidate",
  STRATEGIST: "Global Strategist",
  CONTRIBUTOR: "Strategic Contributor",
  PROJECT_ALIGNED: "Project-Aligned Strategist",
  SECTOR_LEAD: "Sector Lead or Workstream Lead",
  PAID_ADVISER: "Paid Project Adviser, Specialist or Implementation Contributor",
}

const stageOrder = ["CANDIDATE", "STRATEGIST", "CONTRIBUTOR", "PROJECT_ALIGNED", "SECTOR_LEAD", "PAID_ADVISER"]

const stageDescriptions: Record<string, string> = {
  CANDIDATE: "You are in the onboarding phase. Complete your profile and submit a reflection to progress.",
  STRATEGIST: "You have been recognized as a TBP Global Strategist. Begin contributing to workstreams.",
  CONTRIBUTOR: "You are actively contributing to TBP workstreams. Your reliability and output are being assessed.",
  PROJECT_ALIGNED: "You are attached to a specific TBP project. Continue delivering high-quality contributions.",
  SECTOR_LEAD: "You lead a sector workstream, coordinating contributors and supporting TBP's development process.",
  PAID_ADVISER: "You are eligible for paid advisory, research, or implementation roles on active projects.",
}

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  draft: { label: "Draft", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  completed: { label: "Completed", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-500 border-red-500/20" },
}

const notificationTypeMap: Record<string, "info" | "warning" | "achievement" | "reminder" | "alert"> = {
  MESSAGE: "info",
  PROJECT_INVITE: "info",
  ORGANIZATION_INVITE: "warning",
  ACHIEVEMENT_UNLOCKED: "achievement",
  PUBLICATION_APPROVED: "achievement",
  SYSTEM: "info",
}

interface ProjectItem {
  id: string
  title: string
  slug: string
  description: string
  status: string
  progress: number
  contributorCount: number
  role: string
  joinedAt: string
  startDate: string | null
  endDate: string | null
}

interface ActivityItem {
  id: string
  type: "project_created" | "project_completed" | "collaboration" | "message" | "profile_update"
  title: string
  description: string
  timestamp: Date
}

interface NotificationItem {
  id: string
  type: "info" | "warning" | "achievement" | "reminder" | "alert"
  title: string
  description: string
  timestamp: Date
  read: boolean
}

interface CollaborationItem {
  id: string
  userId: string
  name: string
  image: string
  title: string
  sector: string | null
  stage: string
  projectRole: string
  projectName: string
  joinedAt: string
}

export default function IndividualDashboard() {
  const { data: session } = useSession()
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [stats, setStats] = useState<{
    activeProjects: number
    collaborations: number
    pendingRequests: number
    networkSize: number
    newThisMonth: number
    publications: number
    totalActiveProjects: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<{ stage: string; sector: string | null; workAreas?: string[] } | null>(null)

  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [collaborations, setCollaborations] = useState<CollaborationItem[]>([])

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then((r) => r.json()),
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/dashboard/my-projects").then((r) => r.json()),
      fetch("/api/dashboard/activities").then((r) => r.json()),
      fetch("/api/notifications").then((r) => r.json()),
      fetch("/api/dashboard/collaborations").then((r) => r.json()),
    ])
      .then(([statsData, profileData, projectsData, activitiesData, notificationsData, collabsData]) => {
        setStats(statsData)
        if (profileData.strategistProfile?.stage) {
          setProfile({
            stage: profileData.strategistProfile.stage,
            sector: profileData.strategistProfile.sector,
            workAreas: profileData.workAreaAssignments?.map((a: { workArea: { name: string } }) => a.workArea.name) ?? [],
          })
        }
        if (Array.isArray(projectsData)) {
          setProjects(projectsData)
        }
        if (Array.isArray(activitiesData)) {
          setActivities(
            activitiesData.map((a: { id: string; type: string; title: string; description: string; timestamp: string }) => ({
              id: a.id,
              type: (["project_created", "project_completed", "collaboration", "message", "profile_update"].includes(a.type) ? a.type : "profile_update") as ActivityItem["type"],
              title: a.title,
              description: a.description,
              timestamp: new Date(a.timestamp),
            }))
          )
        }
        if (Array.isArray(notificationsData)) {
          setNotifications(
            notificationsData.map((n: { id: string; type: string; title: string; message: string; read: boolean; createdAt: string }) => ({
              id: n.id,
              type: notificationTypeMap[n.type] ?? "info",
              title: n.title,
              description: n.message,
              timestamp: new Date(n.createdAt),
              read: n.read,
            }))
          )
        }
        if (Array.isArray(collabsData)) {
          setCollaborations(collabsData)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const firstName = session?.user?.name?.split(" ")[0] || "Strategist"
  const currentStage = profile?.stage ?? "CANDIDATE"
  const currentStageIndex = stageOrder.indexOf(currentStage)
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 3)

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, {firstName}
              </h1>
              <Sparkles size={20} className="text-amber-500" />
            </div>
            <Badge className={cn("text-[11px] uppercase tracking-wider px-3 py-1", stageColors[currentStage])}>
              {stageLabels[currentStage]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {stageDescriptions[currentStage]}
          </p>
          {profile?.workAreas && profile.workAreas.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Assigned areas:</span>
              {profile.workAreas.map((area: string) => (
                <span
                  key={area}
                  className="inline-block rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-500"
                >
                  {area}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4">
            {stageOrder.map((stage, i) => (
              <div key={stage} className="flex items-center gap-1.5">
                <div className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  i <= currentStageIndex ? "bg-primary" : "bg-muted-foreground/20"
                )} />
                <span className={cn(
                  "text-[10px]",
                  i <= currentStageIndex ? "text-primary font-medium" : "text-muted-foreground/40"
                )}>
                  {stage === "CANDIDATE" ? "Candidate" : stage === "STRATEGIST" ? "Strategist" : stage === "CONTRIBUTOR" ? "Contributor" : stage === "PROJECT_ALIGNED" ? "Aligned" : stage === "SECTOR_LEAD" ? "Lead" : "Adviser"}
                </span>
                {i < stageOrder.length - 1 && (
                  <div className={cn(
                    "h-px w-4",
                    i < currentStageIndex ? "bg-primary" : "bg-muted-foreground/20"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Here&apos;s your strategic overview for today. You have{" "}
              <span className="font-medium text-primary">{stats?.activeProjects ?? 0} active projects</span> and{" "}
              <span className="font-medium text-primary">{stats?.pendingRequests ?? 0} pending requests</span>.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <Link href="/dashboard/individual/browse">
                <Search size={14} />
                Browse Projects
              </Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={<FolderKanban size={18} />}
            label="Active Projects"
            value={stats?.totalActiveProjects ?? 0}
            trend={{ value: 0, positive: true }}
            description={`${stats?.activeProjects ?? 0} you're contributing to`}
            delay={0}
          />
          <StatsCard
            icon={<UserPlus size={18} />}
            label="Collaborations"
            value={stats?.collaborations ?? 0}
            trend={{ value: 0, positive: true }}
            description={`${stats?.pendingRequests ?? 0} pending requests`}
            delay={0.1}
          />
          <StatsCard
            icon={<Globe size={18} />}
            label="Network Size"
            value={stats?.networkSize ?? 0}
            trend={{ value: 0, positive: true }}
            description={`+${stats?.newThisMonth ?? 0} this month`}
            delay={0.2}
          />
          <StatsCard
            icon={<FileText size={18} />}
            label="Publications"
            value={stats?.publications ?? 0}
            trend={{ value: 0, positive: true }}
            description=""
            delay={0.3}
          />
        </div>
      )}

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
                {visibleProjects.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No projects yet. Browse and join projects to get started.
                  </p>
                )}
                {visibleProjects.map((project, index) => {
                  const status = statusConfig[project.status] ?? statusConfig.draft
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.3 }}
                      className="group rounded-xl border border-border p-4 transition-all duration-200 hover:border-primary/30 hover:bg-muted/30"
                    >
                      <div className="flex items-start gap-4">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="h-16 w-16 shrink-0 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{project.title}</h3>
                            <Badge variant="outline" className={status.color}>
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
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
                                {project.endDate ? new Date(project.endDate).toLocaleDateString() : "No deadline"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                          asChild
                        >
                          <Link href={`/dashboard/projects/${project.slug}`}>
                            <ExternalLink size={14} />
                          </Link>
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
            {activities.length > 0 ? (
              <ActivityFeed items={activities} title="Recent Activity" />
            ) : (
              <GlassCard className="p-6" intensity="light">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock size={24} className="mb-2 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No activity yet</p>
                  <p className="text-xs text-muted-foreground/70">Your recent actions will appear here</p>
                </div>
              </GlassCard>
            )}
          </AnimatedSection>
        </div>

        <div className="space-y-6">
          <AnimatedSection delay={0.25}>
            <FeaturedProjectSelector />
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <NotificationsPanel items={notifications} />
          </AnimatedSection>

          <AnimatedSection delay={0.45}>
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4 flex items-center gap-2">
                <UserPlus size={16} className="text-muted-foreground" />
                <h3 className="text-sm font-semibold">Collaborators</h3>
              </div>
              <div className="space-y-3">
                {collaborations.length === 0 && (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    No collaborators yet. Join a project to start collaborating.
                  </p>
                )}
                {collaborations.map((collab) => {
                  const initials = collab.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                  return (
                    <div
                      key={collab.id}
                      className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
                    >
                      <Avatar size="sm">
                        {collab.image ? (
                          <img src={collab.image} alt={collab.name} className="h-full w-full object-cover" />
                        ) : null}
                          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{collab.name}</p>
                        <p className="text-xs text-muted-foreground">{collab.title}</p>
                        <div className="flex flex-wrap gap-1">
                          {collab.sector && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {collab.sector}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {collab.projectRole}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          on {collab.projectName}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.55}>
            <GlassCard className="p-6" intensity="light">
              <h3 className="mb-4 text-sm font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                  <Link href="/dashboard/individual/browse">
                    <Search size={14} />
                    Browse Projects
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                  <Link href="/dashboard/profile">
                    <UserCog size={14} />
                    Update Profile
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>

      {profile?.stage && <SubmissionForm currentStage={profile.stage} />}

      {profile?.stage && <ProgressionPathway currentStage={profile.stage} />}
    </div>
  )
}
