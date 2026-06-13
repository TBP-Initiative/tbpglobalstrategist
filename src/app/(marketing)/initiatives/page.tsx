"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import {
  ArrowRight,
  Globe,
  TrendingUp,
  Handshake,
  Sparkles,
  Heart,
  BookOpen,
  Users,
  Shield,
  Lightbulb,
  TreePine,
  GraduationCap,
  ChevronRight,
  ArrowUpRight,
  Target,
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

const initiatives = [
  {
    title: "TBP 2030 Vision",
    description: "A comprehensive decade-long initiative to reshape global strategic collaboration through technology, policy, and human capital development across 50+ countries.",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
    category: "Strategic Vision",
    impact: "50+ countries",
    strategists: 200,
    href: "#",
  },
  {
    title: "Strategist Without Borders",
    description: "Deploying elite strategic talent to underserved regions to drive economic development, institutional capacity building, and sustainable growth.",
    icon: Globe,
    color: "from-emerald-500 to-teal-500",
    category: "Development",
    impact: "200+ missions",
    strategists: 150,
    href: "#",
  },
  {
    title: "Global Innovation Alliance",
    description: "A cross-sector partnership network of 150+ organizations accelerating breakthrough innovations from laboratory to market readiness.",
    icon: Handshake,
    color: "from-violet-500 to-purple-500",
    category: "Partnership",
    impact: "150+ partners",
    strategists: 300,
    href: "#",
  },
  {
    title: "Future Leaders Program",
    description: "Identifying, mentoring, and empowering the next generation of strategic leaders across emerging markets and underrepresented regions.",
    icon: Sparkles,
    color: "from-amber-500 to-orange-500",
    category: "Education",
    impact: "1,000+ alumni",
    strategists: 85,
    href: "#",
  },
  {
    title: "Sustainable Futures Fund",
    description: "A strategic investment initiative supporting high-impact sustainability projects in developing economies.",
    icon: TreePine,
    color: "from-emerald-500 to-green-500",
    category: "Sustainability",
    impact: "$50M deployed",
    strategists: 45,
    href: "#",
  },
  {
    title: "Digital Equity Initiative",
    description: "Bridging the digital divide through strategic infrastructure investment, policy advocacy, and capability building.",
    icon: Shield,
    color: "from-indigo-500 to-blue-500",
    category: "Technology Access",
    impact: "5M+ beneficiaries",
    strategists: 120,
    href: "#",
  },
  {
    title: "Healthcare Access Alliance",
    description: "Strategic partnership improving healthcare delivery and access in underserved communities through innovation and capacity building.",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    category: "Healthcare",
    impact: "3M patients served",
    strategists: 95,
    href: "#",
  },
  {
    title: "Knowledge for All",
    description: "Open-access research platform democratizing strategic knowledge for policymakers, entrepreneurs, and academics worldwide.",
    icon: BookOpen,
    color: "from-cyan-500 to-teal-500",
    category: "Education",
    impact: "10M+ downloads",
    strategists: 60,
    href: "#",
  },
]

const categories = [
  { label: "All Initiatives", value: "all", count: initiatives.length },
  { label: "Strategic Vision", value: "Strategic Vision", count: 1 },
  { label: "Development", value: "Development", count: 1 },
  { label: "Partnership", value: "Partnership", count: 1 },
  { label: "Education", value: "Education", count: 2 },
  { label: "Sustainability", value: "Sustainability", count: 1 },
  { label: "Healthcare", value: "Healthcare", count: 1 },
  { label: "Technology Access", value: "Technology Access", count: 1 },
]

const impactStats = [
  { value: "15+", label: "Active Initiatives" },
  { value: "64", label: "Countries Reached" },
  { value: "1,200+", label: "Strategists Deployed" },
  { value: "$120M+", label: "Investment Mobilized" },
  { value: "20M+", label: "Lives Impacted" },
]

