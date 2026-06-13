"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { ArrowRight, CheckCircle, FileText, Users, Globe, Target, Shield } from "lucide-react"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { GradientText } from "@/components/shared/gradient-text"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const sections = [
  {
    title: "Mission & Vision",
    description: "Understand the core mission of TBP and the vision behind the Neo-Polar Neutrality Global System (NPNGS). Learn how your role as a Global Strategist contributes to building a new framework for international trade, energy cooperation, and diplomatic engagement.",
    icon: Target,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Strategic Framework",
    description: "Explore the strategic pillars that underpin the NPNGS — including economic integration, energy security, technological innovation, and multilateral governance. Gain clarity on how these pillars interact to create a resilient global system.",
    icon: Globe,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Role & Expectations",
    description: "Learn what is expected of you as a TBP Global Strategist. From thought leadership and research contributions to active participation in working groups and summits, understand the impact you will drive.",
    icon: Users,
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Tools & Resources",
    description: "Get acquainted with the platforms, research repositories, collaboration tools, and communication channels available to you. This section covers everything from the TBP strategy portal to secure communication protocols.",
    icon: FileText,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Governance & Ethics",
    description: "Review the governance model, decision-making frameworks, and ethical guidelines that ensure transparency, accountability, and alignment with the principles of the NPNGS.",
    icon: Shield,
    color: "from-rose-500 to-pink-500",
  },
  {
    title: "Next Steps",
    description: "A clear roadmap of your first 30, 60, and 90 days as a Global Strategist — including orientation sessions, introductory calls, project assignments, and key milestones to track your integration.",
    icon: CheckCircle,
    color: "from-indigo-500 to-blue-500",
  },
]

const timeline = [
  { period: "Days 1–7", title: "Orientation & Setup", items: ["Platform access & account setup", "Review core NPNGS documentation", "Introduction call with your mentor"] },
  { period: "Days 8–30", title: "Deep Dive", items: ["Complete strategic framework training", "Join your first working group session", "Submit initial strategic assessment"] },
  { period: "Days 31–60", title: "Active Contribution", items: ["Lead or co-lead a research thread", "Participate in strategy workshops", "Build cross-functional connections"] },
  { period: "Days 61–90", title: "Full Integration", items: ["Present findings to leadership", "Contribute to a published insight piece", "Define your long-term strategic focus"] },
]

export default function OnBoardingBrief() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary backdrop-blur-sm">
              On-Boarding Brief
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-white/90">Welcome to</span>
              <GradientText from="from-blue-400" via="via-violet-400" to="to-cyan-300">
                TBP Global Strategists
              </GradientText>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
              Your essential guide to understanding the Neo-Polar Neutrality Global System (NPNGS) and
              your role in building a new era of global cooperation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Overview */}
      <section className="relative bg-background pb-16 pt-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <p className="text-lg leading-relaxed text-gray-700">
              The Borderless Project (TBP) is building a new global system for trade, energy, and cooperation.
              As a Global Strategist, you are joining a network of exceptional minds dedicated to shaping the
              Neo-Polar Neutrality Global System (NPNGS) — a framework designed to foster stability, prosperity,
              and shared progress across borders.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Key Sections */}
      <section className="relative bg-background pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <motion.div key={section.title} variants={staggerItem}>
                  <GlassCard hover className="group flex h-full flex-col p-6">
                    <div
                      className={cn(
                        "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                        section.color
                      )}
                    >
                      <Icon size={22} className="text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-black">{section.title}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-gray-700">{section.description}</p>
                  </GlassCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="relative border-y border-gray-200 bg-white py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-14 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Your First 90 Days
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Integration Roadmap
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-900">
              A structured path to help you transition from orientation to full strategic contribution.
            </p>
          </AnimatedSection>

          <div className="relative">
            <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent md:left-1/2 md:-translate-x-px" />
            <div className="space-y-12">
              {timeline.map((phase, index) => (
                <AnimatedSection
                  key={phase.period}
                  direction={index % 2 === 0 ? "left" : "right"}
                  className={`relative pl-14 md:w-1/2 md:pl-0 ${
                    index % 2 === 0 ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"
                  }`}
                >
                  <div
                    className={cn(
                      "absolute left-4 top-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/30 bg-background md:left-auto",
                      index % 2 === 0 ? "md:right-[-1.125rem]" : "md:left-[-1.125rem]"
                    )}
                  >
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                  <Badge className="mb-2 border-0 bg-primary/20 text-xs text-primary">{phase.period}</Badge>
                  <h3 className="mb-2 text-lg font-semibold text-black">{phase.title}</h3>
                  <ul className="space-y-1">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700 md:justify-end">
                        <CheckCircle size={14} className="mt-0.5 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary backdrop-blur-sm">
              Get Started
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <GradientText from="from-white" via="via-blue-200" to="to-cyan-200">
                Ready to begin your journey?
              </GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Complete your profile and connect with your onboarding mentor to start making an impact.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="mt-8">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button className="h-12 rounded-full bg-primary px-8 text-base font-medium text-primary-fg shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105">
                  Complete Registration <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105"
                >
                  Contact On-Boarding Team
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
