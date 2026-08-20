"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Link2, FileText, CheckCircle2, ExternalLink, Clock, AlertCircle,
  GitBranch, History, Send, ChevronDown, ChevronUp, X, Trash2, Eye,
} from "lucide-react"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function getUrlType(url: string): string {
  try {
    const host = new URL(url).hostname.toLowerCase()
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "Video"
    if (host.includes("docs.google.com") || host.includes("drive.google.com")) return "Document"
    if (url.endsWith(".pdf") || host.includes("pdf")) return "PDF"
    if (/\.(mp4|mov|avi|webm)$/i.test(url)) return "Video"
    if (/\.(pptx?|key)$/i.test(url)) return "Presentation"
    if (/\.(xlsx?|csv)$/i.test(url)) return "Spreadsheet"
    if (/\.(docx?|odt)$/i.test(url)) return "Document"
  } catch {}
  return "Link"
}

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  DRAFT: { label: "Draft", class: "bg-gray-100 text-gray-600 border-gray-200" },
  UNDER_REVIEW: { label: "Under Review", class: "bg-blue-100 text-blue-700 border-blue-200" },
  REVISION: { label: "Revision Needed", class: "bg-amber-100 text-amber-700 border-amber-200" },
  APPROVED: { label: "Approved", class: "bg-green-100 text-green-700 border-green-200" },
  PUBLISHED: { label: "Published", class: "bg-purple-100 text-purple-700 border-purple-200" },
}

type SubmissionData = {
  id: string
  stage: string
  title: string
  description: string | null
  fileUrl: string
  fileType: string
  fileSize: number | null
  version: number
  isLatest: boolean
  status: string
  changelog: string | null
  createdAt: string
  parentSubmissionId: string | null
  project?: { id: string; title: string; slug: string } | null
  revisions?: { id: string; version: number; status: string; title: string; createdAt: string }[]
}

type VersionEntry = {
  id: string
  version: number
  title: string
  status: string
  changelog: string | null
  createdAt: string
  isLatest: boolean
  fileSize: number | null
  fileType: string
}

