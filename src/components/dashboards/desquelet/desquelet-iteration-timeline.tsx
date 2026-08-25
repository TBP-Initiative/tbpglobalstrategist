"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { DESQUELET_STAGE_MAP, type DesqueletStageKey } from "@/lib/desquelet-prompts"
import { GitBranch, ArrowRight } from "lucide-react"

interface Iteration {
  id: string
  fromStage: string
  toStage: string
  reason: string
  createdAt: string
}

interface DesqueletIterationTimelineProps {
  iterations: Iteration[]
  className?: string
}

export function DesqueletIterationTimeline({
  iterations,
  className,
}: DesqueletIterationTimelineProps) {
  if (iterations.length === 0) {
    return (
      <GlassCard className={className} intensity="light">
        <div className="p-4 text-center">
          <GitBranch size={24} className="mx-auto text-white/30 mb-2" />
          <p className="text-sm text-white/40">No iterations recorded yet</p>
          <p className="text-xs text-white/30 mt-1">
            Return to a previous stage to create an iteration link
          </p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className={className} intensity="light">
      <div className="p-4">
        <h4 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
          <GitBranch size={14} />
          Iteration History
        </h4>
        <div className="space-y-3">
          {iterations.map((iteration, index) => {
            const fromConfig = DESQUELET_STAGE_MAP[iteration.fromStage as DesqueletStageKey]
            const toConfig = DESQUELET_STAGE_MAP[iteration.toStage as DesqueletStageKey]

            return (
              <motion.div
                key={iteration.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-bold">
                    {fromConfig?.letter || iteration.fromStage}
                  </span>
                  <ArrowRight size={14} className="text-white/40" />
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-bold">
                    {toConfig?.letter || iteration.toStage}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80">{iteration.reason}</p>
                  <p className="text-xs text-white/40 mt-1">
                    {fromConfig?.name} → {toConfig?.name}
                  </p>
                </div>
                <span className="text-xs text-white/40">
                  {new Date(iteration.createdAt).toLocaleDateString()}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </GlassCard>
  )
}
