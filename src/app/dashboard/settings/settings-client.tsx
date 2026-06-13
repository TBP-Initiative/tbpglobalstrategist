"use client"

import { useState } from "react"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Settings,
  Save,
  Mail,
  Globe,
  Shield,
  Bell,
  Palette,
} from "lucide-react"

export function SettingsClient() {
  const [platformName, setPlatformName] = useState("TBP Global Strategists")
  const [supportEmail, setSupportEmail] = useState("support@tbp.global")
  const [siteUrl, setSiteUrl] = useState("https://tbp.global")

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully`)
  }

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <PageHeader
          title="Settings"
          description="Platform-wide configuration and preferences"
        />
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <GlassCard className="p-6" intensity="light">
          <div className="flex items-center gap-2 mb-6">
            <Globe size={16} className="text-muted-foreground" />
            <h2 className="text-lg font-semibold">General</h2>
          </div>
          <div className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input
                id="siteUrl"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
              />
            </div>
            <Button type="button" size="sm" className="gap-1.5" onClick={() => handleSave("General")}>
              <Save size={14} />
              Save Changes
            </Button>
          </div>
        </GlassCard>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <GlassCard className="p-6" intensity="light">
          <div className="flex items-center gap-2 mb-6">
            <Mail size={16} className="text-muted-foreground" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4 max-w-lg">
            {[
              { id: "user-reg", label: "New user registration", desc: "When a new user creates an account" },
              { id: "org-reg", label: "New organization registration", desc: "When a new organization registers" },
              { id: "project-sub", label: "Project submissions", desc: "When a new project is submitted for review" },
              { id: "report-flag", label: "Content reports", desc: "When content is flagged for review" },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <label className="relative inline-flex h-5 w-9 cursor-pointer items-center">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <span className="absolute inset-0 rounded-full bg-muted transition-colors peer-checked:bg-primary" />
                  <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                </label>
              </div>
            ))}
            <Button type="button" size="sm" className="gap-1.5" onClick={() => handleSave("Notification")}>
              <Save size={14} />
              Save Preferences
            </Button>
          </div>
        </GlassCard>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <GlassCard className="p-6" intensity="light">
          <div className="flex items-center gap-2 mb-6">
            <Palette size={16} className="text-muted-foreground" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <div className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex gap-3">
                {["Light", "Dark", "System"].map((theme) => (
                  <Button key={theme} type="button" variant={theme === "Dark" ? "default" : "outline"} size="sm" className="px-6">
                    {theme}
                  </Button>
                ))}
              </div>
            </div>
            <Button type="button" size="sm" className="gap-1.5" onClick={() => handleSave("Appearance")}>
              <Save size={14} />
              Save Preferences
            </Button>
          </div>
        </GlassCard>
      </AnimatedSection>
    </div>
  )
}
