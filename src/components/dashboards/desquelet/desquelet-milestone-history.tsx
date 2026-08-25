"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { History, Plus, Tag } from "lucide-react"

interface Milestone {
  id: string
  version: number
  label: string
  reason: string | null
  createdAt: string
}

interface DesqueletMilestoneHistoryProps {
  recordId: string
  currentRevision: number
  milestones: Milestone[]
  onMilestoneCreated: (milestone: Milestone, newRevision: number) => void
}

export function DesqueletMilestoneHistory({
  recordId,
  currentRevision,
  milestones,
  onMilestoneCreated,
}: DesqueletMilestoneHistoryProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [label, setLabel] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = async () => {
    if (!label.trim()) {
      toast.error("Please enter a label for this milestone")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/desquelet/records/${recordId}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, reason: reason || null }),
      })

      if (!res.ok) throw new Error("Failed to create milestone")

      const data = await res.json()
      onMilestoneCreated(data.milestone, data.record.currentRevision)
      setLabel("")
      setReason("")
      setIsCreating(false)
      toast.success("Milestone created")
    } catch (err) {
      toast.error("Failed to create milestone")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <GlassCard intensity="light">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <History size={14} />
            Milestone Versions
          </h4>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-gray-500">
              V{currentRevision}
            </Badge>
            {!isCreating && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreating(true)}
                className="border-gray-200 text-gray-600 hover:text-gray-900"
              >
                <Plus size={14} className="mr-1" />
                Create Milestone
              </Button>
            )}
          </div>
        </div>

        {isCreating && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2"
          >
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Milestone label (e.g., 'Post-Simulation Revision')"
              className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
            />
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for this milestone (optional)"
              className="min-h-[60px] bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreating(false)}
                className="border-gray-200 text-gray-600"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={isSubmitting || !label.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          {milestones.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">
              No milestones created yet
            </p>
          )}
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 text-amber-600">
                <Tag size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    V{milestone.version}
                  </span>
                  <span className="text-sm text-gray-500">{milestone.label}</span>
                </div>
                {milestone.reason && (
                  <p className="text-xs text-gray-400 mt-1">{milestone.reason}</p>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {new Date(milestone.createdAt).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
