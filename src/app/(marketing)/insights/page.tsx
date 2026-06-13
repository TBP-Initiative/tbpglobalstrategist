"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  FileText,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Globe,
  Lightbulb,
  BarChart3,
  Mail,
  Check,
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

const categories = [
  "All Insights",
  "Strategy",
  "Technology",
  "Innovation",
  "Sustainability",
  "Leadership",
  "Markets",
  "Governance",
]

const featuredInsights = [
  {
    title: "The Strategic Imperative of Generative AI",
    excerpt: "How forward-thinking enterprises are embedding generative AI into their strategic planning and decision-making processes.",
    author: "Dr. Elena Voss",
    date: "May 15, 2026",
    readTime: "8 min read",
    category: "Technology",
    color: "from-blue-500 to-cyan-500",
    featured: true,
  },
  {
    title: "Navigating the Polycrisis: A Strategic Framework",
    excerpt: "A comprehensive approach to strategy in an era of simultaneous economic, geopolitical, and environmental disruptions.",
    author: "Alexander Thorne",
    date: "May 8, 2026",
    readTime: "12 min read",
    category: "Strategy",
    color: "from-violet-500 to-purple-500",
    featured: true,
  },
  {
    title: "The Rise of Sovereign AI: Strategic Implications",
    excerpt: "Analysis of how nations are racing to build independent AI capabilities and what this means for global business.",
    author: "Dr. Sarah Mitchell",
    date: "April 28, 2026",
    readTime: "10 min read",
    category: "Technology",
    color: "from-emerald-500 to-teal-500",
    featured: true,
  },
]

const articles = [
  {
    title: "ESG as a Competitive Advantage",
    excerpt: "Why leading companies are treating sustainability as a core strategic driver rather than a compliance requirement.",
    author: "Priya Sharma",
    date: "May 20, 2026",
    readTime: "6 min read",
    category: "Sustainability",
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "The Future of Work: Strategic Talent Architecture",
    excerpt: "Redesigning organizational structures and talent strategies for the age of distributed intelligence.",
    author: "Michael Chang",
    date: "May 18, 2026",
    readTime: "7 min read",
    category: "Leadership",
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Quantum Computing: A Strategic Roadmap",
    excerpt: "Understanding the timeline, applications, and strategic implications of quantum advantage.",
    author: "Dr. Hiroshi Nakamura",
    date: "May 12, 2026",
    readTime: "9 min read",
    category: "Technology",
    color: "from-rose-500 to-pink-500",
  },
  {
    title: "Geopolitical Strategy for Global Enterprises",
    excerpt: "How multinational corporations are building geopolitical intelligence capabilities to navigate rising tensions.",
    author: "Robert Kensington",
    date: "May 5, 2026",
    readTime: "11 min read",
    category: "Markets",
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "Innovation Portfolio Management",
    excerpt: "A strategic approach to balancing incremental innovation with breakthrough and transformational initiatives.",
    author: "Dr. Elena Vasquez",
    date: "April 30, 2026",
    readTime: "7 min read",
    category: "Innovation",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Board-Level Strategy in the AI Era",
    excerpt: "How corporate boards are evolving their governance frameworks to address AI-driven opportunities and risks.",
    author: "James Whitfield",
    date: "April 22, 2026",
    readTime: "8 min read",
    category: "Governance",
    color: "from-violet-500 to-purple-500",
  },
]

