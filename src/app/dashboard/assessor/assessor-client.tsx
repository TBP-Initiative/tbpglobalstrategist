"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AdminSubmissionsClient from "@/app/dashboard/admin/submissions/submissions-client"
import { DESQUELET_STAGE_MAP } from "@/lib/desquelet-prompts"
import { toast } from "sonner"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  User,
  FolderKanban,
  ExternalLink,
  ClipboardCheck,
  Layers,
  Paperclip,
  Users,
  MessageSquare,
} from "lucide-react"

interface Evidence {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number | null
  description: string | null
  category: string | null
}

interface StageContent {
  response?: string
  links?: { label: string; url: string }[]
  notes?: string
}

interface ReviewItem {
  id: string
  createdAt: string
  stage: string
  content: unknown
  percentageComplete: number
  evidence: Evidence[]
  record: {
    id: string
    title: string
    currentRevision: number
    visibility: string
    updatedAt: string
    user: { id: string; name: string | null; email: string | null }
    project: { id: string; title: string } | null
  }
}

interface Student {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  createdAt: string
  stage: string | null
  onboardingStatus: string | null
  source: string | null
  records: number
  submissions: number
}

interface AssessorClientProps {
  reviews: ReviewItem[]
  submissions: React.ComponentProps<typeof AdminSubmissionsClient>["submissions"]
  students: Student[]
  isAdmin: boolean
}

const stageLabels: Record<string, string> = {
  CANDIDATE: "Candidate",
  STRATEGIST: "Strategist",
  CONTRIBUTOR: "Contributor",
  PROJECT_ALIGNED: "Project-Aligned",
  SECTOR_LEAD: "Sector Lead",
  PAID_ADVISER: "Paid Adviser",
}

