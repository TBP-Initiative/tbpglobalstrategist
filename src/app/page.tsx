"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import {
  ArrowRight,
  Users,
  Building2,
  FolderKanban,
  Globe,
  Lightbulb,
  FlaskConical,
  Shield,
  Network,
  Cpu,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Asterisk,
  Hexagon,
  Triangle,
  CircleDot,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Rocket,
  BarChart3,
  Handshake,
  ScrollText,
  Blocks,
  Orbit,
} from "lucide-react"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { GradientText } from "@/components/shared/gradient-text"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function FloatingShape({
  className,
  delay = 0,
  duration = 20,
  Icon,
}: {
  className?: string
  delay?: number
  duration?: number
  Icon: React.ElementType
}) {
  return (
    <motion.div
      className={cn(
        "absolute text-white/5 dark:text-white/10",
        className
      )}
      animate={{
        y: [0, -30, 0, 20, 0],
        x: [0, 20, -20, 10, 0],
        rotate: [0, 10, -10, 5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <Icon size={48} />
    </motion.div>
  )
}

function ParallaxShape({ className, Icon }: { className?: string; Icon: React.ElementType }) {
  const ref = useRef<HTMLDivElement>(null)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrollY = window.scrollY
        const speed = 0.05
        setOffsetY(rect.top * speed)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offsetY}px)` }}
    >
      <Icon size={32} />
    </motion.div>
  )
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
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

const features = [
  {
    title: "Strategist Network",
    description: "Connect with elite strategists across industries and disciplines for collaborative problem-solving.",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
    href: "/strategists",
  },
  {
    title: "Innovation Hub",
    description: "Explore cutting-edge technologies and methodologies driving the next wave of global innovation.",
    icon: Lightbulb,
    gradient: "from-amber-500 to-orange-500",
    href: "/innovation",
  },
  {
    title: "Global Projects",
    description: "Lead and participate in high-impact strategic projects spanning continents and industries.",
    icon: FolderKanban,
    gradient: "from-emerald-500 to-teal-500",
    href: "/projects",
  },
  {
    title: "Research & Insights",
    description: "Access proprietary research, market intelligence, and strategic foresight reports.",
    icon: ScrollText,
    gradient: "from-rose-500 to-pink-500",
    href: "/research",
  },
  {
    title: "Strategic Governance",
    description: "Framework-driven governance models ensuring alignment, transparency, and measurable outcomes.",
    icon: Shield,
    gradient: "from-indigo-500 to-blue-500",
    href: "/about",
  },
]

const gradientColors = [
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-blue-500",
  "from-cyan-500 to-teal-500",
  "from-purple-500 to-pink-500",
  "from-teal-500 to-green-500",
  "from-orange-500 to-red-500",
  "from-sky-500 to-indigo-500",
  "from-fuchsia-500 to-pink-500",
]

const activeProjects = [
  {
    title: "NPNGS Protocols",
    description: "Frameworks, standards, and digital governance systems that operationalize neutrality — enabling interoperable trade, finance, and collaboration across sovereign boundaries.",
    color: "from-blue-500 to-cyan-500",
    href: "/projects/npngs-protocols",
    image: "/images/TBP-NPNGS-Protocols-Project.png",
  },
  {
    title: "Infrastructure Systems",
    description: "Strategic, modular infrastructure assets — including energy, logistics, and digital corridors — that anchor neutral trade and collaboration networks.",
    color: "from-emerald-500 to-teal-500",
    href: "/projects/infrastructure-systems",
    image: "/images/TBP-Infrastructure-Systems-Project.jpeg",
  },
  {
    title: "City & Regional Development",
    description: "The transformation of cities and regions into neutral innovation and trade hubs, through integrated planning, clean energy transition, and smart infrastructure.",
    color: "from-violet-500 to-purple-500",
    href: "/projects/city-regional-development",
    image: "/images/City-Regional-Development.png",
  },
  {
    title: "Sovereign & Multipolar Initiatives",
    description: "Aligning sovereign and multilateral initiatives with neutral governance models, fostering interoperability between global systems and frameworks.",
    color: "from-rose-500 to-pink-500",
    href: "/projects/sovereign-multipolar-initiatives",
    image: "/images/Sovereign-Multipolar-Initiatives-1.jpeg",
  },
  {
    title: "Software & Digital Platforms",
    description: "Core digital engines that power TBP operations — such as data interoperability tools, trade registries, and smart-contract systems — ensuring transparency and efficiency.",
    color: "from-amber-500 to-orange-500",
    href: "/projects/software-digital-platforms",
    image: "/images/TBP-Software-Digital-Platforms-Project.jpeg",
  },
  {
    title: "Event Systems & Global Engagements",
    description: "Design, management, and delivery of TBP-led summits, forums, conferences, and pilot events that advance the NPNGS vision and foster global collaboration.",
    color: "from-indigo-500 to-blue-500",
    href: "/projects/event-systems-global-engagements",
    image: "/images/TBP-Event-Systems-Global-Engagements-Project.jpeg",
  },
]

const innovationAreas = [
  {
    title: "Artificial Intelligence",
    description: "Advancing responsible AI solutions for enterprise and society",
    icon: BrainCircuit,
    items: ["Machine Learning", "NLP", "Computer Vision", "Generative AI"],
  },
  {
    title: "Blockchain & Web3",
    description: "Decentralized systems for transparency and trust",
    icon: Blocks,
    items: ["Smart Contracts", "DeFi", "Tokenization", "DAO Governance"],
  },
  {
    title: "Climate Technology",
    description: "Innovations driving sustainability and net-zero goals",
    icon: Orbit,
    items: ["Carbon Capture", "Clean Energy", "Circular Economy", "Green Tech"],
  },
  {
    title: "Space & Defense",
    description: "Strategic technologies for the new space economy",
    icon: Rocket,
    items: ["Satellite Tech", "Space Mining", "Defense Systems", "Hypersonics"],
  },
]

const globalInitiatives = [
  {
    title: "TBP 2030 Vision",
    description: "A decade-long initiative to reshape global strategic collaboration through technology, policy, and human capital.",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
    impact: "50+ countries engaged",
  },
  {
    title: "Strategist Without Borders",
    description: "Deploying top strategic talent to underserved regions to drive economic development and institutional capacity.",
    icon: Globe,
    color: "from-emerald-500 to-teal-500",
    impact: "200+ missions completed",
  },
  {
    title: "Global Innovation Alliance",
    description: "A cross-sector partnership network accelerating breakthrough innovations from lab to market.",
    icon: Handshake,
    color: "from-violet-500 to-purple-500",
    impact: "150+ partner organizations",
  },
  {
    title: "Future Leaders Program",
    description: "Identifying and mentoring the next generation of global strategic leaders across emerging markets.",
    icon: Sparkles,
    color: "from-amber-500 to-orange-500",
    impact: "1,000+ alumni worldwide",
  },
]

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[10vh] pb-[10vh]">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[128px]" />
      </div>

      <FloatingShape
        className="top-[15%] left-[10%]"
        delay={0}
        duration={25}
        Icon={Hexagon}
      />
      <FloatingShape
        className="top-[25%] right-[12%]"
        delay={2}
        duration={22}
        Icon={Triangle}
      />
      <FloatingShape
        className="bottom-[20%] left-[8%]"
        delay={4}
        duration={28}
        Icon={CircleDot}
      />
      <FloatingShape
        className="bottom-[30%] right-[10%]"
        delay={1}
        duration={24}
        Icon={Asterisk}
      />
      <FloatingShape
        className="top-[40%] left-[5%]"
        delay={3}
        duration={30}
        Icon={Hexagon}
      />
      <FloatingShape
        className="top-[60%] right-[5%]"
        delay={5}
        duration={26}
        Icon={Triangle}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-0 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Badge
            variant="outline"
            className="mb-2 border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium tracking-wider text-primary backdrop-blur-sm"
          >
            Connecting Global Strategists for a Better Future
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-4xl font-bold tracking-tight leading-none whitespace-nowrap sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="text-white/90">TBP Global </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-300 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Strategists
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-5xl text-lg leading-relaxed tracking-wide text-white/60 sm:text-xl"
        >
          At the heart of this Multi-Trillion Neo-Polar Neutrality Global System — a bold framework to move beyond gridlocked multilateralism and enable nations, businesses, and citizens to engage through neutral trade corridors, interoperable infrastructure, and shared digital/physical protocols — while preserving their sovereign identity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/strategists">
            <Button
              size="lg"
              className="h-12 rounded-full bg-primary px-8 text-base font-medium text-primary-fg shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105"
            >
              Explore the Network
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105"
            >
              Join the Ecosystem
              <ArrowUpRight size={16} className="ml-2" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-8 text-sm text-white/40"
        >
          <span>Trusted by 850+ organizations</span>
          <span className="hidden h-4 w-px bg-white/20 sm:block" />
          <span className="hidden sm:inline">1500+ elite strategists</span>
          <span className="hidden h-4 w-px bg-white/20 md:block" />
          <span className="hidden md:inline">64 countries</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronRight size={16} className="rotate-90" />
        </motion.div>
      </motion.div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-16 text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
            Platform Pillars
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-black">
              Everything you need to lead
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-900">
            A comprehensive ecosystem designed for strategic excellence across every dimension of global business.
          </p>
        </AnimatedSection>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div key={feature.title} variants={staggerItem} className="h-full">
                <Link href={feature.href} className="block h-full">
                  <GlassCard hover className="group flex h-full flex-col overflow-hidden p-6 transition-all duration-300">
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10",
                        `bg-gradient-to-br ${feature.gradient}`
                      )}
                    />
                    <div className="relative z-10 flex flex-col flex-1">
                      <div
                        className={cn(
                          "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                          feature.gradient
                        )}
                      >
                        <Icon size={22} className="text-white" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-black">{feature.title}</h3>
                      <p className="flex-1 text-sm leading-relaxed text-gray-700">{feature.description}</p>
                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary transition-all duration-300 group-hover:text-blue-400 group-hover:translate-x-1">
                        Learn more <ArrowRight size={14} />
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
  )
}

function StrategistsSection() {
  const [strategists, setStrategists] = useState<{ id: string; name: string; title: string; area: string; color: string; image: string }[]>([])

  useEffect(() => {
    fetch("/api/strategists")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return
        const shuffled = [...data].sort(() => Math.random() - 0.5)
        const picked = shuffled.slice(0, 12)
        setStrategists(
          picked.map((s: Record<string, unknown>, i: number) => ({
            id: (s.id as string) ?? "",
            name: (s.name as string) ?? "Unknown",
            title: (s.headline as string) ?? (s.badge as string) ?? "Strategist",
            area: (s.sector as string) ?? (s.category as string) ?? "Strategy",
            color: gradientColors[i % gradientColors.length],
            image: (s.avatar as string) || "",
          }))
        )
      })
      .catch(() => {})
  }, [])

  if (strategists.length === 0) return null

  return (
    <section className="relative pt-8 pb-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12 flex items-end justify-between">
          <div>
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              Featured Strategists
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    <span className="text-black">
                Meet our strategists
              </span>
            </h2>
          </div>
          <Link
            href="/strategists"
            className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:flex"
          >
            View all <ArrowRight size={14} />
          </Link>
        </AnimatedSection>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [0, -2000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 px-4"
          style={{ width: "max-content" }}
        >
          {[...strategists, ...strategists].map((strategist, i) => {
            return (
              <Link key={`${strategist.id}-${i}`} href={`/strategists/${strategist.id}`}>
                <GlassCard
                  hover
                  className="group w-64 shrink-0 p-5"
                >
                  <div className="flex justify-center mb-3">
                    <div className="h-28 w-28 rounded-full overflow-hidden ring-2 ring-gray-200 ring-offset-2">
                      {strategist.image ? (
                        <img
                          src={strategist.image}
                          alt={strategist.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl font-bold text-white transition-transform duration-500 group-hover:scale-110">
                          {strategist.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-semibold text-black">{strategist.name}</h4>
                    <p className="mt-0.5 text-xs text-gray-500">{strategist.title}</p>
                    <Badge variant="outline" className="mt-3 border-gray-200 bg-gray-50 text-xs text-gray-600">
                      {strategist.area}
                    </Badge>
                  </div>
                </GlassCard>
              </Link>
            )
          })}
        </motion.div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8 sm:hidden">
        <Link
          href="/strategists"
          className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all strategists <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  )
}

function ProjectsSection() {
  return (
    <section className="relative pb-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
            Active Projects
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            TBP Project Categories
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-900">
            Discover strategic projects driving meaningful change across industries and geographies.
          </p>
        </AnimatedSection>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {activeProjects.map((project) => (
            <motion.div key={project.title} variants={staggerItem} className="h-full">
              <GlassCard hover className="group flex h-full flex-col overflow-hidden p-6">
                <div
                  className={cn(
                    "absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20",
                    `bg-gradient-to-br ${project.color}`
                  )}
                />
                <div className="relative z-10 flex flex-1 flex-col">
                  <div className="mb-4 -mx-6 -mt-6 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-black">{project.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-gray-700">{project.description}</p>
                  <Link
                    href={project.href}
                    className="mt-4 flex items-center gap-1 text-sm font-medium text-primary transition-all duration-300 hover:text-blue-400 hover:translate-x-1"
                  >
                    Learn more <ArrowRight size={14} />
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        <AnimatedSection className="mt-10 text-center" delay={0.3}>
          <Link href="/projects">
            <Button
              variant="outline"
              className="rounded-full border-gray-300 bg-white px-8 text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400"
            >
              View all projects <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}

function InnovationSection() {
  return (
    <section className="relative pb-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
            Innovation Ecosystem
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Where ideas become impact
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-900">
            Our innovation ecosystem spans the most transformative technologies, methodologies, and strategic frameworks shaping the future of global enterprise.
          </p>
        </AnimatedSection>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2"
        >
          {innovationAreas.map((area) => {
            const Icon = area.icon
            return (
              <motion.div key={area.title} variants={staggerItem}>
                <GlassCard hover className="group p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      <Icon size={28} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="mb-1 text-lg font-semibold text-black">{area.title}</h3>
                      <p className="text-sm text-gray-700">{area.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {area.items.map((item) => (
                          <Badge
                            key={item}
                            variant="outline"
                            className="border-white/10 bg-white/[0.02] text-xs text-white/40"
                          >
                            {item}
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

        <AnimatedSection className="mt-10 text-center" delay={0.3}>
          <Link href="/innovation">
            <Button className="rounded-full bg-primary px-8 text-primary-fg shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105">
              Explore innovation areas <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}

function InitiativesSection() {
  return (
    <section className="relative pb-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
            Global Initiatives
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Making a global impact
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-900">
            Purpose-driven initiatives that combine strategic expertise with a commitment to positive global change and sustainable development across borders.
          </p>
        </AnimatedSection>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {globalInitiatives.map((initiative) => {
            const Icon = initiative.icon
            return (
              <motion.div key={initiative.title} variants={staggerItem}>
                <GlassCard hover className="group relative overflow-hidden p-6">
                  <div
                    className={cn(
                      "absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-5 blur-2xl transition-all duration-500 group-hover:opacity-15",
                      `bg-gradient-to-br ${initiative.color}`
                    )}
                  />
                  <div className="relative z-10 flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                        initiative.color
                      )}
                    >
                      <Icon size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-black">{initiative.title}</h3>
                      <p className="text-sm leading-relaxed text-gray-700">{initiative.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-primary">
                        <span>{initiative.impact}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>

        <AnimatedSection className="mt-10 text-center" delay={0.3}>
          <Link href="/initiatives">
            <Button
              variant="outline"
              className="rounded-full border-gray-300 bg-white px-8 text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400"
            >
              View all initiatives <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary/20 rounded-full blur-[96px]" />
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-[96px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-0 text-center">
        <AnimatedSection>
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary backdrop-blur-sm">
            Resource Center
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <GradientText from="from-white" via="via-blue-200" to="to-cyan-200">
              NPNGS Strategist Resource Center
            </GradientText>
          </h2>
          <p className="mx-auto mt-4 max-w-4xl text-lg leading-loose tracking-wide text-white/60">
            Gain access to exclusive guides, frameworks, and expert-curated TBP DESQUELET™ materials designed to help you innovate, build, and lead within the next generation of the Neo-Polar Neutrality Global System (NPNGS). Develop your skills, accelerate your impact, and stay ahead of the global shift — all in one place.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="mt-10">
          <Link href="/resources">
            <Button className="h-12 rounded-full bg-primary px-8 text-base font-medium text-primary-fg shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105">
              Explore Resources <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        <HeroSection />
        <FeaturesSection />
        <StrategistsSection />
        <ProjectsSection />
        <InnovationSection />
        <InitiativesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
