"use client"

import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Construction, ArrowLeft } from "lucide-react"

export default function DashboardSubPage() {
  const router = useRouter()

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <PageHeader
          title="Coming Soon"
          description="This section is under development"
          actions={
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => router.back()}>
              <ArrowLeft size={14} />
              Go Back
            </Button>
          }
        />
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <GlassCard className="p-12" intensity="light">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Construction size={32} />
            </div>
            <h2 className="text-xl font-semibold">Under Construction</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              This dashboard page is being built. Check back soon for new features and functionality.
            </p>
            <Button variant="default" className="mt-2 gap-1.5" onClick={() => router.push("/dashboard")}>
              <ArrowLeft size={14} />
              Back to Dashboard
            </Button>
          </div>
        </GlassCard>
      </AnimatedSection>
    </div>
  )
}
