"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import {
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Star,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  Play,
  Award,
  Globe,
  Building2,
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

const upcomingEvents = [
  {
    title: "TBP Global Strategy Summit 2026",
    description: "The premier gathering of global strategists, industry leaders, and innovators shaping the future of business.",
    date: "September 14&#8211;16, 2026",
    location: "London, UK",
    type: "Flagship Event",
    attendees: 2500,
    color: "from-blue-500 to-cyan-500",
    href: "#",
  },
  {
    title: "Innovation Leaders Forum",
    description: "An intimate executive roundtable exploring breakthrough strategies in AI, sustainability, and organizational transformation.",
    date: "June 8&#8211;9, 2026",
    location: "Zurich, Switzerland",
    type: "Executive Forum",
    attendees: 200,
    color: "from-violet-500 to-purple-500",
    href: "#",
  },
  {
    title: "Emerging Markets Symposium",
    description: "Strategic insights and networking opportunities focused on high-growth markets across Africa, Asia, and Latin America.",
    date: "October 22&#8211;23, 2026",
    location: "Singapore",
    type: "Symposium",
    attendees: 600,
    color: "from-emerald-500 to-teal-500",
    href: "#",
  },
  {
    title: "Digital Transformation Summit",
    description: "Exploring the intersection of technology and strategy in driving enterprise-wide digital evolution.",
    date: "November 5&#8211;6, 2026",
    location: "New York, USA",
    type: "Summit",
    attendees: 800,
    color: "from-amber-500 to-orange-500",
    href: "#",
  },
]

const pastSummitHighlights = [
  {
    title: "TBP Summit 2025",
    description: "Over 2,000 attendees from 60+ countries gathered in London for our most successful summit yet.",
    year: "2025",
    stats: "2,000+ attendees",
  },
  {
    title: "TBP Summit 2024",
    description: "Launched the Global Innovation Alliance with 100+ founding partner organizations.",
    year: "2024",
    stats: "100+ partners",
  },
  {
    title: "TBP Summit 2023",
    description: "Theme of Resilient Strategy with keynote speeches from world leaders and Fortune 500 CEOs.",
    year: "2023",
    stats: "1,500+ attendees",
  },
]

const speakers = [
  { name: "Dr. Amara Obi", title: "Former UN Deputy Secretary-General", initials: "AO", color: "from-blue-500 to-cyan-500" },
  { name: "James Whitfield", title: "CEO, GlobalTech Industries", initials: "JW", color: "from-violet-500 to-purple-500" },
  { name: "Professor Ling Wei", title: "Director, Oxford Strategy Institute", initials: "LW", color: "from-emerald-500 to-teal-500" },
  { name: "Carlos Mendes", title: "Chief Innovation Officer, World Bank", initials: "CM", color: "from-amber-500 to-orange-500" },
  { name: "Sarah Al-Rashid", title: "Founder &amp; CEO, Nova Ventures", initials: "SA", color: "from-rose-500 to-pink-500" },
  { name: "Dr. Hiroshi Nakamura", title: "Head of AI Research, Tokyo Institute", initials: "HN", color: "from-indigo-500 to-blue-500" },
]