export default function InitiativesPage() {
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
              Global Initiatives
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-white/90">Driving impact</span>
              <GradientText from="from-blue-400" via="via-emerald-400" to="to-cyan-300">
                across the globe
              </GradientText>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
              Our initiatives combine strategic expertise with a deep commitment to creating positive,
              measurable impact in communities and ecosystems around the world.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="relative border-y border-white/5 bg-black/40 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 text-center sm:grid-cols-5"
          >
            {impactStats.map((stat) => (
              <motion.div key={stat.label} variants={staggerItem}>
                <div className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Initiatives Grid */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                  Active Initiatives
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  <GradientText from="from-white" via="via-blue-200" to="to-white/60">
                    Making a difference
                  </GradientText>
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 5).map((cat) => (
                  <Badge
                    key={cat.value}
                    variant={cat.value === "all" ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-3 py-1.5 text-xs transition-all",
                      cat.value === "all"
                        ? "bg-primary text-primary-fg"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    )}
                  >
                    {cat.label}
                    <span className="ml-1 opacity-60">({cat.count})</span>
                  </Badge>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {initiatives.map((initiative) => {
              const Icon = initiative.icon
              return (
                <motion.div key={initiative.title} variants={staggerItem}>
                  <Link href={initiative.href}>
                    <GlassCard hover className="group relative h-full overflow-hidden p-6">
                      <div
                        className={cn(
                          "absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-5 blur-2xl transition-all duration-500 group-hover:opacity-15",
                          `bg-gradient-to-br ${initiative.color}`
                        )}
                      />
                      <div className="relative z-10 flex h-full flex-col">
                        <div className="mb-3 flex items-start justify-between">
                          <div
                            className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                              initiative.color
                            )}
                          >
                            <Icon size={22} className="text-white" />
                          </div>
                          <Badge
                            variant="outline"
                            className="border-white/10 bg-white/5 text-xs text-white/50"
                          >
                            {initiative.category}
                          </Badge>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-white">{initiative.title}</h3>
                        <p className="flex-1 text-sm leading-relaxed text-white/50">
                          {initiative.description}
                        </p>
                        <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-4 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <Target size={12} /> {initiative.impact}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={12} /> {initiative.strategists} strategists
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="relative border-y border-white/5 bg-black/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <AnimatedSection>
              <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                Get Involved
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                <GradientText from="from-white" via="via-violet-200" to="to-white/60">
                  Join a global movement
                </GradientText>
              </h2>
              <p className="mt-4 text-white/50 leading-relaxed">
                Our initiatives are powered by passionate strategists, organizations, and partners.
                There are many ways to contribute your expertise and make a difference.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  {
                    title: "Volunteer Your Expertise",
                    desc: "Contribute your strategic skills to high-impact projects in developing regions.",
                    icon: Users,
                  },
                  {
                    title: "Sponsor an Initiative",
                    desc: "Partner with us to fund and scale initiatives aligned with your mission.",
                    icon: Handshake,
                  },
                  {
                    title: "Propose a New Initiative",
                    desc: "Have an idea for global impact? We want to hear from you.",
                    icon: Lightbulb,
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                        <p className="text-xs text-white/40">{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <GlassCard className="p-6 sm:p-8">
                <h3 className="mb-1 text-xl font-semibold text-white">Express your interest</h3>
                <p className="mb-6 text-sm text-white/50">
                  Fill out this form and our initiatives team will reach out within 48 hours.
                </p>
                <form className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="gi-name" className="block text-xs font-medium text-white/60 mb-1.5">
                        Full Name
                      </label>
                      <input
                        id="gi-name"
                        placeholder="Your name"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label htmlFor="gi-email" className="block text-xs font-medium text-white/60 mb-1.5">
                        Email
                      </label>
                      <input
                        id="gi-email"
                        type="email"
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="gi-interest" className="block text-xs font-medium text-white/60 mb-1.5">
                      Area of Interest
                    </label>
                    <select
                      id="gi-interest"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    >
                      <option value="" className="bg-black">Select an area</option>
                      <option value="volunteer" className="bg-black">Volunteer Expertise</option>
                      <option value="sponsor" className="bg-black">Sponsor an Initiative</option>
                      <option value="propose" className="bg-black">Propose a New Initiative</option>
                      <option value="partner" className="bg-black">Partnership Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="gi-message" className="block text-xs font-medium text-white/60 mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="gi-message"
                      rows={4}
                      placeholder="Tell us about your interest and background..."
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                    />
                  </div>
                  <Button className="w-full rounded-xl bg-primary py-6 text-base font-medium text-primary-fg shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01]">
                    <ArrowUpRight size={16} className="mr-2" />
                    Submit Interest
                  </Button>
                </form>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary backdrop-blur-sm">
              Be the Change
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <GradientText from="from-white" via="via-blue-200" to="to-cyan-200">
                Your expertise can change the world
              </GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Every great initiative starts with a single person who decides to make a difference.
              That person could be you.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="mt-8">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button className="h-12 rounded-full bg-primary px-8 text-base font-medium text-primary-fg shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105">
                  Join an initiative <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105"
                >
                  Talk to our team <ChevronRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