export function SubmissionForm({ currentStage }: { currentStage: string }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submissions, setSubmissions] = useState<SubmissionData[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(true)

  const [revisingId, setRevisingId] = useState<string | null>(null)
  const [revisionUrl, setRevisionUrl] = useState("")
  const [revisionChangelog, setRevisionChangelog] = useState("")
  const [revisionTitle, setRevisionTitle] = useState("")
  const [submittingRevision, setSubmittingRevision] = useState(false)

  const [historyId, setHistoryId] = useState<string | null>(null)
  const [versions, setVersions] = useState<VersionEntry[]>([])
  const [loadingVersions, setLoadingVersions] = useState(false)

  const fetchSubmissions = () => {
    fetch("/api/submissions?latestOnly=true")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { if (Array.isArray(data)) setSubmissions(data) })
      .catch(() => {})
      .finally(() => setLoadingSubmissions(false))
  }

  useEffect(() => { fetchSubmissions() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim() || !title.trim()) {
      toast.error("Please provide a title and a document URL")
      return
    }
    try { new URL(url.trim()) } catch {
      toast.error("Please enter a valid URL (e.g. https://...)"); return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: currentStage, title: title.trim(),
          description: description.trim() || null,
          fileUrl: new URL(url.trim()).href, fileType: "url",
        }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error ?? "Failed") }
      const newSub = await res.json()
      setSubmissions((prev) => [newSub, ...prev])
      setTitle(""); setDescription(""); setUrl("")
      toast.success("Submission saved")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed")
    } finally { setSubmitting(false) }
  }

  async function handleRevision(parentId: string) {
    if (!revisionUrl.trim()) { toast.error("URL is required"); return }
    try { new URL(revisionUrl.trim()) } catch {
      toast.error("Invalid URL"); return
    }
    setSubmittingRevision(true)
    try {
      const res = await fetch(`/api/submissions/${parentId}/revise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: new URL(revisionUrl.trim()).href, fileType: "url",
          title: revisionTitle.trim() || undefined,
          changelog: revisionChangelog.trim() || null,
        }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error ?? "Failed") }
      toast.success("Revision uploaded")
      setRevisingId(null); setRevisionUrl(""); setRevisionChangelog(""); setRevisionTitle("")
      fetchSubmissions()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed")
    } finally { setSubmittingRevision(false) }
  }

  async function handleSubmitForReview(id: string) {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "UNDER_REVIEW" }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      toast.success("Submitted for review")
      fetchSubmissions()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed")
    }
  }

  async function loadVersionHistory(id: string) {
    setHistoryId(id)
    setLoadingVersions(true)
    try {
      const res = await fetch(`/api/submissions/${id}/versions`)
      if (res.ok) { const data = await res.json(); setVersions(data) }
    } catch {} finally { setLoadingVersions(false) }
  }

  const stageSubmissions = submissions.filter((s) => s.stage === currentStage)

  const projectGroups = stageSubmissions.reduce<Record<string, SubmissionData[]>>((acc, sub) => {
    const key = sub.project?.id ?? "__unlinked__"
    if (!acc[key]) acc[key] = []
    acc[key].push(sub)
    return acc
  }, {})

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <GlassCard className="p-6" intensity="light">
        <div className="mb-5 flex items-center gap-2">
          <Link2 size={18} className="text-primary" />
          <h2 className="text-lg font-semibold">Research Outputs & Submissions</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Title (e.g. Load Distribution Optimisation)" value={title} onChange={(e) => setTitle(e.target.value)} disabled={submitting} />
          <Textarea placeholder="Description or notes (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} disabled={submitting} />
          <Input type="url" placeholder="Paste document or video URL" value={url} onChange={(e) => setUrl(e.target.value)} disabled={submitting} />
          <p className="text-[10px] text-muted-foreground/60">Paste a link to Google Drive, YouTube, Dropbox, OneDrive, or any public URL</p>
          <Button type="submit" className="w-full gap-1.5" disabled={submitting || !url.trim() || !title.trim()}>
            {submitting ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Saving...</> : <><Link2 size={14} /> New Submission</>}
          </Button>
        </form>

        <div className="mt-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText size={16} />
            Your Research Outputs
            {stageSubmissions.length > 0 && <span className="text-xs text-muted-foreground">({stageSubmissions.length})</span>}
          </div>

          {loadingSubmissions ? (
            <div className="flex justify-center py-4"><div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
          ) : stageSubmissions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-muted-foreground/20 py-8 text-center">
              <AlertCircle size={20} className="text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground/60">No submissions yet for this stage</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(projectGroups).map(([projectId, subs]) => (
                <div key={projectId}>
                  {projectId !== "__unlinked__" && subs[0]?.project && (
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-1 w-4 rounded-full bg-primary" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{subs[0].project.title}</p>
                    </div>
                  )}
                  {projectId === "__unlinked__" && stageSubmissions.length > subs.length && (
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-1 w-4 rounded-full bg-muted-foreground/30" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">General</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    {subs.map((sub) => (
                      <div key={sub.id} className="rounded-xl border border-border">
                        <div className="flex items-center justify-between p-3">
                          <a href={sub.fileUrl.startsWith("data:") ? `/api/submissions/download?id=${sub.id}` : sub.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 min-w-0 flex-1">
                            <div className="mt-0.5 shrink-0">
                              {sub.status === "APPROVED" || sub.status === "PUBLISHED" ? <CheckCircle2 size={16} className="text-green-500" /> : sub.status === "UNDER_REVIEW" ? <Clock size={16} className="text-blue-500" /> : sub.status === "REVISION" ? <GitBranch size={16} className="text-amber-500" /> : <FileText size={16} className="text-muted-foreground" />}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium truncate">{sub.title}</p>
                                <Badge variant="outline" className={`text-[10px] shrink-0 ${STATUS_CONFIG[sub.status]?.class ?? ""}`}>{STATUS_CONFIG[sub.status]?.label ?? sub.status}</Badge>
                                {sub.version > 1 && <Badge variant="outline" className="text-[10px] shrink-0">v{sub.version}</Badge>}
                              </div>
                              {sub.description && <p className="text-xs text-muted-foreground truncate">{sub.description}</p>}
                              <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground/60">
                                <span>{getUrlType(sub.fileUrl)}</span><span>&middot;</span>
                                <Clock size={10} /><span>{formatDate(sub.createdAt)}</span>
                              </div>
                            </div>
                            <ExternalLink size={14} className="shrink-0 text-muted-foreground" />
                          </a>
                          <div className="flex items-center gap-1 ml-2 shrink-0">
                            {(sub.status === "DRAFT" || sub.status === "REVISION") && (
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSubmitForReview(sub.id)} title="Submit for Review">
                                <Send size={13} />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setRevisingId(revisingId === sub.id ? null : sub.id)} title="Upload Revision">
                              <GitBranch size={13} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => loadVersionHistory(sub.id)} title="Version History">
                              <History size={13} />
                            </Button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {revisingId === sub.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border">
                              <div className="p-3 bg-muted/20 space-y-3">
                                <p className="text-xs font-medium text-muted-foreground">Upload Revision for &ldquo;{sub.title}&rdquo;</p>
                                <Input placeholder="New title (optional — keeps current title if blank)" value={revisionTitle} onChange={(e) => setRevisionTitle(e.target.value)} className="text-xs" />
                                <Input type="url" placeholder="Paste new document URL" value={revisionUrl} onChange={(e) => setRevisionUrl(e.target.value)} className="text-xs" />
                                <Textarea placeholder="Changelog — what changed in this revision?" value={revisionChangelog} onChange={(e) => setRevisionChangelog(e.target.value)} rows={2} className="text-xs" />
                                <div className="flex gap-2">
                                  <Button size="sm" className="gap-1.5" disabled={submittingRevision || !revisionUrl.trim()} onClick={() => handleRevision(sub.id)}>
                                    {submittingRevision ? "Uploading..." : "Upload Revision"}
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => { setRevisingId(null); setRevisionUrl(""); setRevisionChangelog(""); setRevisionTitle("") }}>Cancel</Button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {historyId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setHistoryId(null)}>
              <div className="mx-4 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Version History</h3>
                  <button onClick={() => setHistoryId(null)} className="rounded-full p-1 hover:bg-gray-100"><X size={16} /></button>
                </div>
                {loadingVersions ? (
                  <div className="flex justify-center py-8"><div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
                ) : versions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No version history available</p>
                ) : (
                  <div className="space-y-3">
                    {versions.map((v, i) => (
                      <div key={v.id} className={`flex items-start gap-3 rounded-lg border p-3 ${v.isLatest ? "border-primary/30 bg-primary/5" : "border-border"}`}>
                        <div className="flex flex-col items-center">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${v.isLatest ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>V{v.version}</div>
                          {i < versions.length - 1 && <div className="mt-1 h-6 w-px bg-border" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{v.title}</p>
                            <Badge variant="outline" className={`text-[10px] ${STATUS_CONFIG[v.status]?.class ?? ""}`}>{STATUS_CONFIG[v.status]?.label ?? v.status}</Badge>
                            {v.isLatest && <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">Current</Badge>}
                          </div>
                          {v.changelog && <p className="mt-1 text-xs text-muted-foreground">{v.changelog}</p>}
                          <p className="mt-1 text-[10px] text-muted-foreground/60">{formatDate(v.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  )
}
