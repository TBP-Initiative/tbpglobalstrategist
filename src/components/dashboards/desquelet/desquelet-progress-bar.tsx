"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { DESQUELET_STAGE_MAP, DESQUELET_STAGE_ORDER, type DesqueletStageKey } from "@/lib/desquelet-prompts"

interface StageProgress {
  key: DesqueletStageKey
  percentage: number
  status: "completed" | "in_progress" | "not_started"
}

interface DesqueletProgressBarProps {
  stages: StageProgress[]
  overallProgress: number
  compact?: boolean
  className?: string
}

function getStatusColor(status: StageProgress["status"]): string {
  if (status === "completed") return "bg-green-500 text-white"
  if (status === "in_progress") return "bg-blue-500 text-white"
  return "bg-gray-100 text-gray-400 border border-gray-200"
}

function getStatusIcon(status: StageProgress["status"]): string {
  if (status === "completed") return "✓"
  if (status === "in_progress") return "◐"
  return "○"
}

export function DesqueletProgressBar({
  stages,
  overallProgress,
  compact = false,
  className,
}: DesqueletProgressBarProps) {
  const stageMap = new Map(stages.map((s) => [s.key, s]))

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">
          DESQUELET Application Progress
        </span>
        <span className="text-sm font-bold text-gray-900">{overallProgress}%</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${overallProgress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className={cn(
        "flex items-center",
        compact ? "gap-2" : "gap-3"
      )}>
        {DESQUELET_STAGE_ORDER.map((key) => {
          const stage = stageMap.get(key)
          const config = DESQUELET_STAGE_MAP[key]
          const status = stage?.status || "not_started"

          return (
            <motion.div
              key={key}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: DESQUELET_STAGE_ORDER.indexOf(key) * 0.05 }}
              className={cn(
                "flex items-center justify-center rounded-full font-bold transition-all",
                compact ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm",
                getStatusColor(status)
              )}
              title={`${config.name} — ${stage?.percentage || 0}%`}
            >
              {getStatusIcon(status)}
            </motion.div>
          )
        })}
      </div>

      {!compact && (
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {DESQUELET_STAGE_ORDER.map((key) => {
            const config = DESQUELET_STAGE_MAP[key]
            return (
              <div key={key} className="flex-1 text-center">
                {config.letter}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
