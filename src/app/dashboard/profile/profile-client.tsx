"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { StatsCard } from "@/components/dashboards/stats-card"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { EditProfileDialog } from "./edit-profile-dialog"
import { formatBio } from "@/lib/format-bio"
import {
  User,
  Mail,
  Calendar,
  Briefcase,
  Clock,
  DollarSign,
  Globe,
  Link2,
  FolderKanban,
  MessageSquare,
  Award,
  FileText,
  Bell,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Settings,
  Edit3,
} from "lucide-react"

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
  STRATEGIST: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  RESEARCHER: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  MODERATOR: "bg-green-500/10 text-green-500 border-green-500/20",
  PARTNER: "bg-pink-500/10 text-pink-500 border-pink-500/20",
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-500 border-green-500/20",
  DRAFT: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
}

export function ProfileClient({
  user,
}: {
  user: {
    id: string
    name: string | null
    email: string
    role: string
    image: string | null
    createdAt: string
    profile: {
      title: string | null
      bio: string | null
      yearsOfExperience: number | null
      hourlyRate: string | null
      availability: boolean
      linkedinUrl: string | null
      websiteUrl: string | null
    } | null
    stats: {
      projects: number
      sentMessages: number
      receivedMessages: number
      notifications: number
      achievements: number
      publications: number
    }
    latestProjects: { id: string; title: string; status: string; createdAt: string }[]
  }
}) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : user.email.slice(0, 2).toUpperCase()

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <PageHeader
          title="My Profile"
          description="View and manage your account information"
          actions={
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => router.push("/dashboard/settings")}>
                <Settings size={14} />
                Account Settings
              </Button>
              <Button type="button" size="sm" className="gap-1.5" onClick={() => setEditOpen(true)}>
                <Edit3 size={14} />
                Edit Profile
              </Button>
            </div>
          }
        />
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <AnimatedSection delay={0.1}>
            <GlassCard className="p-6" intensity="light">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar size="lg">
                  <AvatarImage src={user.image ?? undefined} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{user.name ?? "Unnamed"}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="outline" className={`mt-2 ${roleColors[user.role] ?? ""} text-[10px] px-2`}>
                    {user.role.replace("_", " ")}
                  </Badge>
                </div>
                {user.profile?.title && (
                  <p className="text-sm font-medium text-primary">{user.profile.title}</p>
                )}
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={14} className="text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Joined</span>
                  <span className="ml-auto font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                {user.profile?.availability !== null && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Availability</span>
                    <span className="ml-auto">
                      {user.profile?.availability ? (
                        <span className="flex items-center gap-1 text-green-500"><CheckCircle2 size={12} /> Available</span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500"><XCircle size={12} /> Busy</span>
                      )}
                    </span>
                  </div>
                )}
                {user.profile?.yearsOfExperience && (
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Experience</span>
                    <span className="ml-auto font-medium">{user.profile.yearsOfExperience} years</span>
                  </div>
                )}
                {user.profile?.hourlyRate && (
                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Hourly Rate</span>
                    <span className="ml-auto font-medium">${user.profile.hourlyRate}/hr</span>
                  </div>
                )}
              </div>
              {(user.profile?.linkedinUrl || user.profile?.websiteUrl) && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    {user.profile?.linkedinUrl && (
                      <a href={user.profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Link2 size={14} />
                        LinkedIn Profile
                        <ExternalLink size={12} className="ml-auto" />
                      </a>
                    )}
                    {user.profile?.websiteUrl && (
                      <a href={user.profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Globe size={14} />
                        Website
                        <ExternalLink size={12} className="ml-auto" />
                      </a>
                    )}
                  </div>
                </>
              )}
            </GlassCard>
          </AnimatedSection>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatsCard icon={<FolderKanban size={18} />} label="Projects" value={String(user.stats.projects)} delay={0} />
              <StatsCard icon={<MessageSquare size={18} />} label="Messages" value={String(user.stats.sentMessages + user.stats.receivedMessages)} delay={0.05} />
              <StatsCard icon={<Bell size={18} />} label="Notifications" value={String(user.stats.notifications)} delay={0.1} />
              <StatsCard icon={<Award size={18} />} label="Achievements" value={String(user.stats.achievements)} delay={0.15} />
              <StatsCard icon={<FileText size={18} />} label="Publications" value={String(user.stats.publications)} delay={0.2} />
              <StatsCard icon={<User size={18} />} label="Network" value="0" delay={0.25} />
            </div>
          </AnimatedSection>

          {user.profile?.bio && (
            <AnimatedSection delay={0.15}>
              <GlassCard className="p-6" intensity="light">
                <h3 className="text-sm font-semibold mb-3">About</h3>
                <div className="text-sm text-muted-foreground leading-relaxed">{formatBio(user.profile.bio)}</div>
              </GlassCard>
            </AnimatedSection>
          )}

          <AnimatedSection delay={0.2}>
            <GlassCard className="p-6" intensity="light">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FolderKanban size={16} className="text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Recent Projects</h3>
                </div>
                <Button type="button" variant="ghost" size="sm" className="text-xs gap-1" onClick={() => router.push("/dashboard/projects")}>
                  View all <ExternalLink size={12} />
                </Button>
              </div>
              <div className="space-y-2">
                {user.latestProjects.length > 0 ? (
                  user.latestProjects.map((p) => {
                    const s = statusColors[p.status] ?? ""
                    return (
                      <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div>
                          <p className="text-sm font-medium">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline" className={s + " text-[10px] px-1.5"}>{p.status}</Badge>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">No projects yet.</p>
                )}
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <GlassCard className="p-6" intensity="light">
              <h3 className="text-sm font-semibold mb-3">Account Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Mail size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Email</span>
                  </div>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <User size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Role</span>
                  </div>
                  <Badge variant="outline" className={(roleColors[user.role] ?? "") + " text-[10px] px-1.5"}>
                    {user.role.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Member Since</span>
                  </div>
                  <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          profile: user.profile,
        }}
        onSaved={() => router.refresh()}
      />
    </div>
  )
}
