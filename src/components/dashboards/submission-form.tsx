"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Upload, FileText, X, CheckCircle2, Download, Clock, AlertCircle } from "lucide-react"

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "video/mp4",
  "video/mpeg",
]

const typeLabels: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  "application/vnd.ms-powerpoint": "PPT",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/vnd.ms-excel": "XLS",
  "text/csv": "CSV",
  "video/mp4": "MP4",
  "video/mpeg": "MPEG",
}

function getFileTypeLabel(mime: string) {
  return typeLabels[mime] ?? mime.split("/").pop()?.toUpperCase() ?? "FILE"
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
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
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(true)

  useEffect(() => {
    fetch("/api/submissions")
      .then((res) => res.json())
      .then(setSubmissions)
      .catch(() => {})
      .finally(() => setLoadingSubmissions(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !title.trim()) {
      toast.error("Please provide a title and select a file")
      return
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("File type not supported. Please upload PDF, DOCX, PPTX, XLSX, CSV, MP4, or MPEG.")
      return
    }

    if (file.size > 4.5 * 1024 * 1024) {
      toast.error("File size must be under 4.5MB.")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("filename", title.trim())

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        throw new Error(err.message ?? "Upload failed")
      }

      const { url } = await uploadRes.json()

      const subRes = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: currentStage,
          title: title.trim(),
          description: description.trim() || null,
          fileUrl: url,
          fileType: file.type,
          fileSize: file.size,
        }),
      })

      if (!subRes.ok) {
        const err = await subRes.json()
        throw new Error(err.message ?? "Failed to save submission")
      }

      const newSubmission = await subRes.json()
      setSubmissions((prev) => [newSubmission, ...prev])
      setTitle("")
      setDescription("")
      setFile(null)
      toast.success("Submission uploaded successfully")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed")
    } finally {
      setUploading(false)
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
          <Upload size={18} className="text-primary" />
          <h2 className="text-lg font-semibold">Submit Report / Task Feedback</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title (e.g. Onboarding Reflection)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploading}
          />
          <Textarea
            placeholder="Description or notes (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            disabled={uploading}
          />

          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors",
              file
                ? "border-primary/40 bg-primary/[0.02]"
                : "border-muted-foreground/20 hover:border-muted-foreground/40"
            )}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const dropped = e.dataTransfer.files[0]
              if (dropped) setFile(dropped)
            }}
          >
            {file ? (
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getFileTypeLabel(file.type)} &middot; {formatSize(file.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setFile(null)}
                  disabled={uploading}
                >
                  <X size={14} />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={24} className="text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">
                  Drop a file here, or{" "}
                  <label className="cursor-pointer font-medium text-primary hover:underline">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept={ALLOWED_TYPES.join(",")}
                      onChange={(e) => {
                        const selected = e.target.files?.[0]
                        if (selected) setFile(selected)
                      }}
                      disabled={uploading}
                    />
                  </label>
                </p>
                <p className="text-[10px] text-muted-foreground/60">
                  PDF, DOCX, PPTX, XLSX, CSV, MP4, MPEG &middot; Max 4.5MB
                </p>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full gap-1.5" disabled={uploading || !file || !title.trim()}>
            {uploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={14} />
                Submit Report
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
                <div
                  key={sub.id}
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
                        <span>{getFileTypeLabel(sub.fileType)}</span>
                        {sub.fileSize && <span>&middot; {formatSize(sub.fileSize)}</span>}
                        <span>&middot;</span>
                        <Clock size={10} className="shrink-0" />
                        <span>{formatDate(sub.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7" asChild>
                    <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" download>
                      <Download size={14} />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}
