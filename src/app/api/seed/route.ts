import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { readFileSync } from "fs"
import { join } from "path"

const userSeeds = [
  { name: "Admin User", email: "admin@tbp.global", role: "ADMIN", title: "Platform Administrator", bio: "Platform administrator overseeing all operations." },
  { name: "Alex Strategist", email: "strategist@tbp.global", role: "STRATEGIST", title: "Senior Strategist", bio: "Experienced strategist specializing in digital transformation." },
  { name: "Corporate User", email: "corporate@tbp.global", role: "CORPORATE", title: "Operations Director", bio: "Corporate operations director." },
  { name: "Dr. Elena Voss", email: "elena.voss@tbp.global", role: "STRATEGIST", title: "Digital Transformation Lead", bio: "Leading digital transformation initiatives across enterprises." },
  { name: "Marcus Chen", email: "marcus.chen@tbp.global", role: "STRATEGIST", title: "M&A Strategist", bio: "Mergers and acquisitions specialist with 15 years experience." },
  { name: "Priya Kapoor", email: "priya.kapoor@tbp.global", role: "STRATEGIST", title: "Sustainability Consultant", bio: "ESG and sustainability strategy consultant." },
  { name: "Sarah Chen", email: "sarah.chen@acmecorp.com", role: "ORGANIZATION_ADMIN", title: "Innovation Lead", bio: "Leading innovation at Acme Corporation." },
  { name: "Marcus Rivera", email: "marcus.rivera@acmecorp.com", role: "CORPORATE", title: "Strategy Associate", bio: "Corporate strategy associate." },
  { name: "Dr. Yuki Tanaka", email: "yuki.tanaka@tbp.global", role: "RESEARCHER", title: "AI Research Lead", bio: "Artificial intelligence and machine learning researcher." },
  { name: "Sarah Al-Rashid", email: "sarah.alrashid@tbp.global", role: "STRATEGIST", title: "Risk Management Specialist", bio: "Enterprise risk management and compliance." },
  { name: "James Wilson", email: "james.wilson@techventures.io", role: "CORPORATE", title: "CTO", bio: "Chief Technology Officer at TechVentures." },
  { name: "Amara Osei", email: "amara.osei@tbp.global", role: "STRATEGIST", title: "Customer Experience Strategist", bio: "Customer experience and digital strategy." },
  { name: "David Kim", email: "david.kim@greenfuture.io", role: "ORGANIZATION_ADMIN", title: "VP Sustainability", bio: "Leading sustainability initiatives." },
  { name: "Emma Rodriguez", email: "emma.rodriguez@datasphere.ai", role: "CORPORATE", title: "Data Science Director", bio: "Data science and analytics director." },
  { name: "Dr. James Okafor", email: "james.okafor@tbp.global", role: "MODERATOR", title: "Content Moderator", bio: "Content quality and compliance moderator." },
]

const orgSeeds = [
  { name: "Acme Corporation", slug: "acme-corp", description: "Leading manufacturing and technology company.", industry: "Manufacturing & Industrial", size: "1000-5000", location: "New York, USA" },
  { name: "TechVentures Inc.", slug: "techventures", description: "Venture capital backed technology startup.", industry: "Technology & Software", size: "100-500", location: "San Francisco, USA" },
  { name: "GreenFuture Labs", slug: "greenfuture-labs", description: "Sustainability research and consulting firm.", industry: "Energy & Utilities", size: "50-200", location: "London, UK" },
  { name: "DataSphere Analytics", slug: "datasphere-analytics", description: "Data analytics and AI solutions provider.", industry: "Technology & Software", size: "200-1000", location: "Berlin, Germany" },
  { name: "QuantumLeap Consulting", slug: "quantumleap", description: "Management consulting firm specializing in digital transformation.", industry: "Financial Services", size: "50-200", location: "Singapore" },
]

const tagNames = [
  "Digital Transformation", "AI & Machine Learning", "Sustainability & ESG",
  "Innovation Strategy", "Organizational Design", "Risk Management",
  "Market Expansion", "Operational Excellence", "Financial Strategy",
  "Change Management", "Data & Analytics", "Supply Chain Optimization",
  "Customer Experience", "Mergers & Acquisitions", "Blockchain & Web3",
]

