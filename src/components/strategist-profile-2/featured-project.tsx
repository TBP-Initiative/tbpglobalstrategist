"use client"

import { motion } from "framer-motion"
import { ArrowRight, MessageSquare } from "lucide-react"
import Link from "next/link"

interface FeaturedProjectProps {
  project: {
    id: string
    title: string
    category: string
    role: string
    image: string
    description: string
    contribution: string
    status?: string
    progress?: number
    slug?: string
  }
  userId?: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
}

const contentVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.3, duration: 0.6, ease: "easeOut" },
  },
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  COMPLETED: "bg-blue-100 text-blue-700 ring-blue-200",
  PLANNING: "bg-amber-100 text-amber-700 ring-amber-200",
  ON_HOLD: "bg-gray-100 text-gray-600 ring-gray-200",
  DRAFT: "bg-gray-100 text-gray-600 ring-gray-200",
  CANCELLED: "bg-red-100 text-red-600 ring-red-200",
}

function getProgressColor(pct: number) {
  if (pct >= 75) return "bg-emerald-500"
  if (pct >= 40) return "bg-amber-500"
  return "bg-indigo-500"
}

export function FeaturedProject({ project, userId }: FeaturedProjectProps) {
  const status = project.status ?? "ACTIVE"
  const progress = project.progress ?? 0
  const projectLink = project.slug ? `/projects/${project.slug}` : `/projects/${project.id}`

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg shadow-black/5 transition-all duration-500 hover:border-indigo-500/50 hover:shadow-indigo-500/10"
    >
      {/* Glow accent on hover */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-transparent to-teal-500/10" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row">
        {/* LEFT: Image */}
        <div className="relative aspect-video w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[400px] md:w-1/2">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/30 md:to-transparent" />
        </div>

        {/* RIGHT: Content */}
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="flex w-full flex-1 flex-col justify-center gap-3 p-5 md:w-1/2 md:p-6 lg:p-8"
        >
          {/* Category */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-gradient-to-r from-indigo-500/20 to-teal-500/20 px-3 py-1 text-sm font-medium text-indigo-600 ring-1 ring-indigo-400/30">
              {project.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            {project.title}
          </h3>

          {/* Short Description */}
          <p className="max-w-prose text-base leading-relaxed text-gray-600">
            {project.description}
          </p>

          {/* Project Information */}
          <div className="mt-1 space-y-2 rounded-xl bg-gray-50 p-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Role</p>
                <p className="font-medium text-gray-800">{project.role}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Status</p>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${statusColors[status] ?? statusColors.DRAFT}`}>
                  {status.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Contribution</p>
              <p className="text-gray-700">{project.contribution || "—"}</p>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Progress</p>
                <span className="text-xs font-semibold text-gray-600">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getProgressColor(progress)}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-2 flex flex-nowrap items-center gap-3 pt-2">
            <Link
              href={projectLink}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110 active:scale-[0.97]"
            >
              View Project
              <ArrowRight className="h-4 w-4" />
            </Link>

            {userId && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-chat", { detail: { userId } }))
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-700 transition-all duration-300 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 active:scale-[0.97]"
              >
                <MessageSquare className="h-4 w-4" />
                Message Strategist
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
