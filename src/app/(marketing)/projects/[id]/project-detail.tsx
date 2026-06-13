"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Download,
  FileText,
  Handshake,
  ImageIcon,
  MessageSquare,
  Users,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AnimatedSection } from "@/components/shared/animated-section"

type ProjectData = {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  image: string | null
  category: string
  status: "active" | "completed" | "on-hold" | "draft"
  progress: number
  startDate: string
  targetDate: string
  budget: string
  innovationAreas: string[]
  organization: { name: string; logo: null; industry: string; website: string }
  milestones: { id: string; title: string; date: string; completed: boolean; description: string }[]
  contributors: { name: string; title: string; avatar: null; expertise: string[] }[]
  media: { id: string; type: string; title: string; url: string; fileType: string | null }[]
  documents: { name: string; type: string; size: string; updatedAt: string }[]
  activities: { user: string; action: string; timestamp: string }[]
  stage: string
  health: string
  updatedAt: string
  leadStrategist: string | null
}

const statusConfig = {
  active: { label: "Active", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  completed: { label: "Completed", class: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  "on-hold": { label: "On Hold", class: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  draft: { label: "Draft", class: "bg-muted text-muted-foreground" },
}

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <AnimatedSection className={className}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        {title}
      </h3>
      {children}
    </AnimatedSection>
  )
}

export function ProjectDetail({ project, isAdmin }: { project: ProjectData; isAdmin?: boolean }) {
  const status = statusConfig[project.status]

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Projects
          </Link>
          {isAdmin && (
            <Link
              href={`/dashboard/projects/${project.slug ?? project.id}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Edit Project
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" className="h-3.5 w-3.5">
                <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71449 8.57853C3.62421 8.66881 3.55952 8.77884 3.52356 8.89765L3.00926 10.5834C2.98679 10.6574 2.99942 10.7376 3.04371 10.801C3.08799 10.8644 3.15828 10.9023 3.23339 10.9042C3.24131 10.9044 3.24923 10.9041 3.25709 10.9034L5.01652 10.7322C5.14534 10.7205 5.2665 10.6651 5.35829 10.5733L12.8536 3.07801C13.0488 2.88274 13.0488 2.56616 12.8536 2.3709L11.8536 1.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {project.image && (
        <div className="w-full h-[300px] sm:h-[420px] overflow-hidden bg-muted">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AnimatedSection>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium", status.class)}>
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    project.status === "active" && "bg-emerald-400",
                    project.status === "completed" && "bg-blue-400",
                    project.status === "on-hold" && "bg-amber-400",
                    project.status === "draft" && "bg-muted-foreground"
                  )} />
                  {status.label}
                </span>
                <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
                  {project.category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                {project.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.tagline}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.05}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border bg-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overall Progress</span>
                    <span className="text-lg font-bold tabular-nums">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} variant={project.progress === 100 ? "success" : "default"} className="h-2.5" />
                  <div className="flex items-center justify-between text-[13px] text-muted-foreground">
                    <span>{project.startDate} &ndash; {project.targetDate}</span>
                    <span className="tabular-nums">{project.progress}% Complete</span>
                  </div>
                </div>

                <div className="rounded-xl border bg-card p-5 space-y-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Stats</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Current Stage</p>
                      <p className="text-sm font-semibold mt-0.5">{project.stage}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Health</p>
                      <p className="text-sm font-semibold mt-0.5 flex items-center gap-1.5">
                        <span className={cn(
                          "inline-block h-2 w-2 rounded-full",
                          project.health === "On Track" ? "bg-emerald-400" : project.health === "At Risk" ? "bg-amber-400" : "bg-red-400"
                        )} />
                        {project.health}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-semibold mt-0.5">{new Date(project.updatedAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    {project.leadStrategist && (
                      <div>
                        <p className="text-[11px] text-muted-foreground">Lead Strategist</p>
                        <p className="text-sm font-semibold mt-0.5 truncate">{project.leadStrategist}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  About This Project
                </h3>
                <div
                  className="text-sm leading-[2] text-foreground/85 [&_b]:font-semibold [&_p]:mb-6 [&_br]:block [&_br]:content-[''] [&_br]:h-[0.5em] [&_br+br]:h-[2.5em]"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.innovationAreas.map((area) => (
                    <Badge key={area} variant="outline" className="text-[11px]">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <Separator />

            <Section title="Milestones">
              <div className="space-y-0">
                {project.milestones.map((milestone, i) => (
                  <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                          milestone.completed
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {milestone.completed && (
                          <svg width="10" height="10" viewBox="0 0 15 15" fill="none" className="text-emerald-500">
                            <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58839 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      {i < project.milestones.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 -mt-0.5">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-medium",
                          milestone.completed ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {milestone.title}
                        </span>
                        <span className="text-[12px] text-muted-foreground">{milestone.date}</span>
                      </div>
                      <p className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Separator />

            {project.media.filter((m) => m.type === "IMAGE").length > 0 && (
              <Section title="Media Gallery">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.media.filter((m) => m.type === "IMAGE").map((item) => (
                    <div
                      key={item.id}
                      className="group relative flex aspect-video items-center justify-center rounded-lg border bg-muted/50 overflow-hidden"
                    >
                      <img
                        src={item.url}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {project.media.filter((m) => m.type === "YOUTUBE" || m.type === "VIMEO" || m.type === "VIDEO").length > 0 && (
              <Section title="Videos & Media">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.media.filter((m) => m.type === "YOUTUBE" || m.type === "VIMEO" || m.type === "VIDEO").map((vid) => (
                    <div key={vid.id} className="aspect-video rounded-xl overflow-hidden bg-muted">
                      {vid.type === "YOUTUBE" ? (
                        <iframe
                          src={vid.url}
                          title={vid.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : vid.type === "VIMEO" ? (
                        <iframe
                          src={vid.url}
                          title={vid.title}
                          className="w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video src={vid.url} controls className="w-full h-full" />
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Separator />

            {project.media.filter((m) => m.type === "DOCUMENT").length > 0 && (
              <Section title="Documentation & Files">
                <div className="rounded-lg border divide-y divide-border">
                  {project.media.filter((m) => m.type === "DOCUMENT").map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium truncate">{doc.title}</p>
                        <p className="text-[11px] text-muted-foreground">{doc.fileType?.toUpperCase() ?? "FILE"}</p>
                      </div>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Separator />

            <Section title="Activity Feed">
              <ScrollArea className="max-h-80">
                <div className="space-y-0">
                  {project.activities.map((activity, i) => (
                    <div key={i} className="flex gap-3 py-3 border-b border-border last:border-0">
                      <Avatar size="sm" className="mt-0.5">
                        <AvatarFallback className="text-[10px]">
                          {activity.user.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px]">
                          <span className="font-medium">{activity.user}</span>{" "}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Section>

            <Separator />

            <Section title="Discussion">
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h4 className="text-base font-semibold">Comments & Discussion</h4>
                <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                  Threaded discussions for this project will be available in the next update.
                </p>
                <Button variant="outline" size="sm" className="mt-4" disabled>
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Join Discussion
                </Button>
              </div>
            </Section>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-8 space-y-6">
              <AnimatedSection delay={0.05}>
                <Button size="lg" className="w-full gap-2">
                  <Handshake className="h-4 w-4" />
                  Request Collaboration
                </Button>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div className="rounded-xl border bg-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Organization
                  </h3>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{project.organization.name}</p>
                      <p className="text-[12px] text-muted-foreground">{project.organization.industry}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <div className="rounded-xl border bg-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Strategists
                    </h3>
                    <span className="text-[13px] text-muted-foreground tabular-nums">{project.contributors.length}</span>
                  </div>
                  <div className="space-y-3">
                    {project.contributors.map((contributor, i) => (
                      <div key={i} className="flex items-center gap-3 group cursor-pointer">
                        <Avatar size="sm">
                          <AvatarFallback className="text-[10px]">
                            {contributor.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium group-hover:text-primary transition-colors truncate">
                            {contributor.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {contributor.title}
                          </p>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="rounded-xl border bg-card p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">24 months</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">{project.budget}</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-muted-foreground">Innovation Areas</span>
                      <span className="font-medium">{project.innovationAreas.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-muted-foreground">Contributors</span>
                      <span className="font-medium">{project.contributors.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-muted-foreground">Documents</span>
                      <span className="font-medium">{project.documents.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-muted-foreground">Milestones</span>
                      <span className="font-medium">{project.milestones.length}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
