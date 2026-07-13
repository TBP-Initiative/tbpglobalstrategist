"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import {
  ArrowRight,
  Target,
  Eye,
  Heart,
  Shield,
  Lightbulb,
  Globe,
  Handshake,
  Users,
  Sparkles,
  ChevronRight,
  Quote,
  MapPin,
  Building2,
  Award,
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

const coreValues = [
  {
    title: "Strategic Excellence",
    description: "Uncompromising quality in every engagement, driven by rigorous analysis and creative thinking.",
    icon: Target,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Global Perspective",
    description: "Deep understanding of local markets combined with a truly global outlook and network.",
    icon: Globe,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Innovation First",
    description: "Pioneering new approaches to strategy, powered by cutting-edge research and technology.",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Integrity & Trust",
    description: "Building lasting relationships through transparency, ethics, and unwavering commitment.",
    icon: Shield,
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Collaborative Impact",
    description: "Harnessing collective intelligence to achieve outcomes greater than the sum of parts.",
    icon: Handshake,
    color: "from-rose-500 to-pink-500",
  },
  {
    title: "Human Centered",
    description: "Placing people at the heart of strategy, empowering leaders and communities alike.",
    icon: Heart,
    color: "from-indigo-500 to-blue-500",
  },
]

const timeline = [
  {
    year: "2015",
    title: "Foundation",
    description: "TBP Global Strategists was founded with a vision to revolutionize strategic consulting through collaborative intelligence.",
  },
  {
    year: "2017",
    title: "Global Expansion",
    description: "Opened offices in London, New York, and Singapore, establishing a truly global footprint.",
  },
  {
    year: "2019",
    title: "Innovation Lab Launch",
    description: "Launched the Innovation Hub, bringing together technologists, researchers, and strategists.",
  },
  {
    year: "2021",
    title: "Strategist Network",
    description: "Reached 1,000 elite strategists on the platform, spanning 50+ countries and 30 industries.",
  },
  {
    year: "2023",
    title: "Strategic Alliance",
    description: "Formed the Global Innovation Alliance with 150+ partner organizations worldwide.",
  },
  {
    year: "2025",
    title: "Next Horizon",
    description: "Launching next-generation AI-powered strategy tools and expanding into emerging frontiers.",
  },
]

const leadershipTeam = [
  { name: "Alexander Thorne", title: "CEO & Founder", initials: "AT", color: "from-blue-500 to-cyan-500" },
  { name: "Dr. Sarah Mitchell", title: "Chief Strategy Officer", initials: "SM", color: "from-violet-500 to-purple-500" },
  { name: "Robert Kensington", title: "Chief Innovation Officer", initials: "RK", color: "from-emerald-500 to-teal-500" },
  { name: "Priya Sharma", title: "Chief Operating Officer", initials: "PS", color: "from-amber-500 to-orange-500" },
  { name: "Michael Chang", title: "Head of Global Partnerships", initials: "MC", color: "from-rose-500 to-pink-500" },
  { name: "Dr. Elena Vasquez", title: "Director of Research", initials: "EV", color: "from-indigo-500 to-blue-500" },
]

