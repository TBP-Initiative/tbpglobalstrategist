import { strategistData } from "@/components/strategist-profile-2/data"
import Navbar from "@/components/strategist-profile-2/navbar"
import { ProfileHero } from "@/components/strategist-profile-2/profile-hero"
import { StrategistFocusCard } from "@/components/strategist-profile-2/strategist-focus-card"
import { RightSidebar } from "@/components/strategist-profile-2/right-sidebar"
import { FeaturedProject } from "@/components/strategist-profile-2/featured-project"
import { ProjectGrid } from "@/components/strategist-profile-2/project-grid"
import { ActivityTimeline } from "@/components/strategist-profile-2/activity-timeline"

export default function StrategistProfileTwoPage() {
  const { name, headline, bio, avatar, isOnline, verified, role, expertiseTags, stats, focus, projects, activities } =
    strategistData

  const heroStrategist = {
    name,
    headline,
    bio,
    avatar,
    isOnline,
    verified,
    role,
    expertiseTags,
    stats,
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-[70%]">
            <section className="-mt-4">
              <ProfileHero strategist={heroStrategist} />
            </section>

            <div className="mt-10 space-y-10">
              {projects[0] && (
                <FeaturedProject project={projects[0]} />
              )}

              {projects.length > 1 && (
                <ProjectGrid projects={projects.slice(1)} />
              )}

              {activities.length > 0 && (
                <ActivityTimeline activities={activities} />
              )}
            </div>
          </div>

          <div className="w-full lg:w-[30%]">
            <div className="flex flex-col gap-5 lg:sticky lg:top-24">
              <StrategistFocusCard focus={focus} />
              <RightSidebar
                projects={projects.slice(0, 3)}
                collaborationStatus={focus.collaborationStatus}
                location={focus.basedIn}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
