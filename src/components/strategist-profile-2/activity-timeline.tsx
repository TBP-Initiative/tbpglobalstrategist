"use client"

import { motion } from "framer-motion"
import { FileText, Trophy, GitBranch, Users, Clock, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityTimelineProps {
  activities: {
    id: string
    title: string
    description: string
    date: string
    type: "publication" | "milestone" | "contribution" | "assignment"
    fileUrl?: string
    fileType?: string
    fileSize?: number | null
  }[]
}

const typeConfig = {
  publication: { icon: FileText, gradient: "from-indigo-500 to-purple-500" },
  milestone: { icon: Trophy, gradient: "from-amber-400 to-orange-500" },
  contribution: { icon: GitBranch, gradient: "from-emerald-400 to-teal-500" },
  assignment: { icon: Users, gradient: "from-cyan-400 to-blue-500" },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Activity & Contributions</h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative"
      >
        {activities.map((activity, index) => {
          const { icon: Icon, gradient } = typeConfig[activity.type]

          return (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              {/* Vertical line */}
              {index < activities.length - 1 && (
                <div className="absolute left-[19px] top-10 h-full w-px bg-gradient-to-b from-gray-200 to-transparent" />
              )}

              {/* Glowing dot */}
              <div className="relative flex shrink-0 items-start pt-1.5">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-indigo-400 to-teal-400 shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
                  <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-indigo-400/30" />
                </div>
              </div>

              {/* Icon + Content */}
              <div className="flex min-w-0 flex-1 gap-3">
                {/* Type icon */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                    gradient
                  )}
                >
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <h3 className="text-base font-semibold text-gray-900">
                    {activity.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-400">{activity.date}</span>
                  </div>
                  {activity.fileUrl && (
                    <a
                      href={activity.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Download className="h-3 w-3" />
                      {activity.fileType?.toUpperCase() ?? "File"}
                      {activity.fileSize ? ` · ${(activity.fileSize / 1024).toFixed(0)} KB` : ""}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
