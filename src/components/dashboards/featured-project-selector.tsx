"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, X, Check, ImageOff } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  status: string
  progress: number
  image: string | null
  category: string | null
  role: string
}

export function FeaturedProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentFeaturedId, setCurrentFeaturedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPicker, setShowPicker] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [projectsRes, featuredRes] = await Promise.all([
        fetch("/api/dashboard/my-projects"),
        fetch("/api/profile/featured-project"),
      ])
      const projectsData = await projectsRes.json()
      const featuredData = await featuredRes.json()
      if (Array.isArray(projectsData)) setProjects(projectsData)
      setCurrentFeaturedId(featuredData.featuredProjectId ?? null)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const selectFeatured = async (projectId: string | null) => {
    setSaving(true)
    try {
      const res = await fetch("/api/profile/featured-project", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      })
      if (res.ok) {
        setCurrentFeaturedId(projectId)
        setShowPicker(false)
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  const featuredProject = projects.find((p) => p.id === currentFeaturedId)

  if (loading) {
    return (
      <GlassCard className="p-6" intensity="light">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="h-3 w-60 rounded bg-muted" />
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-6" intensity="light">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-amber-500" />
          <h3 className="text-sm font-semibold">Featured Project</h3>
        </div>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
        >
          {currentFeaturedId ? "Change" : "Select Project"}
        </button>
      </div>

      {featuredProject ? (
        <div className="mt-4 rounded-xl border border-border p-4 transition-colors hover:border-primary/30">
          <div className="flex items-start gap-3">
            {featuredProject.image ? (
              <img
                src={featuredProject.image}
                alt={featuredProject.title}
                className="h-14 w-14 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted">
                <ImageOff size={16} className="text-muted-foreground/50" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{featuredProject.title}</p>
              <p className="text-xs text-muted-foreground truncate">
                {featuredProject.category ?? "Project"} &middot; {featuredProject.role}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${featuredProject.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">{featuredProject.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          No featured project selected. Choose one from your projects to highlight on your profile.
        </p>
      )}

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto rounded-xl border border-border p-2">
              {currentFeaturedId && (
                <button
                  onClick={() => selectFeatured(null)}
                  disabled={saving}
                  className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left text-xs text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors"
                >
                  <X size={14} />
                  Remove featured project
                </button>
              )}
              {projects.map((project) => {
                const isSelected = project.id === currentFeaturedId
                return (
                  <button
                    key={project.id}
                    onClick={() => selectFeatured(project.id)}
                    disabled={saving}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors",
                      isSelected
                        ? "bg-primary/10 ring-1 ring-primary/30"
                        : "hover:bg-muted/50"
                    )}
                  >
                    {project.image ? (
                      <img src={project.image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <ImageOff size={12} className="text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{project.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {project.category ?? "Project"} &middot; {project.status}
                      </p>
                    </div>
                    {isSelected && <Check size={14} className="shrink-0 text-primary" />}
                  </button>
                )
              })}
              {projects.length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No projects found. Join a project first.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
