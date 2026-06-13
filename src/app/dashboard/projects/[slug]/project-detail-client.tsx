"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  FolderKanban,
  FileText,
  Video,
  Link2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Milestone,
  CheckCircle2,
  Circle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

function parseCategories(cat: string | null | undefined): string[] {
  if (!cat) return []
  try {
    const parsed = JSON.parse(cat)
    return Array.isArray(parsed) ? parsed : [cat]
  } catch {
    return [cat]
  }
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-500 border-green-500/20",
  DRAFT: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
}

type ProjectData = {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  description: string | null
  objectives: string | null
  strategicRelevance: string | null
  status: string
  budget: string | null
  startDate: string | null
  endDate: string | null
  image: string | null
  category: string | null
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  organization: { id: string; name: string; slug: string } | null
  createdBy: { id: string; name: string | null; email: string; image: string | null }
  contributors: { user: { id: string; name: string | null; email: string; image: string | null; role: string }; role: string }[]
  media: { id: string; type: string; url: string; title: string | null; fileType: string | null; fileSize: number | null; createdAt: string }[]
  relations: { relationType: string; relatedProject: { id: string; title: string; slug: string; image: string | null; category: string | null; shortDescription: string | null; status: string } }[]
  milestones: { id: string; title: string; description: string | null; dueDate: string | null; completed: boolean; completedAt: string | null; sortOrder: number; weight: number }[]
  progress: number
  stage: string
  _count: { contributors: number; media: number; milestones: number }
}

type RelatedProject = {
  id: string
  title: string
  slug: string
  image: string | null
  category: string | null
  shortDescription: string | null
  status: string
}