export default function InsightsPage() {
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
              Insights &amp; Publications
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-white/90">Ideas that</span>
              <GradientText from="from-blue-400" via="via-violet-400" to="to-cyan-300">
                shape strategy
              </GradientText>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
              Thought leadership, analysis, and perspectives from the world leading strategic minds
              on the forces reshaping business and society.
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
              { value: "500+", label: "Articles Published" },
              { value: "200+", label: "Contributors" },
              { value: "50K+", label: "Monthly Readers" },
              { value: "15+", label: "Languages" },
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
          <AnimatedSection className="mb-12">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                  Featured
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  <GradientText from="from-white" via="via-blue-200" to="to-white/60">
                    Featured insights
                  </GradientText>
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={cat === "All Insights" ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-3 py-1.5 text-xs transition-all",
                      cat === "All Insights"
                        ? "bg-primary text-primary-fg"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    )}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Featured */}
          {featuredInsights.map((insight, i) => (
            <AnimatedSection key={insight.title} delay={i * 0.1} className="mb-6 last:mb-0">
              <GlassCard
                hover
                className={cn(
                  "group relative overflow-hidden p-0",
                  i === 0 && "lg:col-span-2 lg:row-span-2"
                )}
              >
                <div className="grid md:grid-cols-5">
                  <div className={cn(
                    "hidden md:flex md:col-span-2 items-center justify-center bg-gradient-to-br",
                    insight.color
                  )}>
                    <FileText size={48} className="text-white/30" />
                  </div>
                  <div className="p-6 md:col-span-3">
                    <div className="mb-3 flex items-center gap-3">
                      <Badge
                        className={cn(
                          "border-0 bg-gradient-to-r text-white text-xs",
                          insight.color
                        )}
                      >
                        {insight.category}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <Clock size={12} /> {insight.readTime}
                      </span>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-white">{insight.title}</h3>
                    <p className="text-sm leading-relaxed text-white/50">{insight.excerpt}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <User size={12} /> {insight.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {insight.date}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Read article <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="relative border-y border-white/5 bg-black/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  <GradientText from="from-white" via="via-violet-200" to="to-white/60">
                    Latest articles
                  </GradientText>
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  Explore our latest thinking on strategy, innovation, and leadership.
                </p>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  placeholder="Search articles..."
                  className="w-56 rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
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
            {articles.map((article) => (
              <motion.div key={article.title} variants={staggerItem}>
                <GlassCard hover className="group relative overflow-hidden p-6">
                  <div
                    className={cn(
                      "absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-5 blur-2xl transition-all duration-500 group-hover:opacity-10",
                      `bg-gradient-to-br ${article.color}`
                    )}
                  />
                  <div className="relative z-10">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge
                        className={cn(
                          "border-0 bg-gradient-to-r text-white text-xs",
                          article.color
                        )}
                      >
                        {article.category}
                      </Badge>
                      <span className="text-xs text-white/40">{article.readTime}</span>
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-white">{article.title}</h3>
                    <p className="text-sm leading-relaxed text-white/50">{article.excerpt}</p>
                    <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <User size={12} /> {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {article.date}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Read more <ArrowRight size={14} />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection className="mt-10 text-center" delay={0.3}>
            <Button variant="outline" className="rounded-full border-white/20 bg-white/5 px-8 text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30">
              Load more articles <ArrowRight size={14} className="ml-2" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <AnimatedSection>
              <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                Newsletter
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                <GradientText from="from-white" via="via-blue-200" to="to-white/60">
                  Stay ahead of the curve
                </GradientText>
              </h2>
              <p className="mt-4 text-white/50 leading-relaxed">
                Subscribe to the TBP Strategic Brief — your weekly digest of the most important
                ideas and insights shaping global strategy.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  "Weekly curated insights from our research team",
                  "Early access to flagship reports and white papers",
                  "Exclusive invitations to webinars and events",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <Check size={12} />
                    </div>
                    <span className="text-sm text-white/60">{benefit}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <GlassCard className="p-6 sm:p-8">
                <h3 className="mb-1 text-xl font-semibold text-white">Subscribe to our newsletter</h3>
                <p className="mb-6 text-sm text-white/50">
                  No spam, unsubscribe at any time.
                </p>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="n-name" className="block text-xs font-medium text-white/60 mb-1.5">Name</label>
                    <input id="n-name" placeholder="Your name" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label htmlFor="n-email" className="block text-xs font-medium text-white/60 mb-1.5">Email Address</label>
                    <input id="n-email" type="email" placeholder="you@example.com" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label htmlFor="n-interests" className="block text-xs font-medium text-white/60 mb-1.5">Areas of Interest</label>
                    <select id="n-interests" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30">
                      <option value="" className="bg-black">Select your interests</option>
                      <option value="all" className="bg-black">All Topics</option>
                      <option value="strategy" className="bg-black">Strategy</option>
                      <option value="technology" className="bg-black">Technology</option>
                      <option value="innovation" className="bg-black">Innovation</option>
                      <option value="sustainability" className="bg-black">Sustainability</option>
                      <option value="leadership" className="bg-black">Leadership</option>
                    </select>
                  </div>
                  <Button className="w-full rounded-xl bg-primary py-6 text-base font-medium text-primary-fg shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01]">
                    <Mail size={16} className="mr-2" />
                    Subscribe to Newsletter
                  </Button>
                </form>
              </GlassCard>
            </AnimatedSection>
          </div>
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
                Share your perspective
              </GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              We welcome contributions from strategists, academics, and business leaders. Share
              your insights with our global audience.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="mt-8">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact">
                <Button className="h-12 rounded-full bg-primary px-8 text-base font-medium text-primary-fg shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105">
                  Write for us <ArrowUpRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/research">
                <Button variant="outline" className="h-12 rounded-full border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105">
                  Browse research <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
