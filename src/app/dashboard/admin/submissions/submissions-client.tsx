"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  XCircle,
  Send,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  User,
  FolderKanban,
  ExternalLink,
  Eye,
  AlertTriangle,
} from "lucide-react"

type Revision = {
  id: string
  version: number
  title: string
  status: string
  createdAt: string
  changelog: string | null
}

type Submission = {
  id: string
  title: string
  description: string | null
  fileUrl: string | null
  stage: string | null
  status: string
  version: number
  changelog: string | null
  createdAt: string
  updatedAt: string
  user: { id: string; name: string | null; email: string | null }
  project: { id: string; name: string } | null
  revisions: Revision[]
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  UNDER_REVIEW: "bg-amber-100 text-amber-700",
  REVISION: "bg-orange-100 text-orange-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  PUBLISHED: "bg-blue-100 text-blue-700",
}

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  UNDER_REVIEW: "Under Review",
  REVISION: "Revision Requested",
  APPROVED: "Approved",
  PUBLISHED: "Published",
}

export default function AdminSubmissionsClient({ submissions }: { submissions: Submission[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = filterStatus === "ALL" ? submissions : submissions.filter((s) => s.status === filterStatus)

  const statusCounts = submissions.reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  async function handleAction(id: string, action: "approve" | "publish" | "reject") {
    setProcessingId(id)
    try {
      const res = await fetch(`/api/submissions/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        startTransition(() => router.refresh())
      } else {
        const data = await res.json()
        alert(data.error || "Action failed")
      }
    } catch {
      alert("Network error")
    } finally {
      setProcessingId(null)
    }
  }

  async function handleDelete(id: string) {
    setProcessingId(id)
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" })
      if (res.ok) {
        setConfirmDelete(null)
        startTransition(() => router.refresh())
      } else {
        const data = await res.json()
        alert(data.error || "Delete failed")
      }
    } catch {
      alert("Network error")
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Submissions Review</h1>
          <p className="text-sm text-gray-500 mt-1">{submissions.length} total submissions</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "UNDER_REVIEW", "APPROVED", "PUBLISHED", "REVISION", "DRAFT"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status === "ALL" ? `All (${submissions.length})` : `${statusLabels[status] || status} (${statusCounts[status] || 0})`}
          </button>
        ))}
      </div>

      {/* Submissions list */}
      {filtered.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No submissions found</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => {
            const isExpanded = expandedId === sub.id
            const isProcessing = processingId === sub.id
            const hasRevisions = sub.revisions.length > 1

            return (
              <GlassCard key={sub.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm truncate">{sub.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[sub.status] || "bg-gray-100 text-gray-600"}`}>
                          {statusLabels[sub.status] || sub.status}
                        </span>
                        {sub.version > 1 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700">
                            v{sub.version}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={11} />
                          {sub.user.name || sub.user.email}
                        </span>
                        {sub.project && (
                          <span className="flex items-center gap-1">
                            <FolderKanban size={11} />
                            {sub.project.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(sub.updatedAt).toLocaleDateString()}
                        </span>
                        {hasRevisions && (
                          <span className="flex items-center gap-1">
                            <FileText size={11} />
                            {sub.revisions.length} versions
                          </span>
                        )}
                      </div>
                      {sub.changelog && (
                        <p className="text-xs text-gray-500 mt-1 italic">Latest: {sub.changelog}</p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {sub.status === "UNDER_REVIEW" && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            onClick={() => handleAction(sub.id, "approve")}
                            disabled={isProcessing}
                          >
                            <CheckCircle2 size={12} />
                            Approve
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleAction(sub.id, "reject")}
                            disabled={isProcessing}
                          >
                            <XCircle size={12} />
                            Reject
                          </Button>
                        </>
                      )}
                      {sub.status === "APPROVED" && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleAction(sub.id, "publish")}
                          disabled={isProcessing}
                        >
                          <Send size={12} />
                          Publish
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs gap-1"
                        onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                      >
                        <Eye size={12} />
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs gap-1 text-red-500 hover:bg-red-50"
                        onClick={() => setConfirmDelete(confirmDelete === sub.id ? null : sub.id)}
                        disabled={isProcessing}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>

                  {/* Delete confirmation */}
                  <AnimatePresence>
                    {confirmDelete === sub.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-red-700">
                            <AlertTriangle size={14} />
                            Delete this submission{hasRevisions ? " and all revisions?" : "?"}
                          </div>
                          <div className="flex gap-2">
                            <Button type="button" size="sm" variant="outline" className="h-7 text-xs" onClick={() => setConfirmDelete(null)}>
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleDelete(sub.id)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? "Deleting..." : "Confirm Delete"}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t px-4 py-3 bg-gray-50/50 space-y-3">
                        {sub.description && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                            <p className="text-sm text-gray-700">{sub.description}</p>
                          </div>
                        )}
                        {sub.fileUrl && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">File</p>
                            <a
                              href={sub.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                            >
                              View attached file <ExternalLink size={11} />
                            </a>
                          </div>
                        )}

                        {/* Version history */}
                        {hasRevisions && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">Version History ({sub.revisions.length} versions)</p>
                            <div className="space-y-1.5">
                              {sub.revisions.map((rev) => (
                                <div key={rev.id} className="flex items-center gap-3 text-xs p-2 bg-white rounded border">
                                  <span className="font-mono text-gray-400 w-6">v{rev.version}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusColors[rev.status] || "bg-gray-100"}`}>
                                    {statusLabels[rev.status] || rev.status}
                                  </span>
                                  {rev.changelog && <span className="text-gray-500 truncate flex-1">{rev.changelog}</span>}
                                  <span className="text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