export function ProjectDetailClient({
  project,
  relatedProjects,
  isAdmin,
}: {
  project: ProjectData
  relatedProjects: RelatedProject[]
  isAdmin: boolean
}) {
  const objectivesList = useMemo(() => {
    try {
      const parsed = JSON.parse(project.objectives ?? "[]")
      return Array.isArray(parsed) ? parsed : project.objectives?.split("\n").filter(Boolean) ?? []
    } catch {
      return project.objectives?.split("\n").filter(Boolean) ?? []
    }
  }, [project.objectives])

  const [currentSlide, setCurrentSlide] = useState(0)
  const maxSlide = Math.max(0, relatedProjects.length - 1)

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link href="/dashboard/projects">
            <ArrowLeft size={14} />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* 1. Featured Image Hero */}
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-2xl">
          {project.image ? (
            <div
              className="h-64 sm:h-80 md:h-96 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${project.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
          ) : (
            <div className="h-64 sm:h-80 md:h-96 w-full bg-gradient-to-br from-indigo-900/40 to-purple-900/40 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <FolderKanban size={64} className="text-white/20" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {parseCategories(project.category).map((c) => (
                <Badge key={c} variant="outline" className="bg-white/10 text-white border-white/20 text-xs">
                  {c}
                </Badge>
              ))}
              <Badge variant="outline" className={(statusColors[project.status] ?? "") + " text-xs"}>
                {project.status}
              </Badge>
              {project.isFeatured && (
                <Badge variant="default" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              {project.title}
            </h1>
            {project.shortDescription && (
              <p className="text-white/70 text-sm sm:text-base max-w-2xl">
                {project.shortDescription}
              </p>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <GlassCard className="p-4" intensity="light">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <DollarSign size={14} />
            <span className="text-xs">Budget</span>
          </div>
          <p className="text-lg font-semibold">{project.budget ? `$${Number(project.budget).toLocaleString()}` : "—"}</p>
        </GlassCard>
        <GlassCard className="p-4" intensity="light">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users size={14} />
            <span className="text-xs">Contributors</span>
          </div>
          <p className="text-lg font-semibold">{project._count.contributors}</p>
        </GlassCard>
        <GlassCard className="p-4" intensity="light">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar size={14} />
            <span className="text-xs">Start Date</span>
          </div>
          <p className="text-sm font-semibold">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"}</p>
        </GlassCard>
        <GlassCard className="p-4" intensity="light">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FolderKanban size={14} />
            <span className="text-xs">Organization</span>
          </div>
          <p className="text-sm font-semibold truncate">{project.organization?.name ?? "—"}</p>
        </GlassCard>
        <GlassCard className="p-4" intensity="light">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Milestone size={14} />
            <span className="text-xs">Progress · {project.stage}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{project._count.milestones} milestones</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-1.5" />
          </div>
        </GlassCard>
      </div>

      {/* 2. Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AnimatedSection delay={0.1}>
            <GlassCard className="p-6" intensity="light">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText size={16} className="text-muted-foreground" />
                Project Overview
              </h2>
              {project.description ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-fg leading-[2.2] [&_p]:mb-6"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              ) : (
                <p className="text-muted-foreground text-sm">No description provided.</p>
              )}
            </GlassCard>
          </AnimatedSection>

          {objectivesList.length > 0 && (
            <AnimatedSection delay={0.15}>
              <GlassCard className="p-6" intensity="light">
                <h2 className="text-lg font-semibold mb-4">Project Objectives</h2>
                <ul className="space-y-2">
                  {objectivesList.map((obj: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </AnimatedSection>
          )}

          {project.strategicRelevance && (
            <AnimatedSection delay={0.2}>
              <GlassCard className="p-6" intensity="light">
                <h2 className="text-lg font-semibold mb-4">Strategic Relevance</h2>
                <p className="text-sm text-muted-foreground">{project.strategicRelevance}</p>
              </GlassCard>
            </AnimatedSection>
          )}
        </div>

        {/* 3. Project Team */}
        <div className="space-y-6">
          <AnimatedSection delay={0.15}>
            <GlassCard className="p-6" intensity="light">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Users size={14} className="text-muted-foreground" />
                Project Team
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {(project.createdBy.name ?? project.createdBy.email).split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{project.createdBy.name ?? "Unknown"}</p>
                    <p className="text-xs text-muted-foreground truncate">Lead · {project.createdBy.email}</p>
                  </div>
                </div>
                {project.contributors.map((c) => (
                  <div key={c.user.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {(c.user.name ?? c.user.email).split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{c.user.name ?? "Unknown"}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.role} · {c.user.email}</p>
                    </div>
                  </div>
                ))}
                {project.contributors.length === 0 && (
                  <p className="text-xs text-muted-foreground">No additional contributors.</p>
                )}
              </div>
            </GlassCard>
          </AnimatedSection>

          {project.organization && (
            <AnimatedSection delay={0.2}>
              <GlassCard className="p-6" intensity="light">
                <h2 className="text-sm font-semibold mb-2">Organization</h2>
                <Link
                  href={`/dashboard/organizations/${project.organization.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  {project.organization.name}
                </Link>
              </GlassCard>
            </AnimatedSection>
          )}
        </div>
      </div>

      {/* Milestones */}
      {project.milestones.length > 0 && (
        <AnimatedSection delay={0.25}>
          <GlassCard className="p-6" intensity="light">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Milestone size={16} className="text-muted-foreground" />
              Milestones
              <span className="text-xs font-normal text-muted-foreground ml-auto">
                {project.milestones.filter((m) => m.completed).length} / {project.milestones.length} completed
              </span>
            </h2>
            <div className="space-y-3">
              {project.milestones.map((m) => (
                <div key={m.id} className="flex items-start gap-3">
                  {m.completed ? (
                    <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${m.completed ? "line-through text-muted-foreground" : ""}`}>
                        {m.title}
                      </p>
                      {m.dueDate && (
                        <span className="text-xs text-muted-foreground">{new Date(m.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    {m.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </AnimatedSection>
      )}

      {/* 4. Documents & Resources */}
      {project.media.filter((m) => m.type === "DOCUMENT").length > 0 && (
        <AnimatedSection delay={0.25}>
          <GlassCard className="p-6" intensity="light">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText size={16} className="text-muted-foreground" />
              Documents & Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {project.media.filter((m) => m.type === "DOCUMENT").map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <FileText size={20} className="text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{doc.title ?? "Document"}</p>
                    {doc.fileType && (
                      <p className="text-xs text-muted-foreground uppercase">{doc.fileType}</p>
                    )}
                  </div>
                  <ExternalLink size={14} className="ml-auto shrink-0 text-muted-foreground" />
                </a>
              ))}
            </div>
          </GlassCard>
        </AnimatedSection>
      )}

      {/* 5. Videos & Media */}
      {project.media.filter((m) => m.type === "YOUTUBE" || m.type === "VIMEO" || m.type === "VIDEO").length > 0 && (
        <AnimatedSection delay={0.3}>
          <GlassCard className="p-6" intensity="light">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Video size={16} className="text-muted-foreground" />
              Videos & Media
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.media.filter((m) => m.type === "YOUTUBE" || m.type === "VIMEO" || m.type === "VIDEO").map((vid) => (
                <div key={vid.id} className="aspect-video rounded-xl overflow-hidden bg-muted">
                  {vid.type === "YOUTUBE" ? (
                    <iframe
                      src={vid.url}
                      title={vid.title ?? "Video"}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : vid.type === "VIMEO" ? (
                    <iframe
                      src={vid.url}
                      title={vid.title ?? "Video"}
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
          </GlassCard>
        </AnimatedSection>
      )}

      {/* 6. Related Projects */}
      {relatedProjects.length > 0 && (
        <AnimatedSection delay={0.35}>
          <GlassCard className="p-6" intensity="light">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Link2 size={16} className="text-muted-foreground" />
              Related Projects
            </h2>

            {/* Desktop Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProjects.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/dashboard/projects/${rp.slug}`}
                  className="group rounded-xl border border-border overflow-hidden transition-all hover:border-primary/30 hover:shadow-md"
                >
                  {rp.image ? (
                    <div
                      className="h-32 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${rp.image})` }}
                    />
                  ) : (
                    <div className="h-32 w-full bg-gradient-to-br from-indigo-900/20 to-purple-900/20 flex items-center justify-center">
                      <FolderKanban size={24} className="text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      {parseCategories(rp.category).map((c) => (
                        <Badge key={c} variant="outline" className="text-[10px] px-1 h-4">{c}</Badge>
                      ))}
                      <Badge variant="outline" className={(statusColors[rp.status] ?? "") + " text-[10px] px-1 h-4"}>
                        {rp.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">{rp.title}</p>
                    {rp.shortDescription && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{rp.shortDescription}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="sm:hidden relative">
              <div className="overflow-hidden rounded-xl border border-border">
                {(() => {
                  const rp = relatedProjects[currentSlide]
                  return (
                    <Link
                      key={rp.id}
                      href={`/dashboard/projects/${rp.slug}`}
                      className="block group"
                    >
                      {rp.image ? (
                        <div
                          className="h-40 w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${rp.image})` }}
                        />
                      ) : (
                        <div className="h-40 w-full bg-gradient-to-br from-indigo-900/20 to-purple-900/20 flex items-center justify-center">
                          <FolderKanban size={32} className="text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          {parseCategories(rp.category).map((c) => (
                            <Badge key={c} variant="outline" className="text-[10px] px-1 h-4">{c}</Badge>
                          ))}
                          <Badge variant="outline" className={(statusColors[rp.status] ?? "") + " text-[10px] px-1 h-4"}>
                            {rp.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">{rp.title}</p>
                        {rp.shortDescription && (
                          <p className="text-xs text-muted-foreground mt-1">{rp.shortDescription}</p>
                        )}
                      </div>
                    </Link>
                  )
                })()}
              </div>
              {maxSlide > 0 && (
                <div className="flex items-center justify-between mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
                    disabled={currentSlide === 0}
                  >
                    <ChevronLeft size={14} />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {currentSlide + 1} / {relatedProjects.length}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentSlide((p) => Math.min(maxSlide, p + 1))}
                    disabled={currentSlide === maxSlide}
                  >
                    <ChevronRight size={14} />
                  </Button>
                </div>
              )}
            </div>
          </GlassCard>
        </AnimatedSection>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
        {isAdmin && (
          <Button variant="outline" size="sm" asChild className="gap-1">
            <Link href={`/dashboard/projects?edit=${project.id}`}>
              <ExternalLink size={12} />
              Edit in Admin
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
