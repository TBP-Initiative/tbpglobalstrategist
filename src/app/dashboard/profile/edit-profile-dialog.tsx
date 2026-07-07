"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { Camera, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassCard } from "@/components/shared/glass-card"
import { optimizeImage } from "@/lib/image-optimize"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    role: string
    profile: {
      title: string | null
      bio: string | null
      yearsOfExperience: number | null
      hourlyRate: string | null
      availability: boolean
      linkedinUrl: string | null
      websiteUrl: string | null
    } | null
  }
  onSaved: () => void
}

export function EditProfileDialog({ open, onOpenChange, user, onSaved }: EditProfileDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState<string | null>(user.image || null)
  const [optimizedDataUrl, setOptimizedDataUrl] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: user.name ?? "",
    title: user.profile?.title ?? "",
    bio: user.profile?.bio ?? "",
    yearsOfExperience: user.profile?.yearsOfExperience?.toString() ?? "",
    hourlyRate: user.profile?.hourlyRate?.toString() ?? "",
    availability: user.profile?.availability ?? true,
    linkedinUrl: user.profile?.linkedinUrl ?? "",
    websiteUrl: user.profile?.websiteUrl ?? "",
  })

  const initials = form.name
    ? form.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : user.email.slice(0, 2).toUpperCase()

  const handleImagePick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB")
      return
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    try {
      const result = await optimizeImage(file)
      setPreview(result.dataUrl)
      setOptimizedDataUrl(result.dataUrl)
      toast.success(`Image optimized: ${result.width}x${result.height}, ${Math.round(result.size / 1024)}KB`)
    } catch {
      toast.error("Failed to process image")
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        name: form.name || null,
        profile: {
          title: form.title || null,
          bio: form.bio || null,
          yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : null,
          hourlyRate: form.hourlyRate || null,
          availability: form.availability,
          linkedinUrl: form.linkedinUrl || null,
          websiteUrl: form.websiteUrl || null,
        },
      }
      if (optimizedDataUrl) body.image = optimizedDataUrl

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to save")
      }
      toast.success("Profile updated!")
      setOptimizedDataUrl(null)
      onOpenChange(false)
      onSaved()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information and photo.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar size="xl" className="ring-2 ring-border">
                <AvatarImage src={preview ?? undefined} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={handleImagePick}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow transition-colors hover:bg-primary/90"
              >
                <Camera size={12} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button type="button" variant="ghost" size="sm" onClick={handleImagePick}>
              Change Photo
            </Button>
          </div>

          <GlassCard intensity="light" className="p-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Basic Info</h4>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Professional Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Senior Strategist"
                maxLength={100}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground">{form.title.length}/100</p>
            </div>
          </GlassCard>

          <GlassCard intensity="light" className="p-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Professional Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  value={form.yearsOfExperience}
                  onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Hourly Rate ($)</label>
                <input
                  type="text"
                  value={form.hourlyRate}
                  onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                  placeholder="e.g. 150"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Bio</label>
              <textarea
                rows={5}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                maxLength={2000}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground">{form.bio.length}/2000</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="availability"
                checked={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <label htmlFor="availability" className="text-sm text-muted-foreground">
                Available for new projects
              </label>
            </div>
          </GlassCard>

          <GlassCard intensity="light" className="p-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Links</h4>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">LinkedIn URL</label>
              <input
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Website URL</label>
              <input
                type="url"
                value={form.websiteUrl}
                onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
          </GlassCard>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 size={14} className="mr-1.5 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
