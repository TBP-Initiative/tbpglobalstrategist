"use client"

import { useState } from "react"
import { ShieldCheck, ChevronDown, CheckCircle2, AlertTriangle, Info, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AssessmentStageReview {
  stageName: string
  stageLetter: string
  reviewer: string
  status: "APPROVED" | "REVISION_REQUIRED" | "FURTHER_EVIDENCE_REQUIRED"
  feedback: string | null
  date: string
}

export interface AssessmentRecord {
  id: string
  title: string
  project: { id: string; title: string; slug: string } | null
  outcome: string
  tone: "verified" | "assessment" | "evidence"
  areasAssessed: { letter: string; name: string; status: "APPROVED" | "REVISION_REQUIRED" | "FURTHER_EVIDENCE_REQUIRED" }[]
  highlight: string | null
  reviews: AssessmentStageReview[]
}

export interface DesqueletAssessment {
  professionalField: string
  verified: boolean
  records: AssessmentRecord[]
}

const statusLabels: Record<AssessmentStageReview["status"], string> = {
  APPROVED: "Approved",
  REVISION_REQUIRED: "Revision Required",
  FURTHER_EVIDENCE_REQUIRED: "Further Evidence Required",
}

function statusTone(status: AssessmentStageReview["status"]): string {
  if (status === "APPROVED") return "bg-green-50 text-green-700 border-green-200"
  if (status === "REVISION_REQUIRED") return "bg-amber-50 text-amber-700 border-amber-200"
  return "bg-blue-50 text-blue-700 border-blue-200"
}

export function DesqueletVerifiedAssessment({ assessment }: { assessment: DesqueletAssessment }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  if (!assessment || assessment.records.length === 0) return null

  const outcomeTone = assessment.verified ? "green" : "indigo"

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <ShieldCheck className={cn("h-5 w-5", assessment.verified ? "text-emerald-600" : "text-amber-600")} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Verified Assessment &amp; Feedback</h3>
            <p className="text-sm text-gray-500">DESQUELET&reg; Application Review</p>
          </div>
        </div>

        <div className={cn(
          "rounded-lg border px-3 py-1.5 text-xs font-semibold tracking-wide uppercase",
          assessment.verified
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-amber-200 bg-amber-50 text-amber-700"
        )}>
          {assessment.verified ? "TBP Verified" : "TBP Verified Assessment"}
        </div>
      </div>

      {assessment.professionalField && (
        <p className="mb-4 text-sm text-gray-500">
          Professional Field: <span className="font-medium text-gray-700">{assessment.professionalField}</span>
        </p>
      )}

      <div className="space-y-4">
        {assessment.records.map((record) => (
          <div key={record.id} className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{record.title}</p>
                  {record.project ? (
                    <p className="text-xs text-gray-500 mt-0.5">Project: {record.project.title}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-0.5">Standalone workstream</p>
                  )}
                </div>

                <div className={cn(
                  "shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold",
                  record.tone === "verified" && "border-emerald-200 bg-emerald-50 text-emerald-700",
                  record.tone === "assessment" && "border-amber-200 bg-amber-50 text-amber-700",
                  record.tone === "evidence" && "border-blue-200 bg-blue-50 text-blue-700"
                )}>
                  {record.outcome}
                </div>
              </div>

              {record.highlight && (
                <div className="mt-4 rounded-xl border-l-4 border-indigo-500 bg-indigo-50/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Quote size={14} className="text-indigo-400" />
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Assessor Highlight</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">&ldquo;{record.highlight}&rdquo;</p>
                </div>
              )}

              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Areas Assessed</p>
                <div className="flex flex-wrap gap-2">
                  {record.areasAssessed.map((area) => (
                    <span
                      key={area.letter}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium",
                        statusTone(area.status)
                      )}
                    >
                      <span className={cn(
                        "flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold",
                        area.status === "APPROVED" ? "bg-green-100 text-green-600" :
                        area.status === "REVISION_REQUIRED" ? "bg-amber-100 text-amber-600" :
                        "bg-blue-100 text-blue-600"
                      )}>
                        {area.status === "APPROVED" ? "✓" : area.status === "REVISION_REQUIRED" ? "!" : "…"}
                      </span>
                      {area.name}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExpanded(expanded === record.id ? null : record.id)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                {expanded === record.id ? "Hide" : "View"} Verified Assessor Review
                <ChevronDown size={14} className={cn("transition-transform", expanded === record.id && "rotate-180")} />
              </button>
            </div>

            {expanded === record.id && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-3">
                {record.reviews.map((review, i) => (
                  <div key={i} className="rounded-lg border border-gray-100 bg-white p-3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Stage {review.stageLetter} — {review.stageName}
                      </span>
                      <span className={cn("ml-auto rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", statusTone(review.status))}>
                        {statusLabels[review.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <span>Assessor: {review.reviewer}</span>
                      {review.date && <span>· {new Date(review.date).toLocaleDateString()}</span>}
                    </div>
                    {review.feedback && (
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{review.feedback}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowDetails((s) => !s)}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-600"
      >
        <Info size={12} />
        What does this assessment verify?
        <ChevronDown size={12} className={cn("transition-transform", showDetails && "rotate-180")} />
      </button>

      {showDetails && (
        <p className={cn("mt-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500 leading-relaxed", outcomeTone)}>
          This verified assessment confirms that the Fellow&apos;s work was independently reviewed against the TBP
          Global Strategist Institute&apos;s DESQUELET&reg; standard — it is an assessment of the Fellowship work and
          application of the methodology, not an independent engineering certification. It does not certify the
          underlying technical designs for construction or commercial use.
        </p>
      )}

      <div className="mt-5 flex items-start gap-2 rounded-lg bg-indigo-50/60 p-3 text-xs text-gray-600 leading-relaxed">
        <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-indigo-500" />
        <span>
          Assessment evidence is shown only where a stage review has been completed. Pending reviews are not displayed
          publicly until a decision is recorded.
        </span>
      </div>
    </div>
  )
}