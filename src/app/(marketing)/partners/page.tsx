"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import {
  ArrowRight,
  Building2,
  Cpu,
  FlaskConical,
  Globe,
  Handshake,
  Heart,
  Shield,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  Star,
  Sparkles,
  Check,
} from "lucide-react"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { GradientText } from "@/components/shared/gradient-text"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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

const partnerCategories = [
  {
    title: "Technology Partners",
    description: "Leading technology companies driving digital transformation across industries.",
    icon: Cpu,
    color: "from-blue-500 to-cyan-500",
    partners: ["CloudScale AI", "NexGen Dynamics", "QuantumLeap Tech", "DataForge Systems", "CyberShield Corp", "InfraWorks"],
  },
  {
    title: "Research Institutions",
    description: "Academic and research organizations advancing strategic knowledge and innovation.",
    icon: FlaskConical,
    color: "from-violet-500 to-purple-500",
    partners: ["Global Strategy Institute", "Center for Innovation Studies", "International Policy Lab", "Future of Business Research", "Digital Ethics Council", "Sustainable Development Lab"],
  },
  {
    title: "Industry Alliances",
    description: "Strategic industry bodies and consortiums shaping global business standards.",
    icon: Building2,
    color: "from-emerald-500 to-teal-500",
    partners: ["Global Enterprise Alliance", "Innovation Leadership Forum", "Sustainable Business Council", "Digital Trade Association", "Strategic Advisory Board", "International Chamber"],
  },
  {
    title: "Social Impact Partners",
    description: "Organizations committed to creating positive social and environmental change.",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    partners: ["Global Impact Foundation", "Education Without Borders", "Green Future Initiative", "Tech for Good Alliance", "Inclusive Growth Lab", "Community First Network"],
  },
]

const benefits = [
  {
    title: "Access to Elite Network",
    description: "Connect with 1,500+ pre-vetted strategists and decision-makers across industries.",
    icon: Users,
  },
  {
    title: "Co-Innovation Opportunities",
    description: "Collaborate on cutting-edge research, pilot programs, and joint ventures.",
    icon: Lightbulb,
  },
  {
    title: "Strategic Intelligence",
    description: "Exclusive access to proprietary research, market insights, and trend forecasts.",
    icon: TrendingUp,
  },
  {
    title: "Global Visibility",
    description: "Showcase your brand at our summit, in publications, and across our digital platforms.",
    icon: Globe,
  },
  {
    title: "Preferred Partnerships",
    description: "Priority access to project opportunities and strategic collaborations.",
    icon: Star,
  },
  {
    title: "Impact Recognition",
    description: "Be recognized as a driver of global strategic innovation and positive change.",
    icon: Award,
  },
  {
    title: "Governance & Standards",
    description: "Help shape industry standards, best practices, and governance frameworks.",
    icon: Shield,
  },
  {
    title: "Talent Development",
    description: "Access to emerging talent, leadership programs, and capability-building initiatives.",
    icon: Sparkles,
  },
]

export default function PartnersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-emerald-500/20 rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary backdrop-blur-sm">
              Industrial Partners
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-white/90">Powering a global</span>
              <GradientText from="from-blue-400" via="via-emerald-400" to="to-cyan-300">
                partnership ecosystem
              </GradientText>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
              We collaborate with the world&apos;s leading organizations — from technology pioneers
              to research institutions — to drive strategic innovation at scale.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="relative border-y border-white/5 bg-black/40 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 text-center sm:grid-cols-4"
          >
            {[
              { value: "150+", label: "Partner Organizations" },
              { value: "30+", label: "Countries Represented" },
              { value: "12", label: "Industry Verticals" },
              { value: "98%", label: "Satisfaction Rate" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={staggerItem}>
                <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partner Categories */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <GradientText from="from-white" via="via-blue-200" to="to-white/60">
                Partner categories
              </GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/50">
              Our diverse partner ecosystem spans technology, research, industry, and social impact.
            </p>
          </AnimatedSection>

          <div className="space-y-16">
            {partnerCategories.map((category, ci) => {
              const Icon = category.icon
              return (
                <AnimatedSection key={category.title} delay={ci * 0.1}>
                  <div className="mb-6 flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                        category.color
                      )}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                      <p className="text-sm text-white/40">{category.description}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {category.partners.map((partner) => (
                      <GlassCard key={partner} hover className="flex items-center gap-3 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold uppercase text-white/40">
                          {partner.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-white">{partner}</span>
                      </GlassCard>
                    ))}
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative border-y border-white/5 bg-black/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Why Partner With Us
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <GradientText from="from-white" via="via-violet-200" to="to-white/60">
                Partnership benefits
              </GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/50">
              What you gain when you join the TBP Global Partner Network.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <motion.div key={benefit.title} variants={staggerItem}>
                  <GlassCard hover className="group p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      <Icon size={20} />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold text-white">{benefit.title}</h3>
                    <p className="text-xs leading-relaxed text-white/40">{benefit.description}</p>
                  </GlassCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary backdrop-blur-sm">
              Become a Partner
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <GradientText from="from-white" via="via-blue-200" to="to-cyan-200">
                Ready to join our ecosystem?
              </GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Partner with TBP Global Strategists and become part of a network shaping the future
              of global business strategy.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="mt-8">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact">
                <Button className="h-12 rounded-full bg-primary px-8 text-base font-medium text-primary-fg shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105">
                  Apply to partner <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105"
                >
                  Learn more <ChevronRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.4} className="mt-8">
            <p className="text-sm text-white/30">
              Already a partner? <Link href="/login" className="text-primary hover:underline">Sign in to the partner portal</Link>
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

function Lightbulb(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
}