export default function SummitPage() {
  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-500/20 rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary backdrop-blur-sm">
              Summit &amp; Events
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-white/90">Where leaders</span>
              <GradientText from="from-blue-400" via="via-amber-400" to="to-cyan-300">
                convene and inspire
              </GradientText>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
              From our flagship Global Strategy Summit to exclusive executive forums, our events bring
              together the brightest minds in strategy, innovation, and leadership.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative bg-background py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              2026 Calendar
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Upcoming events
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-900">
              Mark your calendar for our flagship events and exclusive gatherings.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 lg:grid-cols-2"
          >
            {upcomingEvents.map((event) => (
              <motion.div key={event.title} variants={staggerItem}>
                <Link href={event.href}>
                  <GlassCard hover className="group relative overflow-hidden p-6">
                    <div
                      className={cn(
                        "absolute top-0 right-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full opacity-5 blur-3xl transition-all duration-500 group-hover:opacity-10",
                        `bg-gradient-to-br ${event.color}`
                      )}
                    />
                    <div className="relative z-10">
                      <div className="mb-4 flex items-start justify-between">
                        <Badge
                          className={cn(
                            "border-0 bg-gradient-to-r text-white",
                            event.color
                          )}
                        >
                          <Star size={10} className="mr-1" />
                          {event.type}
                        </Badge>
                        <Badge variant="outline" className="border-gray-200 bg-gray-50 text-xs text-gray-600">
                          <Users size={10} className="mr-1" />
                          {event.attendees.toLocaleString()}
                        </Badge>
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-black">{event.title}</h3>
                      <p className="text-sm leading-relaxed text-gray-700">{event.description}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-primary/60" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-primary/60" />
                          {event.location}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                        Learn more <ArrowRight size={14} />
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative bg-background pb-24 pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Past Editions
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Summit highlights
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-900">
              Reliving the moments that defined our previous gatherings.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-3"
          >
            {pastSummitHighlights.map((highlight) => (
              <motion.div key={highlight.year} variants={staggerItem}>
                <GlassCard hover className="group overflow-hidden p-0">
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-cyan-900/30">
                    <div className="text-center">
                      <Play size={32} className="mx-auto text-white/20 transition-colors group-hover:text-white/40" />
                      <p className="mt-2 text-xs text-white/30">{highlight.year} Recap</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1 text-lg font-semibold text-black">{highlight.title}</h3>
                    <p className="text-sm text-gray-700">{highlight.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline" className="border-gray-200 bg-gray-50 text-xs text-gray-600">
                        {highlight.stats}
                      </Badge>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative bg-background pb-16 pt-12">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Featured Speakers
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Past &amp; upcoming speakers
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-900">
              Visionary leaders who have graced our stages and shared their strategic insights.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {speakers.map((speaker) => (
              <motion.div key={speaker.name} variants={staggerItem}>
                <GlassCard hover className="group p-6 text-center">
                  <div className="mx-auto mb-6 flex h-44 w-44 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/20 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                    <span className="text-4xl font-bold text-white">
                      {speaker.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-black">{speaker.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{speaker.title}</p>
                  <div className="mt-4 flex justify-center">
                    <Badge variant="outline" className="border-gray-200 bg-gray-50 text-xs text-gray-600">
                      <Award size={10} className="mr-1" /> Keynote Speaker
                    </Badge>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection className="mt-10 text-center" delay={0.3}>
            <p className="text-sm text-gray-500">
              Speaker lineup for 2026 summit will be announced in Q2.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative bg-background pb-24 pt-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <AnimatedSection>
              <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                Register
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                Secure your spot
              </h2>
              <p className="mt-4 text-gray-900 leading-relaxed">
                Early bird registration is now open for the TBP Global Strategy Summit 2026.
                Join 2,500+ leaders, strategists, and innovators in London this September.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { title: "Full Access Pass", desc: "All sessions, workshops, networking events, and gala dinner", price: "$2,499" },
                  { title: "Executive Pass", desc: "Main summit, select workshops, and networking reception", price: "$1,799" },
                  { title: "Virtual Pass", desc: "Live stream access to all keynotes and panel discussions", price: "$499" },
                ].map((tier) => (
                  <div key={tier.title} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                    <div>
                      <h4 className="text-sm font-semibold text-black">{tier.title}</h4>
                      <p className="text-xs text-gray-500">{tier.desc}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{tier.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <GlassCard className="p-6 sm:p-8">
                <h3 className="mb-1 text-xl font-semibold text-black">Pre-register your interest</h3>
                <p className="mb-6 text-sm text-gray-500">
                  Receive priority notification when tickets go on sale for all 2026 events.
                </p>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="s-name" className="block text-xs font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input id="s-name" placeholder="Your name" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label htmlFor="s-email" className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input id="s-email" type="email" placeholder="you@example.com" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label htmlFor="s-event" className="block text-xs font-medium text-gray-700 mb-1.5">Event of Interest</label>
                    <select id="s-event" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30">
                      <option value="" className="bg-white">Select an event</option>
                      <option value="summit" className="bg-white">Global Strategy Summit 2026</option>
                      <option value="forum" className="bg-white">Innovation Leaders Forum</option>
                      <option value="symposium" className="bg-white">Emerging Markets Symposium</option>
                      <option value="digital" className="bg-white">Digital Transformation Summit</option>
                      <option value="all" className="bg-white">All Events</option>
                    </select>
                  </div>
                  <Button className="w-full rounded-xl bg-primary py-6 text-base font-medium text-primary-fg shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01]">
                    Pre-register <ArrowUpRight size={16} className="ml-2" />
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
              Join Us
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <GradientText from="from-white" via="via-blue-200" to="to-cyan-200">
                See you at the summit
              </GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Be part of the most important gathering of strategic minds in the world. Reserve your place today.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="mt-8">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button className="h-12 rounded-full bg-primary px-8 text-base font-medium text-primary-fg shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105">
                Register now <ArrowRight size={16} className="ml-2" />
              </Button>
              <Link href="/contact">
                <Button variant="outline" className="h-12 rounded-full border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105">
                  Sponsor inquiry <ChevronRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
