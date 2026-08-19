"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowUpDown, Filter, Plus, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/shared/search-input"
import { type ProjectCardData } from "@/components/cards/project-card"
import { FeaturedProjectCard, type FeaturedProjectData } from "@/components/cards/featured-project-card"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GradientText } from "@/components/shared/gradient-text"

const PATHWAY_OPTIONS = [
  { value: "", label: "All Pathways" },
  { value: "BOTH", label: "Both (Fellowship + R&D)" },
  { value: "FELLOWSHIP", label: "Fellowship Only" },
  { value: "APPLIED_RD", label: "Applied R&D Only" },
]

const REGION_OPTIONS = [
  { value: "", label: "All Regions" },
  { value: "Africa", label: "Africa" },
  { value: "Asia", label: "Asia" },
  { value: "Europe", label: "Europe" },
  { value: "North America", label: "North America" },
  { value: "South America", label: "South America" },
  { value: "Oceania", label: "Oceania" },
  { value: "Middle East", label: "Middle East" },
  { value: "Global", label: "Global" },
]

interface ProjectsDirectoryProps {
  categories: string[]
  featuredProjects: FeaturedProjectData[]
  allProjects: ProjectCardData[]
}

export function ProjectsDirectory({ categories, featuredProjects, allProjects }: ProjectsDirectoryProps) {
  const [activeCategory, setActiveCategory] = React.useState("All")
  const [activePathway, setActivePathway] = React.useState("")
  const [activeRegion, setActiveRegion] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState<"newest" | "progress" | "name">("newest")

  const filtered = React.useMemo(() => {
    let list = activeCategory === "All"
      ? allProjects
      : allProjects.filter((p) => p.category === activeCategory)

    if (activePathway) {
      list = list.filter((p) => p.eligiblePathways === activePathway || p.eligiblePathways === "BOTH")
    }

    if (activeRegion) {
      list = list.filter((p) => p.region === activeRegion)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          (p.category ?? "").toLowerCase().includes(q)
      )
    }

    const sorted = [...list]
    if (sortBy === "progress") sorted.sort((a, b) => b.progress - a.progress)
    else if (sortBy === "name") sorted.sort((a, b) => a.title.localeCompare(b.title))

    return sorted
  }, [activeCategory, activePathway, activeRegion, searchQuery, sortBy, allProjects])

  const hasActiveFilters = activePathway !== "" || activeRegion !== ""

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[13px] font-medium text-primary mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Explore strategic initiatives
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4 text-white">
              Projects{" "}
              <GradientText from="from-blue-300" via="via-violet-300" to="to-cyan-200" as="span">
                Shaping Tomorrow
              </GradientText>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
              Discover strategic initiatives, public programs, institutional projects, and innovation labs
              driving global transformation across industries and borders.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl"
          >
            <SearchInput
              placeholder="Search projects by name, category, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-white/70 [&>svg]:text-white/40"
              style={{ colorScheme: "dark" }}
              showClear
            />
            <div className="flex gap-2">
              <select
                value={activePathway}
                onChange={(e) => setActivePathway(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-[13px] font-medium text-white placeholder-white/50 backdrop-blur-sm focus:border-white/40 focus:outline-none"
              >
                {PATHWAY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={activeRegion}
                onChange={(e) => setActiveRegion(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-[13px] font-medium text-white placeholder-white/50 backdrop-blur-sm focus:border-white/40 focus:outline-none"
              >
                {REGION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatedSection>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1 w-8 rounded-full bg-primary" />
              <h2 className="text-lg font-semibold">Featured Projects</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2">
              {featuredProjects.map((project, i) => (
                <FeaturedProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </AnimatedSection>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <AnimatedSection delay={0.1}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-1 w-8 rounded-full bg-primary" />
            <h2 className="text-lg font-semibold">All Projects</h2>
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {activePathway && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[12px] font-medium text-primary">
                  {PATHWAY_OPTIONS.find((o) => o.value === activePathway)?.label}
                  <button onClick={() => setActivePathway("")} className="hover:text-primary/70">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {activeRegion && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[12px] font-medium text-primary">
                  {activeRegion}
                  <button onClick={() => setActiveRegion("")} className="hover:text-primary/70">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={() => { setActivePathway(""); setActiveRegion("") }}
                className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-all",
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortBy(sortBy === "progress" ? "name" : "progress")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all",
                  sortBy !== "newest"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {sortBy === "progress" ? "Progress" : sortBy === "name" ? "Name" : "Default"}
              </button>
              <span className="text-[13px] text-muted-foreground tabular-nums">
                {filtered.length} project{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2">
              {filtered.map((project, i) => (
                <FeaturedProjectCard
                  key={project.id}
                  project={{
                    id: project.id,
                    title: project.title,
                    slug: project.slug ?? project.id,
                    description: project.description,
                    image: project.image ?? null,
                    category: project.category,
                    status: project.status,
                    featuredAt: null,
                    organization: null,
                    contributors: project.contributors,
                    contributorCount: project.contributorCount,
                  }}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                <Filter className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">No projects found</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("All")
                  setActivePathway("")
                  setActiveRegion("")
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </AnimatedSection>
      </section>

      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <AnimatedSection className="text-center">
            <div className="relative inline-flex flex-col items-center">
              <div className="absolute -inset-x-20 -inset-y-10 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-3xl" />
              <h2 className="relative text-2xl sm:text-3xl font-bold tracking-tight">
                Have a strategic initiative in mind?
              </h2>
              <p className="relative mt-2 text-muted-foreground max-w-md">
                Launch a project, invite strategists, and drive meaningful change with the TBP community.
              </p>
              <Button size="lg" className="relative mt-6 gap-2">
                <Plus className="h-4 w-4" />
                Create a Project
              </Button>
              <p className="relative mt-3 text-[12px] text-muted-foreground">
                Sign in to your organization account to get started.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
