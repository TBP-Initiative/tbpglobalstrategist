import { DESQUELET_STAGE_ORDER, DESQUELET_STAGE_MAP, type DesqueletStageKey } from "./desquelet-prompts"

export const DESQUELET_LETTER_MAP: Record<string, DesqueletStageKey> = {
  D: "D",
  E: "E1",
  S: "S",
  Q: "Q",
  U: "U",
  L: "L",
  T: "T",
}

export const DESQUELET_LETTER_REVERSE: Record<DesqueletStageKey, string> = {
  D: "D",
  E1: "E",
  S: "S",
  Q: "Q",
  U: "U",
  E2: "E",
  L: "L",
  E3: "E",
  T: "T",
}

export interface StageProgress {
  key: DesqueletStageKey
  letter: string
  name: string
  percentage: number
  status: "completed" | "in_progress" | "not_started"
  hasReview: boolean
  reviewStatus?: string
}

export function calculateOverallProgress(
  stages: { stage?: string; percentageComplete: number }[]
): number {
  if (!stages || stages.length === 0) return 0
  const total = stages.reduce((sum, s) => sum + s.percentageComplete, 0)
  return Math.round(total / stages.length)
}

export function getStageStatus(percentage: number): "completed" | "in_progress" | "not_started" {
  if (percentage >= 100) return "completed"
  if (percentage > 0) return "in_progress"
  return "not_started"
}

export function buildStageProgress(
  stageContents: { stage: string; percentageComplete: number }[],
  reviews?: { stage: string; status: string }[]
): StageProgress[] {
  return DESQUELET_STAGE_ORDER.map((key) => {
    const content = stageContents.find((s) => s.stage === key)
    const percentage = content?.percentageComplete ?? 0
    const review = reviews?.find((r) => r.stage === key)
    return {
      key,
      letter: DESQUELET_LETTER_REVERSE[key],
      name: DESQUELET_STAGE_MAP[key].name,
      percentage,
      status: getStageStatus(percentage),
      hasReview: !!review,
      reviewStatus: review?.status,
    }
  })
}

export function formatStageIndicator(stages: StageProgress[]): string {
  return stages
    .map((s) => {
      if (s.status === "completed") return `${s.letter} ✓`
      if (s.status === "in_progress") return `${s.letter} ◐`
      return `${s.letter} ○`
    })
    .join("  ")
}

export function getCurrentStage(stages: StageProgress[]): StageProgress | undefined {
  const inProgress = stages.find((s) => s.status === "in_progress")
  if (inProgress) return inProgress
  const notStarted = stages.find((s) => s.status === "not_started")
  return notStarted
}

export interface IterationPath {
  from: DesqueletStageKey
  to: DesqueletStageKey
  date: string
  reason: string
}

export function buildIterationTimeline(
  iterations: { fromStage: string; toStage: string; reason: string; createdAt: string }[]
): IterationPath[] {
  return iterations.map((i) => ({
    from: i.fromStage as DesqueletStageKey,
    to: i.toStage as DesqueletStageKey,
    date: i.createdAt,
    reason: i.reason,
  }))
}

export interface DesqueletDashboardStats {
  activeWorkstreams: number
  stagesCompleted: number
  researchIterations: number
  validatedOutputs: number
  assessorReviews: number
  overallProgress: number
}

export function calculateDashboardStats(records: {
  stages: { stage?: string; percentageComplete: number }[]
  iterations: unknown[]
  milestones: unknown[]
}[]): DesqueletDashboardStats {
  const activeWorkstreams = records.length
  const allStages = records.flatMap((r) => r.stages)
  const stagesCompleted = allStages.filter((s) => s.percentageComplete >= 100).length
  const researchIterations = records.reduce((sum, r) => sum + r.iterations.length, 0)
  const validatedOutputs = records.reduce((sum, r) => sum + r.milestones.length, 0)
  const overallProgress = calculateOverallProgress(allStages)

  return {
    activeWorkstreams,
    stagesCompleted,
    researchIterations,
    validatedOutputs,
    assessorReviews: 0,
    overallProgress,
  }
}
