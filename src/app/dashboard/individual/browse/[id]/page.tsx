import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedSection } from "@/components/shared/animated-section"
import { ArrowLeft, Building2, DollarSign, Users, Clock, Calendar, User, AlertTriangle, Sparkles } from "lucide-react"

const stageOrder = ["CANDIDATE", "STRATEGIST", "CONTRIBUTOR", "PROJECT_ALIGNED", "SECTOR_LEAD", "PAID_ADVISER"]

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const profile = await prisma.strategistProfile.findUnique({
    where: { userId: session.user.id },
    select: { stage: true },
  })

  const currentStage = profile?.stage ?? "CANDIDATE"
  const currentStageIndex = stageOrder.indexOf(currentStage)
  const canWork = currentStageIndex >= stageOrder.indexOf("STRATEGIST")

  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      description: true,
      objectives: true,
      strategicRelevance: true,
      category: true,
      budget: true,
      status: true,
      startDate: true,
      endDate: true,
      image: true,
      organization: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true, email: true } },
      _count: { select: { contributors: true } },
    },
  })

  if (!project) {
    redirect("/dashboard/individual/browse")
  }

  const stageLabel = currentStage === "CANDIDATE" ? "Candidate" : currentStage === "STRATEGIST" ? "Strategist" : currentStage === "CONTRIBUTOR" ? "Contributor" : currentStage === "PROJECT_ALIGNED" ? "Aligned" : currentStage === "SECTOR_LEAD" ? "Lead" : "Adviser"

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/individual/browse">
                <ArrowLeft size={18} />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
              {project.organization && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Building2 size={14} />
                  {project.organization.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {!canWork && (
        <AnimatedSection>
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-500">Stage requirement not met</p>
              <p className="text-xs text-muted-foreground">
                You need to reach the <strong>Strategist</strong> stage to work on this project.
                Your current stage: <strong>{stageLabel}</strong>.
              </p>
            </div>
          </div>
        </AnimatedSection>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {project.image && (
            <AnimatedSection>
              <div className="relative h-64 w-full overflow-hidden rounded-xl">
                <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection>
            <GlassCard className="p-6" intensity="light">
              <h2 className="mb-3 text-lg font-semibold">About this project</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {project.description ?? project.shortDescription ?? "No description provided."}
              </p>
            </GlassCard>
          </AnimatedSection>

          {project.objectives && (
            <AnimatedSection>
              <GlassCard className="p-6" intensity="light">
                <h2 className="mb-3 text-lg font-semibold">Objectives</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{project.objectives}</p>
              </GlassCard>
            </AnimatedSection>
          )}

          {project.strategicRelevance && (
            <AnimatedSection>
              <GlassCard className="p-6" intensity="light">
                <h2 className="mb-3 text-lg font-semibold">Strategic Relevance</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{project.strategicRelevance}</p>
              </GlassCard>
            </AnimatedSection>
          )}
        </div>

        <div className="space-y-6">
          <AnimatedSection>
            <GlassCard className="p-6" intensity="light">
              <h3 className="mb-4 text-sm font-semibold">Project Details</h3>
              <div className="space-y-3">
                {project.category && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="outline" className="text-xs">{project.category}</Badge>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="text-xs text-green-500 border-green-500/20">{project.status}</Badge>
                </div>
                {project.budget && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">${Number(project.budget).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contributors</span>
                  <span className="font-medium">{project._count.contributors}</span>
                </div>
                {project.startDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Start Date</span>
                    <span>{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                )}
                {project.endDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">End Date</span>
                    <span>{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                )}
                {project.createdBy && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Posted by</span>
                    <span>{project.createdBy.name}</span>
                  </div>
                )}
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection>
            <GlassCard className="p-6" intensity="light">
              <h3 className="mb-4 text-sm font-semibold">Your Stage</h3>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-xs">{stageLabel}</Badge>
              </div>
              {canWork ? (
                <Button className="w-full gap-1.5" size="sm">
                  <Sparkles size={14} />
                  Express Interest
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button className="w-full gap-1.5" size="sm" disabled>
                    <AlertTriangle size={14} />
                    Reach Strategist to Apply
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Complete your profile and submit a reflection to advance from Candidate to Strategist.
                  </p>
                </div>
              )}
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
