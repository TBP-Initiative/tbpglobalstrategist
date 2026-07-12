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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}

export function FeaturedProject({ project, userId }: FeaturedProjectProps) {
  const status = project.status ?? "ACTIVE"
  const progress = project.progress ?? 0
  const projectLink = project.slug ? `/projects/${project.slug}` : `/projects/${project.id}`
  const shortDescription = stripHtml(project.description).slice(0, 200)

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group relative overflow-hidden rounded-2xl shadow-lg shadow-black/5 transition-all duration-500"
      style={{ backgroundColor: "#013466" }}
    >
      <div className="relative z-10 flex flex-col md:flex-row" style={{ padding: "1%" }}>
        {/* LEFT: Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl md:aspect-auto md:h-full md:min-h-[400px] md:w-1/2">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* RIGHT: Content */}
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="flex w-full flex-1 flex-col justify-center gap-3 md:w-1/2"
          style={{ padding: "1%" }}
        >
          {/* Category */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white ring-1 ring-white/30">
              {project.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="truncate text-lg font-bold text-white lg:text-xl">
            {project.title}
          </h3>

          {/* Short Description */}
          <p className="max-w-prose text-sm leading-relaxed text-white/80 line-clamp-3">
            {shortDescription}
          </p>

          {/* Project Information */}
          <div className="mt-1 space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/50">Category</p>
                <p className="font-medium text-white">{project.category}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/50">Role</p>
                <p className="font-medium text-white">{project.role}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/50">Contribution</p>
              <p className="text-white/90">{project.contribution || "—"}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-2 flex flex-nowrap items-center gap-3 pt-2">
            <Link
              href={projectLink}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-[#013466] shadow-lg transition-all duration-300 hover:bg-white/90 active:scale-[0.97]"
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
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-transparent px-4 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-white/10 active:scale-[0.97]"
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
