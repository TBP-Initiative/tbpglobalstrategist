"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { StatsCard } from "@/components/dashboards/stats-card"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { EditProfileDialog } from "./edit-profile-dialog"
import { formatBio } from "@/lib/format-bio"
import { getCategory } from "@/lib/categories"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import {
  User,
  Mail,
  Calendar,
  Briefcase,
  Clock,
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

function getInitials(name: string | null, email: string) {
  return name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : email.slice(0, 2).toUpperCase()
}

export function ProfileClient() {
  const [editOpen, setEditOpen] = useState(false)
  const [user, setUser] = useState<{
    id: string
    name: string | null
    email: string
    role: string
    image: string | null
    createdAt: string
    profile: {
      title: string | null
      bio: string | null
      category: string | null
      city: string | null
      country: string | null
      countryCode: string | null
      yearsOfExperience: number | null
      availability: boolean
      linkedinUrl: string | null
      websiteUrl: string | null
      expertiseTags: string[]
    } | null
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [avatarError, setAvatarError] = useState(false)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/profile?t=${Date.now()}`)
      const data = await res.json()
      if (res.ok && data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          image: data.image,
          createdAt: data.createdAt?.toISOString?.() ?? data.createdAt ?? new Date().toISOString(),
          profile: data.strategistProfile
            ? {
                title: data.strategistProfile.title,
                bio: data.strategistProfile.bio,
                category: data.strategistProfile.category,
                city: data.strategistProfile.city,
                country: data.strategistProfile.country,
                countryCode: data.strategistProfile.countryCode,
                yearsOfExperience: data.strategistProfile.yearsOfExperience,
                availability: data.strategistProfile.availability,
                linkedinUrl: data.strategistProfile.linkedinUrl,
                websiteUrl: data.strategistProfile.websiteUrl,
                expertiseTags: data.strategistProfile.expertiseTags?.map((e: { tag: { name: string } }) => e.tag.name) ?? [],
              }
            : null,
        })
      }
    } catch {
      // failed to load
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    setAvatarError(false)
  }, [user?.image])

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  const initials = getInitials(user.name, user.email)

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <PageHeader
          title="My Profile"
          description="View and manage your account information"
          actions={
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => window.location.href = "/dashboard/settings"}>
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
                  {user.image && !avatarError ? (
                    <img
                      src={user.image}
                      alt={user.name ?? ""}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  )}
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
                {(user.profile?.city || user.profile?.country) && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {user.profile.countryCode && (
                      <img
                        src={`https://flagcdn.com/24x18/${user.profile.countryCode.toLowerCase()}.png`}
                        alt={user.profile.country ?? ""}
                        className="h-3.5 w-[18px] rounded-sm object-cover"
                      />
                    )}
                    <span>{[user.profile.city, user.profile.country].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                {user.profile?.category && (
                  <p className="text-[11px] text-muted-foreground italic">{getCategory(user.profile.category)?.name ?? user.profile.category}</p>
                )}
                {user.profile?.expertiseTags && user.profile.expertiseTags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                    {user.profile.expertiseTags.map((tag) => (
                      <span key={tag} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
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
              <StatsCard icon={<FolderKanban size={18} />} label="Projects" value="0" delay={0} />
              <StatsCard icon={<MessageSquare size={18} />} label="Messages" value="0" delay={0.05} />
              <StatsCard icon={<Bell size={18} />} label="Notifications" value="0" delay={0.1} />
              <StatsCard icon={<Award size={18} />} label="Achievements" value="0" delay={0.15} />
              <StatsCard icon={<FileText size={18} />} label="Publications" value="0" delay={0.2} />
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
        </div>
      </div>

      <EditProfileDialog
        key={user.image ?? "no-image"}
        open={editOpen}
        onOpenChange={setEditOpen}
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          profile: user.profile ? { ...user.profile, expertiseTags: user.profile.expertiseTags.map((name) => ({ tag: { id: name, name } })) } : null,
        }}
        onSaved={(newImage: string | null) => {
          if (newImage) {
            setUser((prev) => prev ? { ...prev, image: newImage } : prev)
          }
          fetchProfile()
        }}
      />
    </div>
  )
}
