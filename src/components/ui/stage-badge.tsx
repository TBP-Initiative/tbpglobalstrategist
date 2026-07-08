import { cn } from "@/lib/utils"

const stageColors: Record<string, string> = {
  CANDIDATE: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  STRATEGIST: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
  CONTRIBUTOR: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  PROJECT_ALIGNED: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  SECTOR_LEAD: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  PAID_ADVISER: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
}

const stageLabels: Record<string, string> = {
  CANDIDATE: "Candidate",
  STRATEGIST: "Strategist",
  CONTRIBUTOR: "Contributor",
  PROJECT_ALIGNED: "Aligned",
  SECTOR_LEAD: "Lead",
  PAID_ADVISER: "Adviser",
}

export function StageBadge({ stage, className }: { stage: string; className?: string }) {
  return (
    <span className={cn("text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-medium", stageColors[stage] ?? "", className)}>
      {stageLabels[stage] ?? stage}
    </span>
  )
}
