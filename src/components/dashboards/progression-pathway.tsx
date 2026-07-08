"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"
import { getPathwayForStage, stageOrder } from "@/lib/progression-pathway"
import { cn } from "@/lib/utils"
import { ArrowUp, CheckCircle2, FileText, Target, TrendingUp } from "lucide-react"

const stageColors: Record<string, string> = {
  CANDIDATE: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  STRATEGIST: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
  CONTRIBUTOR: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  PROJECT_ALIGNED: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  SECTOR_LEAD: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  PAID_ADVISER: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
}

export function ProgressionPathway({ currentStage }: { currentStage: string }) {
  const info = getPathwayForStage(currentStage)
  if (!info) return null

  const currentIndex = stageOrder.indexOf(currentStage as any)
  const isLast = currentIndex === stageOrder.length - 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="p-6" intensity="light">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            <h2 className="text-lg font-semibold">Progression Pathway</h2>
          </div>
          <Badge className={cn("text-[11px] uppercase tracking-wider px-3 py-1", stageColors[currentStage])}>
            {info.title}
          </Badge>
        </div>

        <div className="mb-5">
          <p className="text-sm text-muted-foreground">{info.summary}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Target size={16} className="text-primary" />
              Focus
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{info.focus}</p>

            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CheckCircle2 size={16} className="text-green-500" />
              Actions & Tasks
            </div>
            <ul className="space-y-1.5">
              {info.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  {task}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText size={16} className="text-amber-500" />
              Typical Outputs
            </div>
            <ul className="space-y-1.5">
              {info.typicalOutputs.map((output, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/60" />
                  {output}
                </li>
              ))}
            </ul>

            {info.nextStage && !isLast && (
              <div className="mt-6 rounded-xl border border-dashed border-primary/20 bg-primary/[0.02] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <ArrowUp size={16} className="text-primary" />
                  To progress to{" "}
                  <span className="font-semibold text-primary">
                    Stage {currentIndex + 2} — {info.nextStage.name.replace(/_/g, " ")}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {info.nextStage.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