function initials(name: string | null, email: string | null) {
  const source = name || email || "?"
  return source
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AssessorClient({ reviews, submissions, students, isAdmin }: AssessorClientProps) {
  const router = useRouter()
  const [tab, setTab] = useState<"desquelet" | "submissions" | "students">("desquelet")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [messagingId, setMessagingId] = useState<string | null>(null)

  async function startConversation(studentId: string) {
    setMessagingId(studentId)
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantIds: [studentId] }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to start conversation")
      }
      const conv = await res.json()
      router.push(`/dashboard/messages/${conv.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start conversation")
    } finally {
      setMessagingId(null)
    }
  }

  async function submitReview(item: ReviewItem, action: "approve" | "reject" | "evidence") {
    setProcessingId(item.id)
    try {
      const res = await fetch(`/api/desquelet/records/${item.record.id}/stages/${item.stage}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, feedback: (feedback[item.id] || "").trim() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Review failed")
      }
      toast.success(
        action === "approve"
          ? "Stage approved"
          : action === "reject"
            ? "Revision requested"
            : "Further evidence requested",
      )
      setExpandedId(null)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Review failed")
    } finally {
      setProcessingId(null)
    }
  }

  const tabs = [
    { key: "desquelet" as const, label: "DESQUELET Reviews", count: reviews.length, icon: Layers },
    { key: "submissions" as const, label: "Submissions", count: submissions.length, icon: FileText },
    { key: "students" as const, label: "My Students", count: students.length, icon: Users },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardCheck className="text-indigo-600" />
            Assessor Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review DESQUELET stage submissions and research submissions assigned to you.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-center">
            <p className="text-xl font-bold text-indigo-600">{reviews.length}</p>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">DESQUELET</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-center">
            <p className="text-xl font-bold text-blue-600">{submissions.length}</p>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Submissions</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map(({ key, label, count, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === key ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Icon size={14} />
            {label}
            <span className={`rounded-full px-1.5 text-[10px] ${tab === key ? "bg-white/20" : "bg-white"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {tab === "desquelet" ? (
        reviews.length === 0 ? (
          <GlassCard className="p-12 text-center" intensity="light">
            <ClipboardCheck size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No DESQUELET stages awaiting your review</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {reviews.map((item) => {
              const config = DESQUELET_STAGE_MAP[item.stage as keyof typeof DESQUELET_STAGE_MAP]
              const content = (item.content || {}) as StageContent
              const isExpanded = expandedId === item.id
              const isProcessing = processingId === item.id

              return (
                <GlassCard key={item.id} className="overflow-hidden" intensity="light">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-bold shrink-0">
                            {config?.letter ?? item.stage}
                          </span>
                          <h3 className="font-semibold text-sm truncate">{item.record.title}</h3>
                          <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 border-blue-200">
                            <Clock size={11} className="mr-1" />
                            Pending Review
                          </Badge>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                            {config?.name ?? item.stage}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User size={11} />
                            {item.record.user.name || item.record.user.email}
                          </span>
                          {item.record.project && (
                            <span className="flex items-center gap-1">
                              <FolderKanban size={11} />
                              {item.record.project.title}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Paperclip size={11} />
                            {item.evidence.length} evidence
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            Submitted {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          <span>{item.percentageComplete}% complete</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs gap-1"
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        >
                          {isExpanded ? "Hide" : "Review"}
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t px-4 py-4 bg-gray-50/50 space-y-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Stage Response</p>
                            {content.response ? (
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{content.response}</p>
                            ) : (
                              <p className="text-sm text-gray-400 italic">No written response provided</p>
                            )}
                          </div>

                          {content.notes && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Notes</p>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{content.notes}</p>
                            </div>
                          )}

                          {content.links && content.links.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Links</p>
                              <ul className="space-y-1">
                                {content.links.map((link, i) => (
                                  <li key={i}>
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                    >
                                      {link.label || link.url} <ExternalLink size={11} />
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.evidence.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Evidence</p>
                              <div className="space-y-1.5">
                                {item.evidence.map((ev) => (
                                  <a
                                    key={ev.id}
                                    href={ev.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-indigo-200"
                                  >
                                    <FileText size={14} className="text-gray-400 shrink-0" />
                                    <span className="truncate flex-1">{ev.fileName}</span>
                                    {ev.category && (
                                      <span className="text-[10px] uppercase tracking-wide text-gray-400">
                                        {ev.category}
                                      </span>
                                    )}
                                    <span className="text-xs text-gray-400">{formatFileSize(ev.fileSize)}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
                            <p className="text-xs font-semibold text-primary">Assessor Feedback</p>
                            <textarea
                              value={feedback[item.id] || ""}
                              onChange={(e) => setFeedback((prev) => ({ ...prev, [item.id]: e.target.value }))}
                              placeholder="Provide feedback for the fellow (required for revision or further evidence requests)"
                              rows={3}
                              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm focus:border-primary focus:outline-none resize-y"
                            />
                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => submitReview(item, "approve")}
                                disabled={isProcessing}
                              >
                                <CheckCircle2 size={12} />
                                Approve
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1 text-amber-600 border-amber-200 hover:bg-amber-50"
                                onClick={() => submitReview(item, "reject")}
                                disabled={isProcessing}
                              >
                                <XCircle size={12} />
                                Request Revision
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => submitReview(item, "evidence")}
                                disabled={isProcessing}
                              >
                                <AlertCircle size={12} />
                                Further Evidence
                              </Button>
                              {isProcessing && <span className="text-xs text-gray-400">Submitting...</span>}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              )
            })}
          </div>
        )
      ) : tab === "submissions" ? (
        <AdminSubmissionsClient submissions={submissions} isAdmin={isAdmin} />
      ) : students.length === 0 ? (
        <GlassCard className="p-12 text-center" intensity="light">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No students or applicants assigned to you yet</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {students.map((student) => {
            const typeLabel =
              student.source === "INSTITUTE_APPLICATION"
                ? "Applicant"
                : student.source === "ONBOARDING"
                  ? "Fellow"
                  : student.role
            return (
              <GlassCard key={student.id} className="p-4" intensity="light">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 overflow-hidden">
                    {student.image ? (
                      <img src={student.image} alt={student.name || ""} className="h-full w-full object-cover" />
                    ) : (
                      initials(student.name, student.email)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {student.name || student.email}
                      </p>
                      <Badge variant="outline" className="text-[10px]">
                        {typeLabel}
                      </Badge>
                      {student.stage && (
                        <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-600 border-indigo-200">
                          {stageLabels[student.stage] ?? student.stage}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{student.email}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {student.records} DESQUELET record{student.records === 1 ? "" : "s"} ·{" "}
                      {student.submissions} submission{student.submissions === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => startConversation(student.id)}
                    disabled={messagingId === student.id}
                  >
                    <MessageSquare size={13} className="mr-1" />
                    {messagingId === student.id ? "Starting..." : "Message"}
                  </Button>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
