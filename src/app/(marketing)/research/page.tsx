"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  FileText,
  Search,
  Download,
  Filter,
  BarChart3,
  Lightbulb,
  TrendingUp,
  Globe,
  Users,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  FlaskConical,
  Microscope,
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

const researchCategories = [
  {
    title: "Strategic Foresight",
    description: "Long-term trend analysis, scenario planning, and future-of-industry research.",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
    count: 45,
  },
  {
    title: "Innovation & Technology",
    description: "Deep dives into emerging technologies and their strategic implications.",
    icon: Lightbulb,
    color: "from-violet-500 to-purple-500",
    count: 62,
  },
  {
    title: "Market Intelligence",
    description: "Comprehensive market analysis, competitive landscapes, and opportunity mapping.",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-500",
    count: 38,
  },
  {
    title: "Policy & Governance",
    description: "Research on regulatory trends, governance frameworks, and policy implications.",
    icon: Globe,
    color: "from-amber-500 to-orange-500",
    count: 27,
  },
  {
    title: "Organizational Strategy",
    description: "Studies on organizational design, change management, and operational excellence.",
    icon: Users,
    color: "from-rose-500 to-pink-500",
    count: 33,
  },
  {
    title: "Sustainability & ESG",
    description: "Research on sustainable business practices, ESG frameworks, and impact measurement.",
    icon: Sparkles,
    color: "from-indigo-500 to-blue-500",
    count: 29,
  },
]

const publications = [
  {
    title: "The Future of Global Strategy 2026",
    description: "Annual flagship report analyzing key trends shaping the strategic landscape across industries.",
    type: "Flagship Report",
    date: "January 2026",
    pages: 184,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "AI in Enterprise Strategy",
    description: "How artificial intelligence is transforming strategic decision-making in global enterprises.",
    type: "Research Paper",
    date: "March 2026",
    pages: 72,
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Sustainability as Strategy",
    description: "Integrating ESG principles into core business strategy for competitive advantage.",
    type: "White Paper",
    date: "February 2026",
    pages: 56,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Emerging Markets Outlook",
    description: "Strategic opportunities and risks in high-growth markets across Africa, Asia, and Latin America.",
    type: "Market Report",
    date: "April 2026",
    pages: 96,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "The Innovation Readiness Index",
    description: "A comprehensive framework for measuring and improving organizational innovation capacity.",
    type: "Framework",
    date: "December 2025",
    pages: 120,
    color: "from-rose-500 to-pink-500",
  },
  {
    title: "Global Talent Strategy",
    description: "Strategic approaches to talent acquisition, development, and retention in a distributed world.",
    type: "Research Paper",
    date: "November 2025",
    pages: 64,
    color: "from-indigo-500 to-blue-500",
  },
]

const tools = [
  {
    title: "Strategy Maturity Assessment",
    description: "Evaluate your organization strategic capabilities across 12 dimensions.",
    icon: BarChart3,
  },
  {
    title: "Innovation Foresight Scanner",
    description: "Identify emerging technologies and trends relevant to your industry.",
    icon: Microscope,
  },
  {
    title: "Competitive Intelligence Dashboard",
    description: "Real-time monitoring of competitive landscapes and market dynamics.",
    icon: TrendingUp,
  },
  {
    title: "ESG Impact Analyzer",
    description: "Measure and optimize your environmental, social, and governance performance.",
    icon: Sparkles,
  },
]

export default function ResearchPage() {
  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-violet-500/20 rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary backdrop-blur-sm">
              Research Hub
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-white/90">Knowledge that</span>
              <GradientText from="from-blue-400" via="via-violet-400" to="to-cyan-300">
                powers strategy
              </GradientText>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
              Our research hub delivers cutting-edge insights, proprietary frameworks, and
              actionable intelligence to help you make better strategic decisions.
            </p>
          </AnimatedSection>
        </div>
      </section>

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
              { value: "300+", label: "Publications" },
              { value: "50+", label: "Research Partners" },
              { value: "12", label: "Research Areas" },
              { value: "2M+", label: "Downloads Worldwide" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={staggerItem}>
                <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Categories
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <GradientText from="from-white" via="via-blue-200" to="to-white/60">
                Research categories
              </GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/50">
              Explore our research organized across six strategic domains.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {researchCategories.map((category) => {
              const Icon = category.icon
              return (
                <motion.div key={category.title} variants={staggerItem}>
                  <GlassCard hover className="group p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                          category.color
                        )}
                      >
                        <Icon size={22} className="text-white" />
                      </div>
                      <Badge variant="outline" className="border-white/10 bg-white/5 text-xs text-white/50">
                        {category.count} papers
                      </Badge>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">{category.title}</h3>
                    <p className="text-sm leading-relaxed text-white/50">{category.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Browse research <ArrowRight size={14} />
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <section className="relative border-y border-white/5 bg-black/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                  Publications
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  <GradientText from="from-white" via="via-violet-200" to="to-white/60">
                    Latest publications
                  </GradientText>
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    placeholder="Search publications..."
                    className="w-56 rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <Button variant="outline" size="sm" className="border-white/10 text-white/60">
                  <Filter size={14} className="mr-1" /> Filter
                </Button>
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
            {publications.map((pub) => (
              <motion.div key={pub.title} variants={staggerItem}>
                <GlassCard hover className="group relative overflow-hidden p-6">
                  <div
                    className={cn(
                      "absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-5 blur-2xl transition-all duration-500 group-hover:opacity-10",
                      `bg-gradient-to-br ${pub.color}`
                    )}
                  />
                  <div className="relative z-10">
                    <Badge
                      className={cn(
                        "mb-3 border-0 bg-gradient-to-r text-white text-xs",
                        pub.color
                      )}
                    >
                      {pub.type}
                    </Badge>
                    <h3 className="mb-2 text-base font-semibold text-white">{pub.title}</h3>
                    <p className="text-sm leading-relaxed text-white/50">{pub.description}</p>
                    <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-4 text-xs text-white/40">
                      <span>{pub.date}</span>
                      <span>{pub.pages} pages</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <Button size="sm" className="rounded-lg bg-primary/20 text-xs text-primary hover:bg-primary/30">
                        <FileText size={12} className="mr-1" /> Read
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-lg border-white/10 text-xs text-white/50">
                        <Download size={12} className="mr-1" /> PDF
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection className="mt-10 text-center" delay={0.3}>
            <Button variant="outline" className="rounded-full border-white/20 bg-white/5 px-8 text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30">
              View all publications <ArrowRight size={14} className="ml-2" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Research Tools
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <GradientText from="from-white" via="via-emerald-200" to="to-white/60">
                Strategic intelligence tools
              </GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/50">
              Proprietary tools and frameworks designed to give you a strategic edge.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <motion.div key={tool.title} variants={staggerItem}>
                  <GlassCard hover className="group flex items-start gap-4 p-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-white">{tool.title}</h3>
                      <p className="text-sm text-white/50">{tool.description}</p>
                      <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Access tool <ArrowRight size={14} />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary backdrop-blur-sm">
              Contribute
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <GradientText from="from-white" via="via-blue-200" to="to-cyan-200">
                Submit your research
              </GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              We welcome contributions from researchers, academics, and practitioners. Share your
              insights with our global community of strategists.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="mt-8">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact">
                <Button className="h-12 rounded-full bg-primary px-8 text-base font-medium text-primary-fg shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105">
                  Submit your research <ArrowUpRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="h-12 rounded-full border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105">
                  Contact research team <ChevronRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
