"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { DesqueletProgressBar } from "@/components/dashboards/desquelet/desquelet-progress-bar"
import { DesqueletStageEditor } from "@/components/dashboards/desquelet/desquelet-stage-editor"
import { DesqueletEvidencePanel } from "@/components/dashboards/desquelet/desquelet-evidence-panel"
import { DesqueletIterationTimeline } from "@/components/dashboards/desquelet/desquelet-iteration-timeline"
import { DesqueletMilestoneHistory } from "@/components/dashboards/desquelet/desquelet-milestone-history"
import { DesqueletReviewPanel } from "@/components/dashboards/desquelet/desquelet-review-panel"
import { DesqueletReturnDialog } from "@/components/dashboards/desquelet/desquelet-return-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { AnimatedSection } from "@/components/shared/animated-section"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { DESQUELET_STAGE_ORDER, DESQUELET_STAGE_MAP, type DesqueletStageKey } from "@/lib/desquelet-prompts"
import {
  Layers, Clock, GitBranch, Tag, Download, Send,
  ChevronLeft, ChevronRight, Eye
} from "lucide-react"
import Link from "next/link"

interface RecordData {
  id: string
  title: string
  currentRevision: number
  visibility: "FELLOW" | "ASSESSOR" | "PUBLIC"
  createdAt: string
  updatedAt: string
  project?: { id: string; title: string; slug: string } | null
  stages: StageData[]
  iterations: IterationData[]
  milestones: MilestoneData[]
}

interface StageData {
  id: string
  stage: string
  content: { response?: string; links?: { label: string; url: string }[]; notes?: string }
  percentageComplete: number
  lastEditedAt: string
  evidence: EvidenceData[]
  reviews: ReviewData[]
}

interface EvidenceData {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number | null
  description: string | null
  category: string | null
  createdAt: string
}

interface IterationData {
  id: string
  fromStage: string
  toStage: string
  reason: string
  createdAt: string
}

interface MilestoneData {
  id: string
  version: number
  label: string
  reason: string | null
  createdAt: string
}

interface ReviewData {
  id: string
  status: string
  feedback: string | null
  createdAt: string
  reviewer?: { id: string; name: string | null; email: string }
}

