"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DesqueletProgressBar } from "./desquelet-progress-bar"
import { DESQUELET_STAGE_ORDER, DESQUELET_STAGE_MAP, type DesqueletStageKey } from "@/lib/desquelet-prompts"
import { Calendar, GitBranch, Tag, ArrowRight } from "lucide-react"
import Link from "next/link"

interface RecordData {
  id: string
  title: string
  currentRevision: number
  overallProgress: number
  completedStages: number
  totalStages: number
  iterations: number
  milestones: number
  lastUpdated: string
  createdAt: string
  project?: { id: string; title: string; slug: string } | null
}

interface DesqueletRecordCardProps {
  record: RecordData
  index?: number
}

export function DesqueletRecordCard({ record, index = 0 }: DesqueletRecordCardProps) {
  const stages = DESQUELET_STAGE_ORDER.map((key) => {
    const config = DESQUELET_STAGE_MAP[key]
    const isCompleted = record.completedStages >= DESQUELET_STAGE_ORDER.indexOf(key) + 1
    const percentage = isCompleted ? 100 : record.overallProgress > 0 ? Math.min(50, record.overallProgress) : 0
    return {
      key,
      percentage,
      status: (isCompleted ? "completed" : percentage > 0 ? "in_progress" : "not_started") as "completed" | "in_progress" | "not_started",
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={`/dashboard/desquelet/${record.id}`}>
        <GlassCard className="p-5 hover:border-indigo-500/30 transition-all cursor-pointer" hover intensity="light">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{record.title}</h3>
              {record.project && (
                <p className="text-sm text-white/50 mt-1">{record.project.title}</p>
              )}
            </div>
            <Badge variant="outline" className="text-white/60">
              V{record.currentRevision}
            </Badge>
          </div>

          <DesqueletProgressBar
            stages={stages}
            overallProgress={record.overallProgress}
            compact
          />

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(record.lastUpdated).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <GitBranch size={12} />
                {record.iterations} iterations
              </span>
              <span className="flex items-center gap-1">
                <Tag size={12} />
                {record.milestones} milestones
              </span>
            </div>
            <ArrowRight size={16} className="text-white/40" />
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  )
}
