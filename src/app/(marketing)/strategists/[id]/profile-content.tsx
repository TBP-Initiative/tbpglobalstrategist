"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/layout/navbar"
import { ProfileHero } from "@/components/strategist-profile-2/profile-hero"
import { StrategistFocusCard } from "@/components/strategist-profile-2/strategist-focus-card"
import { RightSidebar } from "@/components/strategist-profile-2/right-sidebar"
import { FeaturedProject } from "@/components/strategist-profile-2/featured-project"
import { ProjectGrid } from "@/components/strategist-profile-2/project-grid"
import { ActivityTimeline } from "@/components/strategist-profile-2/activity-timeline"
import type { StrategistProfile } from "@/data/strategists"

function mapStrategist(strategist: StrategistProfile) {
  const avatar = strategist.avatar || `https://i.pravatar.cc/300?u=${strategist.name.replace(/\s+/g, "-").toLowerCase()}`

  const heroData = {
    name: strategist.name,
    headline: strategist.headline,
    bio: strategist.bio,
    avatar,
    isOnline: true,
    verified: strategist.badge === "Top Strategist",
    role: strategist.badge,
    expertiseTags: strategist.expertiseAreas,
    location: strategist.location || "",
    stats: {
      projectsCompleted: strategist.stats.projects,
      activeProjects: 0,
      publications: strategist.stats.publications,
      networkSize: strategist.stats.network,
    },
  }

  const memberSince = new Date(strategist.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const focus = {
    strategicDomain: strategist.strategicFocusAreas[0]?.title || "Strategic Advisory",
    primaryContribution: strategist.strategicFocusAreas[1]?.title || "Strategic Planning",
    currentTbpFocus: strategist.strategicFocusAreas[0]?.description || "Strategy & Innovation",
    collaborationStatus: strategist.collaborationStatus === "open"
      ? "Open for Strategic Partnerships"
      : strategist.collaborationStatus === "limited"
      ? "Limited Availability"
      : "Currently Unavailable",
    memberSince,
    basedIn: strategist.location || "",
  }

  const projects = strategist.featuredProjects.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.tags[0] || "Strategic",
    role: "Lead Strategist",
    image: p.image,
    description: p.description,
    contribution: "",
  }))

  const typeMap: Record<string, "publication" | "milestone" | "contribution" | "assignment"> = {
    publication: "publication",
    speaking: "milestone",
    project: "milestone",
    award: "milestone",
    deal: "contribution",
  }

  const activities = strategist.activityTimeline.map((a, i) => ({
    id: `act-${i}`,
    title: a.title,
    description: a.description,
    date: new Date(a.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    type: typeMap[a.type] || "contribution",
  }))

  return { heroData, focus, projects, activities }
}

export function ProfileContent({ strategist }: { strategist: StrategistProfile }) {
  const { heroData, focus, projects, activities } = mapStrategist(strategist)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-[70%]">
              <AnimatedSection>
                <ProfileHero strategist={heroData} />
              </AnimatedSection>

            <div className="mt-10 space-y-10">
              {projects[0] && (
                <AnimatedSection>
                  <FeaturedProject project={projects[0]} />
                </AnimatedSection>
              )}

              {projects.length > 1 && (
                <AnimatedSection>
                  <ProjectGrid projects={projects.slice(1)} />
                </AnimatedSection>
              )}

              {activities.length > 0 && (
                <AnimatedSection>
                  <ActivityTimeline activities={activities} />
                </AnimatedSection>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[30%]">
            <div className="flex flex-col gap-5 lg:sticky lg:top-24">
              <AnimatedSection>
                <StrategistFocusCard focus={focus} />
              </AnimatedSection>
              <AnimatedSection>
                <RightSidebar
                  projects={projects.slice(0, 3)}
                  collaborationStatus={focus.collaborationStatus}
                  location={focus.basedIn}
                />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function AnimatedSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}
