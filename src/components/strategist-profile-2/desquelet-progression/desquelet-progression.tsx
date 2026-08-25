"use client"

import { Layers } from "lucide-react"
import { cn } from "@/lib/utils"

interface DesqueletStage {
  letter: string
  name: string
  status: "completed" | "in_progress" | "pending"
}

interface DesqueletWorkstream {
  id: string
  title: string
  project: { id: string; title: string; slug: string } | null
  stages: DesqueletStage[]
  overallProgress: number
  currentRevision: number
  lastUpdated: string
}

interface DesqueletSummary {
  totalWorkstreams: number
  stagesCompleted: number
  overallProgress: number
}

export function DesqueletProgression({
  records,
  summary,
}: {
  records: DesqueletWorkstream[]
  summary: DesqueletSummary
}) {
  if (!records || records.length === 0) return null

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
          <Layers className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">DESQUELET Progression</h3>
          <p className="text-sm text-gray-500">
            {summary.stagesCompleted}/27 stages completed across {summary.totalWorkstreams} workstream{summary.totalWorkstreams !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="mb-5">
        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
            style={{ width: `${summary.overallProgress}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-400 text-right">{summary.overallProgress}% overall</p>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900 text-sm">{record.title}</p>
                {record.project && (
                  <p className="text-xs text-gray-500">{record.project.title}</p>
                )}
              </div>
              <span className="text-xs font-medium text-indigo-600">{record.overallProgress}%</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {record.stages.map((stage) => (
                <div
                  key={stage.letter}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                    stage.status === "completed" && "bg-green-50 text-green-700",
                    stage.status === "in_progress" && "bg-amber-50 text-amber-700",
                    stage.status === "pending" && "bg-gray-50 text-gray-400"
                  )}
                >
                  <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold",
                    stage.status === "completed" && "bg-green-100 text-green-600",
                    stage.status === "in_progress" && "bg-amber-100 text-amber-600",
                    stage.status === "pending" && "bg-gray-100 text-gray-400"
                  )}>
                    {stage.letter}
                  </span>
                  <span className="truncate">{stage.name}</span>
                </div>
              ))}
            </div>

            <p className="mt-2 text-[10px] text-gray-400">
              Revision {record.currentRevision} · Last updated {new Date(record.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