const offices = [
  { city: "London", country: "United Kingdom", role: "Global Headquarters" },
  { city: "New York", country: "United States", role: "Americas Hub" },
  { city: "Singapore", country: "Singapore", role: "Asia-Pacific Hub" },
  { city: "Dubai", country: "UAE", role: "Middle East & Africa" },
  { city: "Zurich", country: "Switzerland", role: "European Operations" },
  { city: "Tokyo", country: "Japan", role: "East Asia Office" },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary backdrop-blur-sm">
              About TBP Global Strategists
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-white/90">Our mission is to</span>
              <GradientText from="from-blue-400" via="via-violet-400" to="to-cyan-300">
                transform global strategy
              </GradientText>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
              We believe the most complex challenges of our time require a new kind of strategic
              partnership — one that combines elite talent, cutting-edge research, and a commitment
              to meaningful, measurable impact.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="relative border-y border-gray-200 bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <AnimatedSection>
            <Quote size={32} className="mx-auto mb-6 text-primary/60" />
            <blockquote className="text-2xl font-medium leading-relaxed italic text-gray-900 sm:text-3xl">
              &ldquo;Strategy is not about predicting the future — it&apos;s about creating the
              conditions for a better one to emerge.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-gray-500">— Alexander Thorne, CEO & Founder</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative bg-background pb-12 pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-16 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Our Journey
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              The TBP story
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-900">
              From a bold vision to a global movement — the milestones that define our path.
            </p>
          </AnimatedSection>

          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent md:left-1/2 md:-translate-x-px" />
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <AnimatedSection
                  key={item.year}
                  direction={index % 2 === 0 ? "left" : "right"}
                  className={`relative pl-12 md:w-1/2 md:pl-0 ${
                    index % 2 === 0 ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"
                  }`}
                >
                  <div
                    className={cn(
                      "absolute left-4 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/30 bg-background md:left-auto",
                      index % 2 === 0 ? "md:right-[-1rem]" : "md:left-[-1rem]"
                    )}
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <Badge className="mb-2 border-0 bg-primary/20 text-xs text-primary">{item.year}</Badge>
                  <h3 className="mb-1 text-lg font-semibold text-black">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-700">{item.description}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative bg-background pb-16 pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Core Values
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              What we stand for
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-900">
              The principles that guide every engagement, partnership, and decision we make.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {coreValues.map((value) => {
              const Icon = value.icon
              return (
                <motion.div key={value.title} variants={staggerItem}>
                  <GlassCard hover className="group p-6">
                    <div
                      className={cn(
                        "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                        value.color
                      )}
                    >
                      <Icon size={22} className="text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-black">{value.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-700">{value.description}</p>
                  </GlassCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Leadership */}
      <section className="relative bg-background pb-16 pt-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Leadership
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Meet our leadership
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-900">
              Visionary leaders driving the future of global strategic collaboration.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {leadershipTeam.map((member) => (
              <motion.div key={member.name} variants={staggerItem}>
                <GlassCard hover className="p-8 text-center">
                  <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full ring-2 ring-white/20 shadow-lg">
                    <div
                      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-teal-500 text-white text-xl font-bold"
                    >
                      {member.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-black">{member.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{member.title}</p>
                  <div className="mt-4 flex justify-center gap-2">
                    <Badge variant="outline" className="border-gray-200 bg-gray-50 text-xs text-gray-600">
                      <Award size={10} className="mr-1" /> Executive
                    </Badge>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection className="mt-10 text-center" delay={0.3}>
            <Link href="/contact">
              <Button
                variant="outline"
                className="rounded-full border-gray-300 bg-white px-8 text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400"
              >
                Connect with leadership <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Global Presence */}
      <section className="relative bg-background pb-24 pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Global Presence
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Where we operate
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-900">
              Strategic hubs spanning six continents, providing local insight with global reach.
            </p>
          </AnimatedSection>

          {/* Map Placeholder */}
          <AnimatedSection>
            <GlassCard className="mb-12 overflow-hidden p-0">
              <div className="relative flex aspect-[21/9] items-center justify-center bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-cyan-900/30">
                <Globe size={64} className="text-white/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/60">Global Network Visualization</p>
                    <p className="mt-1 text-xs text-white/30">6 Offices · 64 Countries · Worldwide Coverage</p>
                  </div>
                </div>
                {/* Office markers */}
                {offices.map((office, i) => (
                  <div
                    key={office.city}
                    className="absolute flex items-center gap-2"
                    style={{
                      top: `${20 + i * 12}%`,
                      left: `${15 + i * 14}%`,
                    }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/80 shadow-lg shadow-primary/30">
                      <MapPin size={12} className="text-white" />
                    </div>
                    <div className="hidden rounded-lg bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm lg:block">
                      {office.city}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {offices.map((office) => (
              <motion.div key={office.city} variants={staggerItem}>
                <GlassCard className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-black">{office.city}</h4>
                    <p className="text-xs text-gray-500">
                      {office.country} · {office.role}
                    </p>
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
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary backdrop-blur-sm">
              Join Us
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <GradientText from="from-white" via="via-blue-200" to="to-cyan-200">
                Be part of something bigger
              </GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Whether you&apos;re a strategist looking for impact or an enterprise seeking transformation,
              we&apos;d love to hear from you.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="mt-8">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact">
                <Button className="h-12 rounded-full bg-primary px-8 text-base font-medium text-primary-fg shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105">
                  Get in touch <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/careers">
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105"
                >
                  View careers <ChevronRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
