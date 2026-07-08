"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { ArrowRight, FolderKanban } from "lucide-react"

type ProjectItem = {
  id: string
  title: string
  slug: string
  image: string | null
  category: string | null
  shortDescription: string | null
  createdAt: string
}

export function CurrentTbpProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/projects?status=ACTIVE&limit=4")
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <GlassCard className="p-5" intensity="light">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-36 rounded bg-muted" />
          <div className="h-12 rounded bg-muted" />
          <div className="h-12 rounded bg-muted" />
        </div>
      </GlassCard>
    )
  }

  if (projects.length === 0) return null

  return (
    <GlassCard className="p-5" intensity="light">
      <div className="mb-3 flex items-center gap-2">
        <FolderKanban size={15} className="text-muted-foreground" />
        <h3 className="text-sm font-semibold">Current TBP Projects</h3>
      </div>

      <div className="space-y-3">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <Link
              href={`/projects/${project.id}`}
              className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                    <FolderKanban size={16} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                  {project.title}
                </p>
                {project.category && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {project.category}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <Link
        href="/projects"
        className="mt-2 flex items-center justify-center gap-1 rounded-lg py-2 text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        View all projects
        <ArrowRight size={12} />
      </Link>
    </GlassCard>
  )
}
