"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

interface ProfileProjectGridProps {
  projects: {
    id: string
    title: string
    slug: string
    image: string | null
    category: string
    status: string
    role: string
  }[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
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

export function ProfileProjectGrid({ projects }: ProfileProjectGridProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Projects I&apos;m Working On
        </h2>
        <Link
          href="/dashboard/individual/browse"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View All
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => {
          const statusColor = statusColors[project.status] ?? statusColors.DRAFT
          return (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg shadow-black/5 transition-colors duration-300 hover:border-indigo-500/50"
            >
              {/* Featured Image */}
              <div className="relative aspect-video overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-teal-100">
                    <span className="text-2xl font-bold text-indigo-300">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* View Project overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Link
                    href={`/dashboard/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-xs font-semibold text-gray-900 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
                  >
                    <ExternalLink size={14} />
                    View Project
                  </Link>
                </div>
              </div>

              <div className="space-y-3 p-5">
                {/* Category */}
                <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-300">
                  {project.category || "Strategic"}
                </span>

                {/* Title */}
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {project.title}
                </h3>

                {/* Role */}
                <p className="text-sm text-gray-600">{project.role}</p>

                {/* Status Badge + View */}
                <div className="flex items-center justify-between pt-1">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${statusColor}`}>
                    {project.status.replace(/_/g, " ")}
                  </span>
                  <Link
                    href={`/dashboard/projects/${project.slug}`}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View Project →
                  </Link>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
