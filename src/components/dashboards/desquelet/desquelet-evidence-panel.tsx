"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Upload, FileText, Film, Image, Link2, X, Trash2, ExternalLink } from "lucide-react"

interface Evidence {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number | null
  description: string | null
  category: string | null
  createdAt: string
}

interface DesqueletEvidencePanelProps {
  recordId: string
  stage: string
  evidence: Evidence[]
  onEvidenceChange: (evidence: Evidence[]) => void
  readOnly?: boolean
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return <Image size={16} />
  if (fileType.startsWith("video/")) return <Film size={16} />
  if (fileType.includes("pdf")) return <FileText size={16} />
  return <Link2 size={16} />
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DesqueletEvidencePanel({
  recordId,
  stage,
  evidence,
  onEvidenceChange,
  readOnly = false,
}: DesqueletEvidencePanelProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadUrl, setUploadUrl] = useState("")
  const [uploadName, setUploadName] = useState("")
  const [uploadDescription, setUploadDescription] = useState("")
  const [uploadCategory, setUploadCategory] = useState("")

  const handleUpload = async () => {
    if (!uploadUrl.trim() || !uploadName.trim()) {
      toast.error("Please provide a file name and URL")
      return
    }

    setIsUploading(true)
    try {
      const res = await fetch(`/api/desquelet/records/${recordId}/stages/${stage}/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: uploadName,
          fileUrl: uploadUrl,
          fileType: "link",
          description: uploadDescription || null,
          category: uploadCategory || null,
        }),
      })

      if (!res.ok) throw new Error("Upload failed")

      const newEvidence = await res.json()
      onEvidenceChange([newEvidence, ...evidence])
      setUploadUrl("")
      setUploadName("")
      setUploadDescription("")
      setUploadCategory("")
      setShowUpload(false)
      toast.success("Evidence added")
    } catch (err) {
      toast.error("Failed to add evidence")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (evidenceId: string) => {
    try {
      const res = await fetch(
        `/api/desquelet/records/${recordId}/stages/${stage}/evidence?evidenceId=${evidenceId}`,
        { method: "DELETE" }
      )

      if (!res.ok) throw new Error("Delete failed")

      onEvidenceChange(evidence.filter((e) => e.id !== evidenceId))
      toast.success("Evidence removed")
    } catch (err) {
      toast.error("Failed to remove evidence")
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Evidence</h4>
        {!readOnly && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUpload(!showUpload)}
            className="border-gray-200 text-gray-600 hover:text-gray-900"
          >
            <Upload size={14} className="mr-1" />
            Add Evidence
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
              <Input
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder="File name"
                className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
              <Input
                value={uploadUrl}
                onChange={(e) => setUploadUrl(e.target.value)}
                placeholder="File URL (Google Drive, Dropbox, etc.)"
                className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
              <Input
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Description (optional)"
                className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
              <Input
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                placeholder="Category (e.g., simulation, paper, diagram)"
                className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUpload(false)}
                  className="border-gray-200 text-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isUploading ? "Adding..." : "Add"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {evidence.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            No evidence attached yet
          </p>
        )}
        {evidence.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-100 text-gray-500">
              {getFileIcon(item.fileType)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 truncate">{item.fileName}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {item.fileSize && <span>{formatFileSize(item.fileSize)}</span>}
                {item.category && <Badge variant="outline" className="text-[10px] py-0">{item.category}</Badge>}
              </div>
            </div>
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink size={14} />
            </a>
            {!readOnly && (
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
