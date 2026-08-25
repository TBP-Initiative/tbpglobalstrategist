export interface DesqueletRecord {
  id: string
  userId: string
  projectId: string | null
  title: string
  currentRevision: number
  createdAt: string
  updatedAt: string
  project?: { id: string; title: string; slug: string } | null
  stages?: DesqueletStageContent[]
  iterations?: DesqueletIteration[]
  milestones?: DesqueletMilestone[]
}

export interface DesqueletStageContent {
  id: string
  recordId: string
  stage: string
  content: DesqueletStageData
  percentageComplete: number
  lastEditedAt: string
  createdAt: string
  updatedAt: string
  evidence?: DesqueletEvidence[]
  reviews?: DesqueletReview[]
}

export interface DesqueletStageData {
  response?: string
  links?: { label: string; url: string }[]
  notes?: string
  [key: string]: unknown
}

export interface DesqueletEvidence {
  id: string
  stageContentId: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number | null
  description: string | null
  category: string | null
  createdAt: string
}

export interface DesqueletIteration {
  id: string
  recordId: string
  fromStage: string
  toStage: string
  reason: string
  createdAt: string
}

export interface DesqueletMilestone {
  id: string
  recordId: string
  version: number
  label: string
  reason: string | null
  snapshot: Record<string, unknown>
  createdAt: string
}

export interface DesqueletReview {
  id: string
  stageContentId: string
  reviewerId: string
  status: "PENDING" | "APPROVED" | "REVISION_REQUIRED" | "FURTHER_EVIDENCE_REQUIRED"
  feedback: string | null
  createdAt: string
  updatedAt: string
  reviewer?: { id: string; name: string | null; email: string }
}

export interface DesqueletDashboardStats {
  activeWorkstreams: number
  stagesCompleted: number
  researchIterations: number
  validatedOutputs: number
  assessorReviews: number
  overallProgress: number
}

export interface StageProgress {
  key: string
  letter: string
  name: string
  percentage: number
  status: "completed" | "in_progress" | "not_started"
  hasReview: boolean
  reviewStatus?: string
}
