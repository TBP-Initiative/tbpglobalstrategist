"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProjectGridProps {
  projects: {
    id: string
    title: string
    category: string
    role: string
    image: string
    description?: string
    status?: string
    progress?: number
    slug?: string
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

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">
        Projects I&apos;m Working On
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg shadow-black/5 transition-colors duration-300 hover:border-indigo-500/50"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            <div className="space-y-3 p-5">
              <span className="inline-block rounded-full bg-gradient-to-r from-indigo-500/20 to-teal-500/20 px-3 py-1 text-sm font-medium text-indigo-600 ring-1 ring-indigo-400/30">
                {project.category}
              </span>

              <h3 className="text-lg font-semibold text-gray-900">
                {project.title}
              </h3>

              <p className="text-sm text-gray-600">Role: {project.role}</p>

              {project.status && (
                <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 ring-1 ring-gray-200">
                  {project.status.replace(/_/g, " ")}
                </span>
              )}

              {project.description && (
                <p className="line-clamp-2 text-sm text-gray-500">
                  {project.description}
                </p>
              )}

              {project.progress != null && (
                <div className="mt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-medium text-gray-600">{project.progress}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full ${
                        project.progress >= 75 ? "bg-emerald-500" : project.progress >= 40 ? "bg-amber-500" : "bg-indigo-500"
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
