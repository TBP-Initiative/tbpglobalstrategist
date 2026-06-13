"use client"

import * as React from "react"
import Link from "next/link"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { getCategoryConfig } from "@/config/categories"

export interface ProjectCardData {
  id: string
  slug?: string
  title: string
  description: string
  category: string
  status: "active" | "completed" | "on-hold" | "draft"
  progress: number
  contributorCount: number
  contributors: { name: string; avatar: string | null }[]
  image?: string | null
  isFeatured?: boolean
}

interface ProjectCardProps {
  project: ProjectCardData
  index?: number
}

const statusConfig = {
  active: { label: "Active", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  completed: { label: "Completed", class: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  "on-hold": { label: "On Hold", class: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  draft: { label: "Draft", class: "bg-muted text-muted-foreground" },
}

const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ project, index = 0 }, ref) => {
    const status = statusConfig[project.status]
    const catConfig = getCategoryConfig(project.category)

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      >
        <Link
          href={`/projects/${project.slug ?? project.id}`}
          className="group block"
        >
          <div
            className={cn(
              "relative rounded-xl border bg-card transition-all duration-200",
              "hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
              "active:scale-[0.99]"
            )}
          >
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                        status.class
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          project.status === "active" && "bg-emerald-400",
                          project.status === "completed" && "bg-blue-400",
                          project.status === "on-hold" && "bg-amber-400",
                          project.status === "draft" && "bg-muted-foreground"
                        )}
                      />
                      {status.label}
                    </span>
                    <Badge variant="outline" className={cn("text-[11px] font-medium uppercase tracking-wider border", catConfig.badgeClass)}>
                      {project.category}
                    </Badge>
                  </div>
                  <h3 className="text-[15px] font-semibold leading-snug group-hover:text-primary transition-colors break-words">
                    {project.title}
                  </h3>
                </div>
              </div>

              <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
                {project.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium tabular-nums">{project.progress}%</span>
                </div>
                <Progress value={project.progress} variant={project.progress === 100 ? "success" : "default"} />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex -space-x-2">
                  {project.contributors.slice(0, 4).map((contributor, i) => (
                    <Avatar
                      key={i}
                      size="sm"
                      className="ring-2 ring-card"
                    >
                      <AvatarImage
                        src={contributor.avatar || undefined}
                        alt={contributor.name}
                      />
                      <AvatarFallback className="text-[10px]">
                        {contributor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.contributorCount > 4 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground ring-2 ring-card">
                      +{project.contributorCount - 4}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span className="tabular-nums">{project.contributorCount}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }
)
ProjectCard.displayName = "ProjectCard"

export { ProjectCard }
