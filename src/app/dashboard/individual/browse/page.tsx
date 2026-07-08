import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedSection } from "@/components/shared/animated-section"
import {
  FolderKanban,
  ArrowLeft,
  Clock,
  AlertTriangle,
  Sparkles,
  Building2,
  DollarSign,
  Users,
  ExternalLink,
} from "lucide-react"
import { parseFirstCategory, stripHtml } from "@/lib/project-utils"

const stageOrder = ["CANDIDATE", "STRATEGIST", "CONTRIBUTOR", "PROJECT_ALIGNED", "SECTOR_LEAD", "PAID_ADVISER"]

export default async function BrowseProjectsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const profile = await prisma.strategistProfile.findUnique({
    where: { userId: session.user.id },
    select: { stage: true },
  })

  const currentStage = profile?.stage ?? "CANDIDATE"
  const currentStageIndex = stageOrder.indexOf(currentStage)
  const canWork = currentStageIndex >= stageOrder.indexOf("STRATEGIST")

  const projects = await prisma.project.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      description: true,
      category: true,
      budget: true,
      startDate: true,
      endDate: true,
      image: true,
      organization: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { contributors: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const serialized = projects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    shortDescription: p.shortDescription,
    description: p.description,
    category: p.category,
    budget: p.budget?.toString() ?? null,
    startDate: p.startDate?.toISOString() ?? null,
    endDate: p.endDate?.toISOString() ?? null,
    image: p.image,
    organization: p.organization,
    createdBy: p.createdBy,
    contributors: p._count.contributors,
  }))

  const stageLabel = currentStage === "CANDIDATE" ? "Candidate" : currentStage === "STRATEGIST" ? "Strategist" : currentStage === "CONTRIBUTOR" ? "Contributor" : currentStage === "PROJECT_ALIGNED" ? "Aligned" : currentStage === "SECTOR_LEAD" ? "Lead" : "Adviser"

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild className="lg:hidden">
                <Link href="/dashboard">
                  <ArrowLeft size={18} />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Browse Projects</h1>
            </div>
            <Badge variant="outline" className="text-xs">
              Your stage: {stageLabel}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Explore active TBP projects and find opportunities to contribute.
          </p>
        </div>
      </AnimatedSection>

      {!canWork && (
        <AnimatedSection>
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-500">Stage requirement not met</p>
              <p className="text-xs text-muted-foreground">
                You need to reach the <strong>Strategist</strong> stage before you can work on projects.
                Complete your profile and submit a reflection to progress from Candidate to Strategist.
              </p>
            </div>
          </div>
        </AnimatedSection>
      )}

      {serialized.length === 0 ? (
        <AnimatedSection>
          <GlassCard className="p-12" intensity="light">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FolderKanban size={32} />
              </div>
              <h2 className="text-xl font-semibold">No active projects</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                There are no active projects available right now. Check back later for new opportunities.
              </p>
              <Button variant="default" className="mt-2 gap-1.5" asChild>
                <Link href="/dashboard">
                  <ArrowLeft size={14} />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </GlassCard>
        </AnimatedSection>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {serialized.map((project, index) => (
            <AnimatedSection key={project.id} delay={index * 0.05}>
              <GlassCard className="group flex h-full flex-col overflow-hidden p-0" intensity="light">
                {project.image && (
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-semibold leading-tight mb-1">{project.title}</h3>

                  {parseFirstCategory(project.category) && (
                    <Badge variant="outline" className="w-fit text-[10px] mb-2">
                      {parseFirstCategory(project.category)}
                    </Badge>
                  )}

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {stripHtml(project.shortDescription ?? project.description)}
                  </p>

                  <div className="mt-auto space-y-2">
                    {project.organization && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 size={12} />
                        <span>{project.organization.name}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {project.budget && (
                        <div className="flex items-center gap-1">
                          <DollarSign size={12} />
                          <span>{Number(project.budget).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>{project.contributors} contributor{project.contributors !== 1 ? "s" : ""}</span>
                      </div>
                      {project.endDate && (
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>Due {new Date(project.endDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {project.createdBy && (
                      <p className="text-[10px] text-muted-foreground">
                        Posted by {project.createdBy.name}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    {canWork ? (
                      <Button className="w-full gap-1.5" size="sm" asChild>
                        <Link href={`/dashboard/individual/browse/${project.id}`}>
                          View Project
                          <ExternalLink size={12} />
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full gap-1.5" size="sm" disabled>
                        <Sparkles size={14} />
                        Reach Strategist to Apply
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  )
}
