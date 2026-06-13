"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, type Variants } from "framer-motion"
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  Globe,
  MessageCircle,
  Code2,
  Check,
  Building2,
  ChevronRight,
} from "lucide-react"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { GradientText } from "@/components/shared/gradient-text"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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

const offices = [
  {
    city: "London",
    address: "123 Strategic Avenue, Canary Wharf",
    postcode: "E14 5AB",
    country: "United Kingdom",
    phone: "+44 20 7123 4567",
    email: "london@tbpglobalstrategists.com",
    hours: "Mon–Fri, 9:00 – 18:00 GMT",
  },
  {
    city: "New York",
    address: "456 Innovation Boulevard, Manhattan",
    postcode: "NY 10013",
    country: "United States",
    phone: "+1 212 555 0198",
    email: "newyork@tbpglobalstrategists.com",
    hours: "Mon–Fri, 9:00 – 18:00 EST",
  },
  {
    city: "Singapore",
    address: "789 Futurescape Drive, Marina Bay",
    postcode: "018956",
    country: "Singapore",
    phone: "+65 6789 0123",
    email: "singapore@tbpglobalstrategists.com",
    hours: "Mon–Fri, 9:00 – 18:00 SGT",
  },
]

const socialLinks = [
  { label: "LinkedIn", href: "#", icon: Globe, description: "Follow our latest updates and thought leadership" },
  { label: "Twitter / X", href: "#", icon: MessageCircle, description: "Join the conversation on global strategy" },
  { label: "GitHub", href: "#", icon: Code2, description: "Explore our open-source strategy tools" },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary backdrop-blur-sm">
              Get in Touch
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-white/90">Let&apos;s start a</span>
              <GradientText from="from-blue-400" via="via-violet-400" to="to-cyan-300">
                conversation
              </GradientText>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
              Whether you&apos;re looking for strategic partnership, research collaboration, or
              want to join our network — we&apos;re here to help.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                <GlassCard className="p-6 sm:p-8">
                  <h2 className="mb-1 text-2xl font-bold tracking-tight text-white">Send us a message</h2>
                  <p className="mb-8 text-sm text-white/50">
                    Fill out the form below and our team will get back to you within 24 hours.
                  </p>

                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check size={32} />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Message sent!</h3>
                      <p className="mt-2 text-sm text-white/50">
                        Thank you for reaching out. We&apos;ll be in touch shortly.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm text-white/70">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            required
                            className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm text-white/70">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm text-white/70">
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          placeholder="How can we help?"
                          required
                          className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm text-white/70">
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your project or inquiry..."
                          rows={6}
                          required
                          className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/30"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full rounded-xl bg-primary py-6 text-base font-medium text-primary-fg shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01]"
                      >
                        <Send size={16} className="mr-2" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </GlassCard>
              </AnimatedSection>
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {offices.map((office, i) => (
                  <AnimatedSection key={office.city} delay={i * 0.1}>
                    <GlassCard className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <MapPin size={18} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-white">{office.city}</h3>
                          <p className="mt-0.5 text-xs text-white/40">{office.country}</p>
                          <p className="mt-2 text-xs text-white/50">{office.address}</p>
                          <p className="text-xs text-white/50">{office.postcode}</p>
                          <div className="mt-3 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-white/50">
                              <Phone size={12} className="shrink-0 text-primary/60" />
                              <span>{office.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                              <Mail size={12} className="shrink-0 text-primary/60" />
                              <span>{office.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                              <Clock size={12} className="shrink-0 text-primary/60" />
                              <span>{office.hours}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="relative border-y border-white/5 bg-black/20 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <GradientText from="from-white" via="via-violet-200" to="to-white/60">
                Connect with us
              </GradientText>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/50">
              Follow TBP Global Strategists across our channels for the latest insights and updates.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <motion.div key={social.label} variants={staggerItem}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <GlassCard hover className="group flex items-center gap-4 p-5 transition-all">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                        <Icon size={22} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-white">{social.label}</h3>
                        <p className="mt-0.5 text-xs text-white/40">{social.description}</p>
                      </div>
                      <ArrowRight size={14} className="ml-auto shrink-0 text-white/30 transition-colors group-hover:text-primary" />
                    </GlassCard>
                  </a>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <GlassCard className="overflow-hidden p-0">
              <div className="relative flex aspect-[21/9] items-center justify-center bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-cyan-900/30">
                <Globe size={64} className="text-white/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/60">Interactive Office Map</p>
                    <p className="mt-1 text-xs text-white/30">London · New York · Singapore · Dubai · Zurich · Tokyo</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <AnimatedSection>
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary backdrop-blur-sm">
              Strategic Partnership
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <GradientText from="from-white" via="via-blue-200" to="to-cyan-200">
                Ready to transform your strategy?
              </GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Join the growing network of enterprises and strategists partnering with TBP to shape
              the future of global business.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="mt-8">
            <Link href="/register">
              <Button className="h-12 rounded-full bg-primary px-8 text-base font-medium text-primary-fg shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105">
                Create your account <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