const projectSeeds = [
  { title: "Digital Transformation Strategy", slug: "digital-transformation-strategy", status: "ACTIVE", budget: 250000, orgSlug: "acme-corp", creatorEmail: "elena.voss@tbp.global", description: "Enterprise-wide digital transformation roadmap for Acme Corporation." },
  { title: "Market Expansion APAC", slug: "market-expansion-apac", status: "ACTIVE", budget: 180000, orgSlug: "techventures", creatorEmail: "marcus.chen@tbp.global", description: "Strategic market entry analysis for Southeast Asian markets." },
  { title: "ESG Framework Development", slug: "esg-framework-development", status: "ACTIVE", budget: 120000, orgSlug: "greenfuture-labs", creatorEmail: "priya.kapoor@tbp.global", description: "Developing comprehensive ESG measurement framework." },
  { title: "AI Readiness Assessment", slug: "ai-readiness-assessment", status: "DRAFT", budget: 90000, orgSlug: "datasphere-analytics", creatorEmail: "yuki.tanaka@tbp.global", description: "AI readiness and maturity assessment for enterprise clients." },
  { title: "Operational Excellence Review", slug: "operational-excellence-review", status: "COMPLETED", budget: 75000, orgSlug: "quantumleap", creatorEmail: "elena.voss@tbp.global", description: "Process optimization and operational efficiency analysis." },
  { title: "Supply Chain Optimization", slug: "supply-chain-optimization", status: "ACTIVE", budget: 200000, orgSlug: "acme-corp", creatorEmail: "marcus.rivera@acmecorp.com", description: "End-to-end supply chain optimization using AI-driven analytics." },
  { title: "Customer Experience Transformation", slug: "cx-transformation", status: "DRAFT", budget: 150000, orgSlug: "techventures", creatorEmail: "amara.osei@tbp.global", description: "Comprehensive customer experience redesign and digital platform strategy." },
  { title: "Risk Management Framework", slug: "risk-management-framework", status: "ACTIVE", budget: 95000, orgSlug: "quantumleap", creatorEmail: "sarah.alrashid@tbp.global", description: "Enterprise risk management framework for financial services sector." },
  { title: "Innovation Lab Setup", slug: "innovation-lab-setup", status: "COMPLETED", budget: 300000, orgSlug: "greenfuture-labs", creatorEmail: "david.kim@greenfuture.io", description: "Physical and digital innovation lab for sustainability research." },
  { title: "Data Platform Migration", slug: "data-platform-migration", status: "CANCELLED", budget: 0, orgSlug: "datasphere-analytics", creatorEmail: "emma.rodriguez@datasphere.ai", description: "Cloud data platform migration project (cancelled due to scope changes)." },
]

async function pushSchema() {
  const sql = readFileSync(join(process.cwd(), "prisma/migrations/202507060001_init/migration.sql"), "utf-8")
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"))
  for (const stmt of statements) {
    try { await prisma.$executeRawUnsafe(stmt + ";") } catch { }
  }
}

export async function GET() {
  try {
    await pushSchema()
    const passwordHash = await bcrypt.hash("Password123!", 12)
    const createdUsers: { email: string; id: string }[] = []

    for (const u of userSeeds) {
      const created = await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: { name: u.name, email: u.email, role: u.role as any, passwordHash },
      })
      createdUsers.push({ email: created.email, id: created.id })

      if (u.bio) {
        await prisma.strategistProfile.upsert({
          where: { userId: created.id },
          update: {},
          create: { userId: created.id, bio: u.bio, title: u.title, yearsOfExperience: Math.floor(Math.random() * 20) + 3, hourlyRate: Math.floor(Math.random() * 100) + 100, availability: Math.random() > 0.3 },
        })
      }
    }

    const createdOrgs: { id: string; slug: string }[] = []
    for (const o of orgSeeds) {
      const created = await prisma.organization.upsert({
        where: { slug: o.slug },
        update: {},
        create: o,
      })
      createdOrgs.push({ id: created.id, slug: created.slug })
    }

    const orgMemberships = [
      { email: "sarah.chen@acmecorp.com", slug: "acme-corp", role: "ORGANIZATION_ADMIN" },
      { email: "marcus.rivera@acmecorp.com", slug: "acme-corp", role: "CORPORATE" },
      { email: "james.wilson@techventures.io", slug: "techventures", role: "ORGANIZATION_ADMIN" },
      { email: "david.kim@greenfuture.io", slug: "greenfuture-labs", role: "ORGANIZATION_ADMIN" },
      { email: "emma.rodriguez@datasphere.ai", slug: "datasphere-analytics", role: "ORGANIZATION_ADMIN" },
      { email: "corporate@tbp.global", slug: "acme-corp", role: "CORPORATE" },
    ]
    for (const m of orgMemberships) {
      const user = createdUsers.find((u) => u.email === m.email)
      const org = createdOrgs.find((o) => o.slug === m.slug)
      if (user && org) {
        await prisma.organizationMember.upsert({
          where: { organizationId_userId: { organizationId: org.id, userId: user.id } },
          update: {},
          create: { organizationId: org.id, userId: user.id, role: m.role as any },
        })
      }
    }

    const createdTags: { id: string }[] = []
    for (const name of tagNames) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      const created = await prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      })
      createdTags.push({ id: created.id })
    }

    for (const p of projectSeeds) {
      const org = createdOrgs.find((o) => o.slug === p.orgSlug)
      const creator = createdUsers.find((u) => u.email === p.creatorEmail)
      if (!creator) continue
      await prisma.project.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          title: p.title, slug: p.slug, description: p.description,
          status: p.status as any, budget: p.budget,
          organizationId: org?.id ?? null, createdById: creator.id,
          startDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000),
          endDate: new Date(Date.now() + Math.floor(Math.random() * 120) * 86400000),
        },
      })
    }

    return Response.json({
      message: "Seed successful",
      users: createdUsers.length,
      organizations: createdOrgs.length,
      tags: createdTags.length,
      projects: projectSeeds.length,
      note: "Password for all users is: Password123!",
    })
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 })
  }
}
