"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import {
  ArrowRight,
  BrainCircuit,
  Blocks,
  Orbit,
  Rocket,
  Cpu,
  Globe,
  Shield,
  Microscope,
  Satellite,
  Zap,
  Cloud,
  ChevronRight,
  Sparkles,
  Lightbulb,
  Users,
  FlaskConical,
  ArrowUpRight,
} from "lucide-react"
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

const innovationAreas = [
  {
    title: "Artificial Intelligence & ML",
    description: "Developing responsible AI solutions that transform enterprise decision-making and operational efficiency.",
    icon: BrainCircuit,
    color: "from-blue-500 to-cyan-500",
    capabilities: ["Generative AI", "Predictive Analytics", "Natural Language Processing", "Computer Vision", "Reinforcement Learning"],
    projects: 45,
  },
  {
    title: "Blockchain & Web3",
    description: "Building decentralized infrastructure for transparent, secure, and efficient business ecosystems.",
    icon: Blocks,
    color: "from-violet-500 to-purple-500",
    capabilities: ["Smart Contracts", "DeFi Protocols", "Tokenization", "DAO Governance", "Supply Chain Tracking"],
    projects: 32,
  },
  {
    title: "Climate & Green Technology",
    description: "Accelerating the transition to a sustainable future through strategic innovation and clean tech.",
    icon: Orbit,
    color: "from-emerald-500 to-teal-500",
    capabilities: ["Carbon Capture", "Renewable Energy", "Circular Economy", "Green Building", "Sustainable Mobility"],
    projects: 28,
  },
  {
    title: "Space & Defense Technology",
    description: "Pioneering next-generation capabilities for the space economy and strategic defense.",
    icon: Rocket,
    color: "from-amber-500 to-orange-500",
    capabilities: ["Satellite Systems", "Space Mining", "Hypersonics", "Defense AI", "Remote Sensing"],
    projects: 19,
  },
  {
    title: "Quantum Computing",
    description: "Harnessing quantum mechanics to solve previously intractable strategic and operational problems.",
    icon: Cpu,
    color: "from-rose-500 to-pink-500",
    capabilities: ["Quantum Algorithms", "Cryptography", "Optimization", "Simulation", "Quantum Sensors"],
    projects: 15,
  },
  {
    title: "Biotechnology & Health",
    description: "Transforming healthcare through strategic investment in biotech innovation and digital health.",
    icon: Microscope,
    color: "from-indigo-500 to-blue-500",
    capabilities: ["Precision Medicine", "Digital Therapeutics", "Bioinformatics", "Wearable Tech", "Telemedicine"],
    projects: 23,
  },
]

const researchInitiatives = [
  {
    title: "Future of Strategy Report",
    description: "Annual flagship research publication exploring emerging trends and their impact on global strategy.",
    status: "Latest Edition",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Innovation Readiness Index",
    description: "Comprehensive framework measuring organizational innovation capacity across industries.",
    status: "Q2 2026",
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Global Technology Foresight",
    description: "Identifying and analyzing breakthrough technologies with the potential to reshape industries.",
    status: "Ongoing",
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Strategic AI Governance",
    description: "Developing frameworks for responsible AI adoption in enterprise strategy and operations.",
    status: "In Progress",
    color: "from-amber-500 to-orange-500",
  },
]

const collaborators = [
  { name: "MIT Strategy Lab", type: "Academic" },
  { name: "Oxford Future Institute", type: "Research" },
  { name: "Stanford Center for Design", type: "Academic" },
  { name: "World Economic Forum", type: "Institutional" },
  { name: "UN Technology Initiative", type: "Institutional" },
  { name: "DARPA Innovation Hub", type: "Government" },
]

export default function InnovationPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary backdrop-blur-sm">
              Innovation Ecosystem
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-white/90">Where strategy meets</span>
              <GradientText from="from-blue-400" via="via-violet-400" to="to-cyan-300">
                breakthrough innovation
              </GradientText>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
              Our innovation ecosystem brings together researchers, technologists, and strategists
              to explore, develop, and deploy cutting-edge solutions for the world&apos;s most
              complex challenges.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="relative border-y border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 text-center sm:grid-cols-4"
          >
            {[
              { value: "160+", label: "Active Research Projects" },
              { value: "45+", label: "Innovation Areas" },
              { value: "300+", label: "Research Publications" },
              { value: "50+", label: "Technology Partners" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={staggerItem}>
                <div className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Innovation Areas */}
      <section className="relative bg-background pb-16 pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Focus Areas
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Innovation focus areas
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-900">
              Six strategic domains where we are driving the most impactful innovation.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 lg:grid-cols-2"
          >
            {innovationAreas.map((area) => {
              const Icon = area.icon
              return (
                <motion.div key={area.title} variants={staggerItem}>
                  <GlassCard hover className="group overflow-hidden p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                          area.color
                        )}
                      >
                        <Icon size={28} className="text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-semibold text-black">{area.title}</h3>
                          <Badge className="shrink-0 border-0 bg-white/5 text-xs text-gray-500">
                            {area.projects} projects
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-gray-700">{area.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {area.capabilities.map((cap) => (
                            <Badge
                              key={cap}
                              variant="outline"
                              className="border-gray-200 bg-gray-50 text-xs text-gray-600"
                            >
                              {cap}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Research Initiatives */}
      <section className="relative bg-background pb-16 pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Research
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Active research initiatives
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-900">
              Groundbreaking research projects that push the boundaries of strategic innovation.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {researchInitiatives.map((initiative) => (
              <motion.div key={initiative.title} variants={staggerItem}>
                <GlassCard hover className="group p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge
                      className={cn(
                        "border-0 bg-gradient-to-r text-white",
                        initiative.color
                      )}
                    >
                      {initiative.status}
                    </Badge>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-black">{initiative.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-700">{initiative.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                    Learn more <ArrowRight size={14} />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Collaborators */}
      <section className="relative bg-background pb-20 pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-10 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Research Network
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
              Our research collaborators
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-900">
              Working with world-class institutions to advance strategic innovation.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {collaborators.map((collab) => (
              <motion.div key={collab.name} variants={staggerItem}>
                <GlassCard className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FlaskConical size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-black">{collab.name}</h4>
                    <p className="text-xs text-gray-500">{collab.type}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
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
              Collaborate
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <GradientText from="from-white" via="via-blue-200" to="to-cyan-200">
                Shape the future of innovation
              </GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Join our innovation ecosystem and collaborate on groundbreaking research and technology
              development.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="mt-8">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact">
                <Button className="h-12 rounded-full bg-primary px-8 text-base font-medium text-primary-fg shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105">
                  Propose a collaboration <ArrowUpRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/research">
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105"
                >
                  View research <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
