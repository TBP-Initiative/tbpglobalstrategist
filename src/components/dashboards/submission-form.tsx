"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Link2, FileText, CheckCircle2, ExternalLink, Clock, AlertCircle } from "lucide-react"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

type Submission = {
  id: string
  stage: string
  title: string
  description: string | null
  fileUrl: string
  fileType: string
  fileSize: number | null
  createdAt: string
}

export function SubmissionForm({ currentStage }: { currentStage: string }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(true)

  useEffect(() => {
    fetch("/api/submissions")
      .then((res) => {
        if (!res.ok) return []
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) setSubmissions(data)
      })
      .catch(() => {})
      .finally(() => setLoadingSubmissions(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim() || !title.trim()) {
      toast.error("Please provide a title and a document URL")
      return
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(url.trim())
    } catch {
      toast.error("Please enter a valid URL (e.g. https://...)")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: currentStage,
          title: title.trim(),
          description: description.trim() || null,
          fileUrl: parsedUrl.href,
          fileType: "url",
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message ?? "Failed to save submission")
      }

      const newSubmission = await res.json()
      setSubmissions((prev) => [newSubmission, ...prev])
      setTitle("")
      setDescription("")
      setUrl("")
      toast.success("Submission saved successfully")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  const stageSubmissions = submissions.filter((s) => s.stage === currentStage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <GlassCard className="p-6" intensity="light">
        <div className="mb-5 flex items-center gap-2">
          <Link2 size={18} className="text-primary" />
          <h2 className="text-lg font-semibold">Submit Report / Task Feedback</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title (e.g. Onboarding Reflection)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />
          <Textarea
            placeholder="Description or notes (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            disabled={submitting}
          />
          <Input
            type="url"
            placeholder="Paste document or video URL (Google Drive, YouTube, etc.)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={submitting}
          />
          <p className="text-[10px] text-muted-foreground/60">
            Paste a link to Google Drive, YouTube, Dropbox, OneDrive, or any public URL
          </p>

          <Button type="submit" className="w-full gap-1.5" disabled={submitting || !url.trim() || !title.trim()}>
            {submitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Link2 size={14} />
                Submit
              </>
            )}
          </Button>
        </form>

        <div className="mt-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText size={16} />
            Your Submissions for Current Stage
            {stageSubmissions.length > 0 && (
              <span className="text-xs text-muted-foreground">({stageSubmissions.length})</span>
            )}
          </div>

          {loadingSubmissions ? (
            <div className="flex justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : stageSubmissions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-muted-foreground/20 py-8 text-center">
              <AlertCircle size={20} className="text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground/60">No submissions yet for this stage</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stageSubmissions.map((sub) => (
                <a
                  key={sub.id}
                  href={sub.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      <CheckCircle2 size={16} className="text-green-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{sub.title}</p>
                      {sub.description && (
                        <p className="text-xs text-muted-foreground truncate">{sub.description}</p>
                      )}
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground/60">
                        <span>{getUrlType(sub.fileUrl)}</span>
                        <span>&middot;</span>
                        <Clock size={10} className="shrink-0" />
                        <span>{formatDate(sub.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <ExternalLink size={14} className="shrink-0 text-muted-foreground" />
                </a>
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}