export default function DesqueletWorkspacePage() {
  const params = useParams()
  const { data: session } = useSession()
  const recordId = params.recordId as string

  const [record, setRecord] = useState<RecordData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeStage, setActiveStage] = useState<DesqueletStageKey>("D")
  const [returnDialogOpen, setReturnDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)

  const fetchRecord = useCallback(async () => {
    try {
      const res = await fetch(`/api/desquelet/records/${recordId}`)
      if (res.ok) {
        const data = await res.json()
        setRecord(data)
      }
    } catch (err) {
      console.error("Failed to fetch DESQUELET record:", err)
      toast.error("Failed to load record")
    } finally {
      setLoading(false)
    }
  }, [recordId])

  useEffect(() => {
    fetchRecord()
  }, [fetchRecord])

  const handleContentChange = useCallback((stage: DesqueletStageKey, content: Record<string, unknown>, percentage: number) => {
    setRecord((prev) => {
      if (!prev) return prev
      const stages = prev.stages.map((s) =>
        s.stage === stage
          ? { ...s, content: content as StageData["content"], percentageComplete: percentage }
          : s
      )
      return { ...prev, stages }
    })
  }, [])

  const handleSubmitForReview = async (stage: DesqueletStageKey) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/desquelet/records/${recordId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      })

      if (!res.ok) throw new Error("Failed to submit")
      toast.success("Stage submitted for review")
      fetchRecord()
    } catch (err) {
      toast.error("Failed to submit for review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReturnToStage = async (fromStage: DesqueletStageKey, toStage: DesqueletStageKey, reason: string) => {
    try {
      const res = await fetch(`/api/desquelet/records/${recordId}/iterations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromStage, toStage, reason }),
      })

      if (!res.ok) throw new Error("Failed to create iteration")
      toast.success("Iteration created")
      setActiveStage(toStage)
      fetchRecord()
    } catch (err) {
      toast.error("Failed to create iteration")
    }
  }

  const handleMilestoneCreated = () => {
    fetchRecord()
  }

  const handleVisibilityChange = async (visibility: "FELLOW" | "ASSESSOR" | "PUBLIC") => {
    try {
      const res = await fetch(`/api/desquelet/records/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
      })
      if (!res.ok) throw new Error("Failed to update")
      setRecord((prev) => prev ? { ...prev, visibility } : prev)
      toast.success(`Visibility set to ${visibility.toLowerCase()}`)
    } catch (err) {
      toast.error("Failed to update visibility")
    }
  }

  const handleGeneratePdf = async () => {
    try {
      const res = await fetch(`/api/desquelet/records/${recordId}/generate-pdf`, {
        method: "POST",
      })

      if (!res.ok) throw new Error("Failed to generate PDF")

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `desquelet-record-${recordId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("PDF downloaded")
    } catch (err) {
      toast.error("Failed to generate PDF")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!record) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Record not found</p>
        <Link href="/dashboard/desquelet" className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
          Back to Records
        </Link>
      </div>
    )
  }

  const stageContents = record.stages.map((s) => ({
    stage: s.stage,
    percentageComplete: s.percentageComplete,
  }))

  const overallProgress = stageContents.length > 0
    ? Math.round(stageContents.reduce((sum, s) => sum + s.percentageComplete, 0) / stageContents.length)
    : 0

  const stages = DESQUELET_STAGE_ORDER.map((key) => ({
    key,
    percentage: record.stages.find((s) => s.stage === key)?.percentageComplete || 0,
    status: (
      (record.stages.find((s) => s.stage === key)?.percentageComplete || 0) >= 100 ? "completed" :
      (record.stages.find((s) => s.stage === key)?.percentageComplete || 0) > 0 ? "in_progress" :
      "not_started"
    ) as "completed" | "in_progress" | "not_started",
  }))

  const activeStageData = record.stages.find((s) => s.stage === activeStage)
  const activeStageConfig = DESQUELET_STAGE_MAP[activeStage]

  const currentStageIndex = DESQUELET_STAGE_ORDER.indexOf(activeStage)

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/desquelet" className="text-white/40 hover:text-white">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Layers className="text-indigo-400" />
              {record.title}
            </h1>
            {record.project && (
              <p className="text-white/60 mt-1">{record.project.title}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
              {(["FELLOW", "ASSESSOR", "PUBLIC"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => handleVisibilityChange(v)}
                  className={cn(
                    "px-2 py-1 rounded text-xs font-medium transition-all",
                    record.visibility === v
                      ? "bg-indigo-600 text-white"
                      : "text-white/40 hover:text-white/70"
                  )}
                  title={v === "FELLOW" ? "Only you can see" : v === "ASSESSOR" ? "You and assessors can see" : "Visible on public profile"}
                >
                  {v === "FELLOW" ? "Private" : v === "ASSESSOR" ? "Assessor" : "Public"}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGeneratePdf}
              className="border-white/20 text-white/70 hover:text-white"
            >
              <Download size={14} className="mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <GlassCard className="p-4" intensity="light">
          <DesqueletProgressBar
            stages={stages}
            overallProgress={overallProgress}
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                Last updated: {new Date(record.updatedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Tag size={12} />
                Current revision: V{record.currentRevision}
              </span>
              <span className="flex items-center gap-1">
                <GitBranch size={12} />
                {record.iterations.length} iterations
              </span>
            </div>
          </div>
        </GlassCard>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <AnimatedSection delay={0.15}>
            <GlassCard className="p-3" intensity="light">
              <div className="space-y-1">
                {DESQUELET_STAGE_ORDER.map((key) => {
                  const config = DESQUELET_STAGE_MAP[key]
                  const stageData = record.stages.find((s) => s.stage === key)
                  const percentage = stageData?.percentageComplete || 0
                  const isActive = activeStage === key
                  const hasReview = stageData?.reviews && stageData.reviews.length > 0
                  const latestReview = stageData?.reviews?.[0]

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveStage(key)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left",
                        isActive
                          ? "bg-indigo-500/20 border border-indigo-500/30"
                          : "hover:bg-white/5 border border-transparent"
                      )}
                    >
                      <span className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shrink-0",
                        percentage >= 100 ? "bg-green-500/20 text-green-400" :
                        percentage > 0 ? "bg-blue-500/20 text-blue-400" :
                        "bg-white/10 text-white/50"
                      )}>
                        {config.letter}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          isActive ? "text-white" : "text-white/70"
                        )}>
                          {config.name}
                        </p>
                        <p className="text-xs text-white/40">{percentage}%</p>
                      </div>
                      {hasReview && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] shrink-0",
                            latestReview?.status === "APPROVED" ? "text-green-400 border-green-500/30" :
                            latestReview?.status === "REVISION_REQUIRED" ? "text-amber-400 border-amber-500/30" :
                            "text-blue-400 border-blue-500/30"
                          )}
                        >
                          {latestReview?.status === "APPROVED" ? "✓" :
                           latestReview?.status === "REVISION_REQUIRED" ? "!" : "◎"}
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <AnimatedSection delay={0.2}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentStageIndex > 0) {
                      setActiveStage(DESQUELET_STAGE_ORDER[currentStageIndex - 1])
                    }
                  }}
                  disabled={currentStageIndex === 0}
                  className="border-white/20 text-white/70 hover:text-white"
                >
                  <ChevronLeft size={14} />
                </Button>
                <span className="text-sm text-white/60">
                  {currentStageIndex + 1} / {DESQUELET_STAGE_ORDER.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentStageIndex < DESQUELET_STAGE_ORDER.length - 1) {
                      setActiveStage(DESQUELET_STAGE_ORDER[currentStageIndex + 1])
                    }
                  }}
                  disabled={currentStageIndex === DESQUELET_STAGE_ORDER.length - 1}
                  className="border-white/20 text-white/70 hover:text-white"
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </AnimatedSection>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DesqueletStageEditor
                recordId={recordId}
                stage={activeStage}
                content={activeStageData?.content || {}}
                percentage={activeStageData?.percentageComplete || 0}
                onContentChange={handleContentChange}
                onSubmitForReview={handleSubmitForReview}
                onReturnToStage={() => setReturnDialogOpen(true)}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          </AnimatePresence>

          {activeStageData && (
            <AnimatedSection delay={0.25}>
              <DesqueletEvidencePanel
                recordId={recordId}
                stage={activeStage}
                evidence={activeStageData.evidence || []}
                onEvidenceChange={(evidence) => {
                  setRecord((prev) => {
                    if (!prev) return prev
                    const stages = prev.stages.map((s) =>
                      s.stage === activeStage ? { ...s, evidence } : s
                    )
                    return { ...prev, stages }
                  })
                }}
              />
            </AnimatedSection>
          )}

          {activeStageData?.reviews && activeStageData.reviews.length > 0 && (
            <AnimatedSection delay={0.3}>
              <DesqueletReviewPanel reviews={activeStageData.reviews} />
            </AnimatedSection>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedSection delay={0.35}>
              <DesqueletIterationTimeline
                iterations={record.iterations}
              />
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <DesqueletMilestoneHistory
                recordId={recordId}
                currentRevision={record.currentRevision}
                milestones={record.milestones}
                onMilestoneCreated={handleMilestoneCreated}
              />
            </AnimatedSection>
          </div>
        </div>
      </div>

      <DesqueletReturnDialog
        isOpen={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
        onConfirm={handleReturnToStage}
        currentStage={activeStage}
      />
    </div>
  )
}
