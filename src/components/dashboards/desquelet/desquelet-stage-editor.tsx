"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { DESQUELET_STAGE_MAP, type DesqueletStageKey } from "@/lib/desquelet-prompts"
import { Save, Link2, Plus, X, Send, RotateCcw } from "lucide-react"

interface StageEditorProps {
  recordId: string
  stage: DesqueletStageKey
  content: {
    response?: string
    links?: { label: string; url: string }[]
    notes?: string
  }
  percentage: number
  onContentChange: (stage: DesqueletStageKey, content: Record<string, unknown>, percentage: number) => void
  onSubmitForReview: (stage: DesqueletStageKey) => void
  onReturnToStage: (fromStage: DesqueletStageKey) => void
  isSubmitting?: boolean
}

export function DesqueletStageEditor({
  recordId,
  stage,
  content,
  percentage,
  onContentChange,
  onSubmitForReview,
  onReturnToStage,
  isSubmitting = false,
}: StageEditorProps) {
  const config = DESQUELET_STAGE_MAP[stage]
  const [response, setResponse] = useState(content.response || "")
  const [notes, setNotes] = useState(content.notes || "")
  const [links, setLinks] = useState<{ label: string; url: string }[]>(content.links || [])
  const [newLinkLabel, setNewLinkLabel] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    setResponse(content.response || "")
    setNotes(content.notes || "")
    setLinks(content.links || [])
  }, [content])

  const saveStageContent = useCallback(async (newContent: Record<string, unknown>, newPercentage: number) => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/desquelet/records/${recordId}/stages/${stage}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent, percentageComplete: newPercentage }),
      })

      if (!res.ok) throw new Error("Failed to save")

      const data = await res.json()
      setLastSaved(new Date())
      onContentChange(stage, newContent, newPercentage)
      return data
    } catch (err) {
      toast.error("Failed to save changes")
      return null
    } finally {
      setIsSaving(false)
    }
  }, [recordId, stage, onContentChange])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const hasContent = response.trim().length > 0
      const newPercentage = hasContent ? Math.min(100, Math.max(25, Math.round((response.length / 200) * 100))) : 0
      saveStageContent({ response, notes, links }, newPercentage)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [response, notes, links])

  const addLink = () => {
    if (!newLinkUrl.trim()) return
    const newLinks = [...links, { label: newLinkLabel || newLinkUrl, url: newLinkUrl }]
    setLinks(newLinks)
    setNewLinkLabel("")
    setNewLinkUrl("")
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="p-6" intensity="medium">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <span className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl text-lg font-bold",
                percentage >= 100 ? "bg-green-100 text-green-600" :
                percentage > 0 ? "bg-blue-100 text-blue-600" :
                "bg-gray-100 text-gray-400"
              )}>
                {config.letter}
              </span>
              {config.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{config.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-gray-500">
              {percentage}% complete
            </Badge>
            {lastSaved && (
              <span className="text-xs text-gray-400">
                {isSaving ? "Saving..." : `Saved ${lastSaved.toLocaleTimeString()}`}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Your Response
            </label>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder={`Describe your work on ${config.name}...`}
              className="min-h-[200px] bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Additional Notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes, observations, or context..."
              className="min-h-[100px] bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              <Link2 size={14} />
              References & Links
            </label>
            <div className="space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="flex-1 text-sm text-gray-700 truncate">{link.label}</span>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-xs">
                    Open
                  </a>
                  <button onClick={() => removeLink(index)} className="text-red-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newLinkLabel}
                  onChange={(e) => setNewLinkLabel(e.target.value)}
                  placeholder="Label"
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                />
                <Input
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="URL"
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLink}
                  className="border-gray-200 text-gray-600 hover:text-gray-900"
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReturnToStage(stage)}
              className="border-gray-200 text-gray-600 hover:text-gray-900"
            >
              <RotateCcw size={14} className="mr-1" />
              Return to Previous Stage
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveStageContent({ response, notes, links }, percentage)}
              disabled={isSaving}
              className="border-gray-200 text-gray-600 hover:text-gray-900"
            >
              <Save size={14} className="mr-1" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              size="sm"
              onClick={() => onSubmitForReview(stage)}
              disabled={isSubmitting || percentage < 50}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Send size={14} className="mr-1" />
              Submit for Review
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
