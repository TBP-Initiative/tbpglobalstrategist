"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { getCategoryConfig } from "@/config/categories"

export interface FeaturedProjectData {
  id: string
  title: string
  slug: string
  description: string
  image: string | null
  category: string
  status: string
  featuredAt: string | null
  organization: { name: string; slug: string } | null
  contributors: { name: string; avatar: string | null }[]
  contributorCount: number
}

interface FeaturedProjectCardProps {
  project: FeaturedProjectData
  index: number
}

export function FeaturedProjectCard({ project, index }: FeaturedProjectCardProps) {
  const catConfig = getCategoryConfig(project.category)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link href={`/projects/${project.slug}`} className="group block h-full">
        <div className="relative flex flex-col sm:flex-row h-full overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
          <div className="relative aspect-video sm:aspect-auto sm:w-1/2 shrink-0 overflow-hidden bg-muted">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground/20">
                <svg
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent sm:bg-gradient-to-r sm:from-black/10 sm:to-transparent" />
          </div>

          <div className="flex flex-1 flex-col justify-between p-5 min-w-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                {project.category && (
                  <Badge variant="outline" className={cn("text-[11px] font-medium uppercase tracking-wider border", catConfig.badgeClass)}>
                    {project.category}
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {project.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-border">
              <div className="flex -space-x-2">
                {project.contributors.slice(0, 3).map((contributor, i) => (
                  <Avatar
                    key={i}
                    size="sm"
                    className="ring-2 ring-card"
                  >
                    {contributor.avatar ? (
                      <AvatarImage
                        src={contributor.avatar}
                        alt={contributor.name}
                      />
                    ) : (
                      <AvatarFallback className="text-[10px]">
                        {contributor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                ))}
                {project.contributorCount > 3 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground ring-2 ring-card">
                    +{project.contributorCount - 3}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs h-8 px-3 shrink-0 group/btn"
              >
                View Project
                <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
