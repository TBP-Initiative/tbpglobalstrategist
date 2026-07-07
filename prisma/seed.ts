import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import type { Role, ProjectStatus, ActivityAction, NotificationType } from "../src/generated/prisma/client/enums"

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) })

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12)

  const userSeeds = [
    { name: "Admin User", email: "admin@tbp.global", role: "ADMIN" as Role, title: "Platform Administrator", bio: "Platform administrator overseeing all operations." },
    { name: "Alex Strategist", email: "strategist@tbp.global", role: "STRATEGIST" as Role, title: "Senior Strategist", bio: "Experienced strategist specializing in digital transformation." },
    { name: "Corporate User", email: "corporate@tbp.global", role: "CORPORATE" as Role, title: "Operations Director", bio: "Corporate operations director." },
    { name: "Dr. Elena Voss", email: "elena.voss@tbp.global", role: "STRATEGIST" as Role, title: "Digital Transformation Lead", bio: "Leading digital transformation initiatives across enterprises." },
    { name: "Marcus Chen", email: "marcus.chen@tbp.global", role: "STRATEGIST" as Role, title: "M&A Strategist", bio: "Mergers and acquisitions specialist with 15 years experience." },
    { name: "Priya Kapoor", email: "priya.kapoor@tbp.global", role: "STRATEGIST" as Role, title: "Sustainability Consultant", bio: "ESG and sustainability strategy consultant." },
    { name: "Sarah Chen", email: "sarah.chen@acmecorp.com", role: "ORGANIZATION_ADMIN" as Role, title: "Innovation Lead", bio: "Leading innovation at Acme Corporation." },
    { name: "Marcus Rivera", email: "marcus.rivera@acmecorp.com", role: "CORPORATE" as Role, title: "Strategy Associate", bio: "Corporate strategy associate." },
    { name: "Dr. Yuki Tanaka", email: "yuki.tanaka@tbp.global", role: "RESEARCHER" as Role, title: "AI Research Lead", bio: "Artificial intelligence and machine learning researcher." },
    { name: "Sarah Al-Rashid", email: "sarah.alrashid@tbp.global", role: "STRATEGIST" as Role, title: "Risk Management Specialist", bio: "Enterprise risk management and compliance." },
    { name: "James Wilson", email: "james.wilson@techventures.io", role: "CORPORATE" as Role, title: "CTO", bio: "Chief Technology Officer at TechVentures." },
    { name: "Amara Osei", email: "amara.osei@tbp.global", role: "STRATEGIST" as Role, title: "Customer Experience Strategist", bio: "Customer experience and digital strategy." },
    { name: "David Kim", email: "david.kim@greenfuture.io", role: "ORGANIZATION_ADMIN" as Role, title: "VP Sustainability", bio: "Leading sustainability initiatives." },
    { name: "Emma Rodriguez", email: "emma.rodriguez@datasphere.ai", role: "CORPORATE" as Role, title: "Data Science Director", bio: "Data science and analytics director." },
    { name: "Dr. James Okafor", email: "james.okafor@tbp.global", role: "MODERATOR" as Role, title: "Content Moderator", bio: "Content quality and compliance moderator." },
  ]

  const createdUsers: { email: string; id: string; role: string }[] = []

  for (const u of userSeeds) {
    const created = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        role: u.role,
        passwordHash,
        image: null,
      },
    })
    createdUsers.push({ email: u.email, id: created.id, role: created.role })
    console.log(`Created ${u.role} user: ${u.email}`)

    if (u.role === "STRATEGIST" || u.role === "RESEARCHER") {
      const stage = u.title === "Platform Administrator" ? "STRATEGIST" as const
        : ["Senior Strategist", "Digital Transformation Lead", "M&A Strategist", "Risk Management Specialist", "Customer Experience Strategist"].includes(u.title || "") ? "CONTRIBUTOR" as const
        : ["Sustainability Consultant", "AI Research Lead"].includes(u.title || "") ? "STRATEGIST" as const
        : "CANDIDATE" as const

      await prisma.strategistProfile.upsert({
        where: { userId: created.id },
        update: {},
        create: {
          userId: created.id,
          bio: u.bio,
          title: u.title,
          stage,
          yearsOfExperience: Math.floor(Math.random() * 20) + 3,
          hourlyRate: Math.floor(Math.random() * 100) + 100,
          availability: Math.random() > 0.3,
        },
      })
    }
  }

  const orgSeeds = [
    { name: "Acme Corporation", slug: "acme-corp", description: "Leading manufacturing and technology company.", industry: "Manufacturing & Industrial", size: "1000-5000", location: "New York, USA" },
    { name: "TechVentures Inc.", slug: "techventures", description: "Venture capital backed technology startup.", industry: "Technology & Software", size: "100-500", location: "San Francisco, USA" },
    { name: "GreenFuture Labs", slug: "greenfuture-labs", description: "Sustainability research and consulting firm.", industry: "Energy & Utilities", size: "50-200", location: "London, UK" },
    { name: "DataSphere Analytics", slug: "datasphere-analytics", description: "Data analytics and AI solutions provider.", industry: "Technology & Software", size: "200-1000", location: "Berlin, Germany" },
    { name: "QuantumLeap Consulting", slug: "quantumleap", description: "Management consulting firm specializing in digital transformation.", industry: "Financial Services", size: "50-200", location: "Singapore" },
  ]

  const createdOrgs: { id: string; slug: string }[] = []

  for (const org of orgSeeds) {
    const created = await prisma.organization.upsert({
      where: { slug: org.slug },
      update: {},
      create: org,
    })
    createdOrgs.push({ id: created.id, slug: created.slug })
    console.log(`Created organization: ${org.name}`)
  }

  const orgMemberships = [
    { email: "sarah.chen@acmecorp.com", slug: "acme-corp", role: "ORGANIZATION_ADMIN" as Role },
    { email: "marcus.rivera@acmecorp.com", slug: "acme-corp", role: "CORPORATE" as Role },
    { email: "james.wilson@techventures.io", slug: "techventures", role: "ORGANIZATION_ADMIN" as Role },
    { email: "david.kim@greenfuture.io", slug: "greenfuture-labs", role: "ORGANIZATION_ADMIN" as Role },
    { email: "emma.rodriguez@datasphere.ai", slug: "datasphere-analytics", role: "ORGANIZATION_ADMIN" as Role },
    { email: "corporate@tbp.global", slug: "acme-corp", role: "CORPORATE" as Role },
  ]

  for (const m of orgMemberships) {
    const user = createdUsers.find((u) => u.email === m.email)
    const org = createdOrgs.find((o) => o.slug === m.slug)
    if (user && org) {
      await prisma.organizationMember.upsert({
        where: { organizationId_userId: { organizationId: org.id, userId: user.id } },
        update: {},
        create: { organizationId: org.id, userId: user.id, role: m.role },
      })
    }
  }
  console.log("Created organization memberships")

  const tagSeeds = [
    "Digital Transformation", "AI & Machine Learning", "Sustainability & ESG",
    "Innovation Strategy", "Organizational Design", "Risk Management",
    "Market Expansion", "Operational Excellence", "Financial Strategy",
    "Change Management", "Data & Analytics", "Supply Chain Optimization",
    "Customer Experience", "Mergers & Acquisitions", "Blockchain & Web3",
  ]

  const createdTags: { id: string; slug: string }[] = []

  for (const name of tagSeeds) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const created = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    })
    createdTags.push({ id: created.id, slug: created.slug })
  }
  console.log("Created tags")

  const projectSeeds = [
    { title: "Digital Transformation Strategy", slug: "digital-transformation-strategy", status: "ACTIVE" as ProjectStatus, budget: 250000, orgSlug: "acme-corp", createdBy: "elena.voss@tbp.global", description: "Enterprise-wide digital transformation roadmap for Acme Corporation." },
    { title: "Market Expansion APAC", slug: "market-expansion-apac", status: "ACTIVE" as ProjectStatus, budget: 180000, orgSlug: "techventures", createdBy: "marcus.chen@tbp.global", description: "Strategic market entry analysis for Southeast Asian markets." },
    { title: "ESG Framework Development", slug: "esg-framework-development", status: "ACTIVE" as ProjectStatus, budget: 120000, orgSlug: "greenfuture-labs", createdBy: "priya.kapoor@tbp.global", description: "Developing comprehensive ESG measurement framework." },
    { title: "AI Readiness Assessment", slug: "ai-readiness-assessment", status: "DRAFT" as ProjectStatus, budget: 90000, orgSlug: "datasphere-analytics", createdBy: "yuki.tanaka@tbp.global", description: "AI readiness and maturity assessment for enterprise clients." },
    { title: "Operational Excellence Review", slug: "operational-excellence-review", status: "COMPLETED" as ProjectStatus, budget: 75000, orgSlug: "quantumleap", createdBy: "elena.voss@tbp.global", description: "Process optimization and operational efficiency analysis." },
    { title: "Supply Chain Optimization", slug: "supply-chain-optimization", status: "ACTIVE" as ProjectStatus, budget: 200000, orgSlug: "acme-corp", createdBy: "marcus.rivera@acmecorp.com", description: "End-to-end supply chain optimization using AI-driven analytics." },
    { title: "Customer Experience Transformation", slug: "cx-transformation", status: "DRAFT" as ProjectStatus, budget: 150000, orgSlug: "techventures", createdBy: "amara.osei@tbp.global", description: "Comprehensive customer experience redesign and digital platform strategy." },
    { title: "Risk Management Framework", slug: "risk-management-framework", status: "ACTIVE" as ProjectStatus, budget: 95000, orgSlug: "quantumleap", createdBy: "sarah.alrashid@tbp.global", description: "Enterprise risk management framework for financial services sector." },
    { title: "Innovation Lab Setup", slug: "innovation-lab-setup", status: "COMPLETED" as ProjectStatus, budget: 300000, orgSlug: "greenfuture-labs", createdBy: "david.kim@greenfuture.io", description: "Physical and digital innovation lab for sustainability research." },
    { title: "Data Platform Migration", slug: "data-platform-migration", status: "CANCELLED" as ProjectStatus, budget: 0, orgSlug: "datasphere-analytics", createdBy: "emma.rodriguez@datasphere.ai", description: "Cloud data platform migration project (cancelled due to scope changes)." },
  ]

  for (const p of projectSeeds) {
    const org = createdOrgs.find((o) => o.slug === p.orgSlug)
    const creator = createdUsers.find((u) => u.email === p.createdBy)
    if (!creator) continue

    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        status: p.status,
        budget: p.budget,
        organizationId: org?.id ?? null,
        createdById: creator.id,
        startDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000),
        endDate: new Date(Date.now() + Math.floor(Math.random() * 120) * 86400000),
      },
    })
    console.log(`Created project: ${p.title}`)
  }

  const strategistEmails = ["elena.voss@tbp.global", "marcus.chen@tbp.global", "priya.kapoor@tbp.global", "yuki.tanaka@tbp.global", "sarah.alrashid@tbp.global", "amara.osei@tbp.global"]
  const projectSlugs = ["digital-transformation-strategy", "market-expansion-apac", "esg-framework-development", "ai-readiness-assessment", "supply-chain-optimization", "cx-transformation", "risk-management-framework"]

  for (const email of strategistEmails) {
    const user = createdUsers.find((u) => u.email === email)
    if (!user) continue
    const randomProjects = projectSlugs.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1)
    for (const slug of randomProjects) {
      const project = await prisma.project.findUnique({ where: { slug } })
      if (project) {
        await prisma.projectContributor.upsert({
          where: { projectId_userId: { projectId: project.id, userId: user.id } },
          update: {},
          create: { projectId: project.id, userId: user.id },
        })
      }
    }
  }
  console.log("Created project contributors")

  const notificationsData = [
    { email: "admin@tbp.global", title: "New user registered", message: "Dr. Elena Voss has registered as a strategist.", type: "SYSTEM" as NotificationType },
    { email: "admin@tbp.global", title: "Project approval needed", message: "AI Readiness Assessment requires admin approval.", type: "PROJECT_INVITE" as NotificationType },
    { email: "strategist@tbp.global", title: "Collaboration request", message: "Acme Corporation wants to collaborate on Digital Transformation.", type: "MESSAGE" as NotificationType },
    { email: "strategist@tbp.global", title: "Achievement unlocked", message: "You completed your 5th project milestone!", type: "ACHIEVEMENT_UNLOCKED" as NotificationType },
    { email: "corporate@tbp.global", title: "Organization invite", message: "You've been invited to join Acme Corporation.", type: "ORGANIZATION_INVITE" as NotificationType },
  ]

  for (const n of notificationsData) {
    const user = createdUsers.find((u) => u.email === n.email)
    if (!user) continue
    await prisma.notification.create({
      data: { userId: user.id, title: n.title, message: n.message, type: n.type },
    })
  }
  console.log("Created notifications")

  const messagesData = [
    { from: "sarah.chen@acmecorp.com", to: "strategist@tbp.global", content: "Hi, I'd like to discuss the Digital Transformation project roadmap. Are you available for a call this week?" },
    { from: "strategist@tbp.global", to: "sarah.chen@acmecorp.com", content: "Absolutely! I'm free Thursday afternoon or Friday morning. Let me know what works best for you." },
    { from: "james.wilson@techventures.io", to: "strategist@tbp.global", content: "We're impressed with your portfolio and would like to explore a collaboration on our APAC expansion." },
    { from: "admin@tbp.global", to: "strategist@tbp.global", content: "Your profile has been verified. Welcome to the TBP Global Strategist network!" },
  ]

  for (const m of messagesData) {
    const sender = createdUsers.find((u) => u.email === m.from)
    const receiver = createdUsers.find((u) => u.email === m.to)
    if (!sender || !receiver) continue
    await prisma.message.create({
      data: { senderId: sender.id, receiverId: receiver.id, content: m.content },
    })
  }
  console.log("Created messages")

  const activityActions: { email: string; action: ActivityAction; entity: string }[] = [
    { email: "elena.voss@tbp.global", action: "CREATE", entity: "Project" },
    { email: "marcus.chen@tbp.global", action: "CREATE", entity: "Project" },
    { email: "priya.kapoor@tbp.global", action: "UPDATE", entity: "Project" },
    { email: "admin@tbp.global", action: "LOGIN", entity: "User" },
    { email: "strategist@tbp.global", action: "LOGIN", entity: "User" },
    { email: "corporate@tbp.global", action: "LOGIN", entity: "User" },
    { email: "sarah.chen@acmecorp.com", action: "JOIN_ORGANIZATION", entity: "Organization" },
    { email: "david.kim@greenfuture.io", action: "PUBLISH", entity: "Publication" },
    { email: "yuki.tanaka@tbp.global", action: "JOIN_PROJECT", entity: "Project" },
    { email: "sarah.alrashid@tbp.global", action: "UPDATE", entity: "Project" },
  ]

  for (const a of activityActions) {
    const user = createdUsers.find((u) => u.email === a.email)
    if (!user) continue
    await prisma.activityLog.create({
      data: { userId: user.id, action: a.action, entity: a.entity, entityId: user.id },
    })
  }
  console.log("Created activity logs")

  console.log("\n✔ Seed complete! Created:")
  console.log(`  - ${createdUsers.length} users`)
  console.log(`  - ${orgSeeds.length} organizations`)
  console.log(`  - ${projectSeeds.length} projects`)
  console.log(`  - ${tagSeeds.length} tags`)
  console.log(`  - ${notificationsData.length} notifications`)
  console.log(`  - ${messagesData.length} messages`)
  console.log(`  - ${activityActions.length} activity logs`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
