"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Award,
  Building2,
  Calendar,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/shared/glass-card"
import { GradientText } from "@/components/shared/gradient-text"
import { AnimatedSection } from "@/components/shared/animated-section"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { StrategistCard } from "@/components/cards/strategist-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TeamMember {
  id: string
  name: string
  title: string
  role: string
  avatar: string | null
}

interface ProjectItem {
  id: string
  title: string
  description: string
  innovationAreas: string[]
  status: "draft" | "active" | "completed" | "on-hold"
  startDate: string
  endDate: string | null
  budget: number | null
}

interface InnovationInitiative {
  id: string
  title: string
  description: string
  area: string
  progress: number
}

interface StrategistProfile {
  id: string
  userId: string
  name: string
  title: string
  bio: string
  avatar: string | null
  expertiseAreas: string[]
  yearsOfExperience: number | null
  linkedIn: string | null
  website: string | null
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

interface CorporateProfile {
  id: string
  name: string
  slug: string
  description: string
  mission: string
  logo: string | null
  coverImage: string | null
  website: string | null
  industry: string
  size: string
  location: string
  founded: string
  isVerified: boolean
  memberCount: number
  projectCount: number
  strategistCount: number
  innovationScore: number
  partnershipStatus: "platinum" | "gold" | "silver" | "basic"
  contactEmail: string | null
  contactPhone: string | null
  socialLinks: { linkedin: string | null; twitter: string | null }
  team: TeamMember[]
  strategists: StrategistProfile[]
  projects: ProjectItem[]
  initiatives: InnovationInitiative[]
}

// ── Stat card ─────────────────────────────────────────────────────
function StatCard({
  icon,
  value,
  label,
  className,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  className?: string
}) {
  return (
    <GlassCard intensity="light" className={cn("p-5 text-center", className)}>
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </GlassCard>
  )
}

// ── Status badge ──────────────────────────────────────────────────
function ProjectStatusBadge({
  status,
}: {
  status: ProjectItem["status"]
}) {
  const variants: Record<string, { label: string; className: string }> = {
    active: { label: "Active", className: "bg-green-500/10 text-green-600 border-green-500/20" },
    completed: { label: "Completed", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    "on-hold": { label: "On Hold", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  }
  const v = variants[status]
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium", v.className)}>
      {v.label}
    </span>
  )
}

// ── Partnership badge ─────────────────────────────────────────────
function PartnershipBadge({
  level,
}: {
  level: CorporateProfile["partnershipStatus"]
}) {
  const colors: Record<string, string> = {
    platinum: "from-slate-300 to-slate-100 text-slate-900 border-slate-300",
    gold: "from-amber-300 to-yellow-100 text-amber-900 border-amber-300",
    silver: "from-gray-200 to-gray-50 text-gray-700 border-gray-200",
    basic: "from-blue-100 to-blue-50 text-blue-700 border-blue-200",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border bg-gradient-to-r px-3 py-1 text-xs font-semibold shadow-sm",
        colors[level]
      )}
    >
      <Award className="h-3.5 w-3.5" />
      {level.charAt(0).toUpperCase() + level.slice(1)} Partner
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────
function CorporateProfileClient({
  profile,
}: {
  profile: CorporateProfile
}) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState("overview")

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200)
    return () => clearTimeout(timer)
  }, [])

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-destructive/10 p-4">
          <Building2 className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Error Loading Profile</h2>
        <p className="max-w-md text-center text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => { setError(null); setIsLoading(true); setTimeout(() => setIsLoading(false), 200) }}>
          Retry
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="xl" text="Loading organization profile..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* ── Back nav ─────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/corporates"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Organizations
        </Link>
      </div>

      {/* ── Cover + Header ───────────────────────────────────────────── */}
      <section className="relative mt-4">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-background">
              {/* Cover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-background" />
              {profile.coverImage && (
                <Image
                  src={profile.coverImage}
                  alt=""
                  fill
                  className="object-cover opacity-30"
                  priority
                />
              )}

              <div className="relative flex flex-col items-center gap-6 px-6 py-12 sm:flex-row sm:gap-8 sm:px-10">
                {/* Logo */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg ring-4 ring-background sm:h-28 sm:w-28">
                  {profile.logo ? (
                    <Image
                      src={profile.logo}
                      alt={profile.name}
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-10 w-10 text-primary sm:h-12 sm:w-12" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                      {profile.name}
                    </h1>
                    {profile.isVerified && (
                      <ShieldCheck className="h-5 w-5 text-green-500" />
                    )}
                    <PartnershipBadge level={profile.partnershipStatus} />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground sm:justify-start">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {profile.industry}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Founded {profile.founded}
                    </span>
                  </div>

                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {profile.description}
                  </p>

                  {/* Social / Contact row */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          <Globe className="mr-1.5 h-3.5 w-3.5" />
                          Website
                          <ExternalLink className="ml-1.5 h-3 w-3" />
                        </Button>
                      </a>
                    )}
                    {profile.socialLinks.linkedin && (
                      <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                        <ExternalLink className="h-4.5 w-4.5" />
                      </a>
                    )}
                    {profile.socialLinks.twitter && (
                      <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                        <ExternalLink className="h-4.5 w-4.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Key Statistics ──────────────────────────────────────────── */}
      <section className="container mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <AnimatedSection delay={0}>
            <StatCard
              icon={<Users className="h-5 w-5" />}
              value={profile.memberCount}
              label="Strategists"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.05}>
            <StatCard
              icon={<Target className="h-5 w-5" />}
              value={profile.projectCount}
              label="Active Projects"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <StatCard
              icon={<Users className="h-5 w-5" />}
              value={profile.strategistCount}
              label="Team Members"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              value={`${profile.innovationScore}%`}
              label="Innovation Score"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Leadership</TabsTrigger>
            <TabsTrigger value="strategists">Strategists</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="innovation">Innovation</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* ── Overview ─────────────────────────────────────────────── */}
          <TabsContent value="overview" className="mt-6 space-y-8">
            {/* Mission */}
            <AnimatedSection>
              <GlassCard intensity="light" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Our Mission</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {profile.mission}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* About */}
            <AnimatedSection delay={0.05}>
              <GlassCard intensity="light" className="p-6">
                <h3 className="text-lg font-semibold">About {profile.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {profile.description}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <span className="text-muted-foreground">Industry</span>
                    <p className="font-medium">{profile.industry}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <span className="text-muted-foreground">Company Size</span>
                    <p className="font-medium">{profile.size} employees</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <span className="text-muted-foreground">Headquarters</span>
                    <p className="font-medium">{profile.location}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <span className="text-muted-foreground">Founded</span>
                    <p className="font-medium">{profile.founded}</p>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>
          </TabsContent>

          {/* ── Leadership ────────────────────────────────────────────── */}
          <TabsContent value="team" className="mt-6">
            {profile.team.length === 0 ? (
              <EmptyState
                icon={<Users className="h-6 w-6" />}
                title="No leadership listed"
                description="Team information is not yet available."
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {profile.team.map((member, i) => (
                  <AnimatedSection key={member.id} delay={i * 0.05}>
                    <GlassCard hover className="p-5">
                      <div className="flex items-center gap-4">
                        <Avatar size="md">
                          {member.avatar ? (
                            <AvatarImage src={member.avatar} alt={member.name} />
                          ) : null}
                          <AvatarFallback className="text-xs font-semibold">
                            {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-semibold">{member.name}</h4>
                          <p className="text-xs text-muted-foreground">{member.title}</p>
                          <Badge variant="secondary" className="mt-1 text-[10px]">
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                    </GlassCard>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Strategists ───────────────────────────────────────────── */}
          <TabsContent value="strategists" className="mt-6">
            {profile.strategists.length === 0 ? (
              <EmptyState
                icon={<Users className="h-6 w-6" />}
                title="No affiliated strategists"
                description="Strategist partnerships are being established."
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {profile.strategists.map((s, i) => (
                  <AnimatedSection key={s.id} delay={i * 0.04}>
                    <StrategistCard {...s} />
                  </AnimatedSection>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Projects ──────────────────────────────────────────────── */}
          <TabsContent value="projects" className="mt-6">
            {profile.projects.length === 0 ? (
              <EmptyState
                icon={<Target className="h-6 w-6" />}
                title="No projects yet"
                description="Projects will appear once initiated."
              />
            ) : (
              <div className="space-y-6">
                {profile.projects.map((project, i) => (
                  <AnimatedSection key={project.id} delay={i * 0.06}>
                    <GlassCard intensity="light" className="p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{project.title}</h3>
                            <ProjectStatusBadge status={project.status} />
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {project.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.innovationAreas.map((area) => (
                              <Badge key={area} variant="secondary" className="text-[10px]">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="shrink-0 space-y-1 text-right text-xs text-muted-foreground">
                          <p>Started: {project.startDate}</p>
                          {project.endDate && <p>Ended: {project.endDate}</p>}
                          {project.budget && (
                            <p className="font-medium text-foreground">
                              ${(project.budget / 1000000).toFixed(1)}M budget
                            </p>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Innovation ────────────────────────────────────────────── */}
          <TabsContent value="innovation" className="mt-6">
            {profile.initiatives.length === 0 ? (
              <EmptyState
                icon={<TrendingUp className="h-6 w-6" />}
                title="No innovation initiatives"
                description="Innovation programs are being developed."
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {profile.initiatives.map((init, i) => (
                  <AnimatedSection key={init.id} delay={i * 0.06}>
                    <GlassCard intensity="light" className="p-6">
                      <h3 className="text-base font-semibold">{init.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {init.description}
                      </p>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[10px]">
                            {init.area}
                          </Badge>
                          <span>{init.progress}% complete</span>
                        </div>
                        <Progress
                          value={init.progress}
                          variant={init.progress >= 75 ? "success" : init.progress >= 40 ? "warning" : "default"}
                          className="mt-2"
                        />
                      </div>
                    </GlassCard>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Contact ───────────────────────────────────────────────── */}
          <TabsContent value="contact" className="mt-6">
            <AnimatedSection>
              <GlassCard intensity="light" className="p-6">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <Separator className="my-4" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {profile.contactEmail && (
                    <a
                      href={`mailto:${profile.contactEmail}`}
                      className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{profile.contactEmail}</p>
                      </div>
                    </a>
                  )}
                  {profile.contactPhone && (
                    <a
                      href={`tel:${profile.contactPhone}`}
                      className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{profile.contactPhone}</p>
                      </div>
                    </a>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Globe className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Website</p>
                        <p className="font-medium truncate">{profile.website}</p>
                      </div>
                    </a>
                  )}
                  <div className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Headquarters</p>
                      <p className="font-medium">{profile.location}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}

export { CorporateProfileClient }
