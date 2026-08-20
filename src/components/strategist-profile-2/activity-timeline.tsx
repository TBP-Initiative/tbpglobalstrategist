"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Trophy, GitBranch, Users, Clock, ExternalLink, ChevronDown, ChevronUp, History, Folder } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  title: string
  description: string
  date: string
  type: "publication" | "milestone" | "contribution" | "assignment"
  fileUrl?: string
  fileType?: string
  fileSize?: number | null
  version?: number
  status?: string
  changelog?: string | null
  projectId?: string | null
  projectTitle?: string | null
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
}

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  DRAFT: { label: "Draft", class: "bg-gray-100 text-gray-600" },
  UNDER_REVIEW: { label: "Under Review", class: "bg-blue-100 text-blue-700" },
  REVISION: { label: "Revision", class: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "Approved", class: "bg-green-100 text-green-700" },
  PUBLISHED: { label: "Published", class: "bg-purple-100 text-purple-700" },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null)

  if (activities.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Activity & Contributions</h2>
        <p className="text-sm text-gray-400">No activity yet.</p>
      </section>
    )
  }

  const grouped = activities.reduce<Record<string, ActivityItem[]>>((acc, item) => {
    const key = item.projectId ?? "__general__"
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  const projectEntries = Object.entries(grouped).filter(([k]) => k !== "__general__")
  const generalEntries = grouped["__general__"] ?? []

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Activity & Contributions</h2>

      <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="space-y-8">
        {projectEntries.map(([projectId, items]) => {
          const projectTitle = items[0].projectTitle ?? "Project"
          return (
            <motion.div key={projectId} variants={itemVariants} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Folder size={16} className="text-primary" />
                <h3 className="text-base font-bold text-gray-900">{projectTitle}</h3>
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Research & Technical Contributions</p>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <ContributionCard key={item.id} item={item} index={idx} expandedHistory={expandedHistory} setExpandedHistory={setExpandedHistory} />
                ))}
              </div>
            </motion.div>
          )
        })}

        {generalEntries.length > 0 && (
          <motion.div variants={itemVariants}>
            {projectEntries.length > 0 && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Other Contributions</p>
            )}
            <div className="space-y-3">
              {generalEntries.map((item, idx) => (
                <ContributionCard key={item.id} item={item} index={idx} expandedHistory={expandedHistory} setExpandedHistory={setExpandedHistory} />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

function ContributionCard({
  item, index, expandedHistory, setExpandedHistory,
}: {
  item: ActivityItem
  index: number
  expandedHistory: string | null
  setExpandedHistory: (id: string | null) => void
}) {
  const statusCfg = item.status ? STATUS_CONFIG[item.status] : null
  const isExpanded = expandedHistory === item.id

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-400">{String(index + 1).padStart(2, "0")} —</span>
            <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
            {item.version && item.version > 1 && (
              <Badge variant="outline" className="text-[10px]">v{item.version}</Badge>
            )}
            {statusCfg && (
              <Badge className={cn("text-[10px]", statusCfg.class)}>{statusCfg.label}</Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Current: {item.version ? `Revision ${item.version}` : "Initial Submission"}
          </p>
          {item.changelog && (
            <p className="text-xs text-gray-400 mt-1 italic">&ldquo;{item.changelog}&rdquo;</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Clock size={10} className="text-gray-400" />
            <span className="text-[10px] text-gray-400">
              {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {item.fileUrl && (
            <a
              href={item.fileUrl.startsWith("data:") ? `/api/submissions/download?id=${item.id}` : item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <ExternalLink size={11} />
              View
            </a>
          )}
        </div>
      </div>

      {item.version && item.version > 1 && (
        <button
          onClick={() => setExpandedHistory(isExpanded ? null : item.id)}
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <History size={11} />
          {isExpanded ? "Hide" : "View"} Version History
          {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 space-y-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Research Development Record</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Initial Submission</span>
                <span className="text-gray-300">&rarr;</span>
                <span>{item.version} revision{item.version! > 2 ? "s" : ""}</span>
                <span className="text-gray-300">&rarr;</span>
                <span className={cn("font-medium", statusCfg?.class)}>{statusCfg?.label ?? "Current"}</span>
              </div>
              {item.changelog && (
                <div className="mt-2 rounded-md bg-gray-50 p-2">
                  <p className="text-[10px] font-medium text-gray-500">Latest changelog:</p>
                  <p className="text-xs text-gray-600">{item.changelog}</p>
                </div>
              )}
              <p className="text-[10px] text-gray-400 italic">
                Research Progression Evidence — This work was developed through multiple research and technical-review stages. Earlier versions are retained within the strategist&apos;s verified development record.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
