import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CorporateProfileClient } from "./corporate-profile-client"
import type { StrategistProfile } from "@/types"

// ── Placeholder data ──────────────────────────────────────────────
interface TeamMember {
  id: string
  name: string
  title: string
  role: string
  avatar: string | null
}

interface ProjectItem {
  id: string
  title: string
  description: string
  innovationAreas: string[]
  status: "draft" | "active" | "completed" | "on-hold"
  startDate: string
  endDate: string | null
  budget: number | null
}

interface InnovationInitiative {
  id: string
  title: string
  description: string
  area: string
  progress: number
}

interface CorporateProfile {
  id: string
  name: string
  slug: string
  description: string
  mission: string
  logo: string | null
  coverImage: string | null
  website: string | null
  industry: string
  size: string
  location: string
  founded: string
  isVerified: boolean
  memberCount: number
  projectCount: number
  strategistCount: number
  innovationScore: number
  partnershipStatus: "platinum" | "gold" | "silver" | "basic"
  contactEmail: string | null
  contactPhone: string | null
  socialLinks: { linkedin: string | null; twitter: string | null }
  team: TeamMember[]
  strategists: StrategistProfile[]
  projects: ProjectItem[]
  initiatives: InnovationInitiative[]
}

const PLACEHOLDER_STRATEGISTS: StrategistProfile[] = [
  { id: "s1", userId: "u1", name: "Dr. Elena Voss", title: "Lead Innovation Strategist", bio: "20+ years driving digital transformation for Fortune 500 enterprises across EMEA and APAC.", avatar: null, expertiseAreas: ["Digital Transformation", "Innovation Strategy", "Organizational Design"], yearsOfExperience: 22, linkedIn: "#", website: null, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "s2", userId: "u2", name: "Marcus Chen", title: "Senior Strategy Consultant", bio: "Specializes in market expansion and operational excellence for high-growth technology firms.", avatar: null, expertiseAreas: ["Market Expansion", "Operational Excellence", "Data & Analytics"], yearsOfExperience: 15, linkedIn: "#", website: null, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "s3", userId: "u3", name: "Sarah Okonkwo", title: "Sustainability & ESG Advisor", bio: "Pioneering ESG integration and circular economy strategies for global industrial leaders.", avatar: null, expertiseAreas: ["Sustainability & ESG", "Change Management", "Supply Chain Optimization"], yearsOfExperience: 12, linkedIn: "#", website: null, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "s4", userId: "u4", name: "James Hartfield", title: "M&A Strategy Director", bio: "Advises on cross-border mergers, acquisitions, and post-merger integration for financial institutions.", avatar: null, expertiseAreas: ["Mergers & Acquisitions", "Financial Strategy", "Risk Management"], yearsOfExperience: 18, linkedIn: "#", website: null, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "s5", userId: "u5", name: "Priya Patel", title: "Technology & AI Strategist", bio: "Drives AI/ML adoption and technology modernization roadmaps for enterprise organizations.", avatar: null, expertiseAreas: ["Technology Adoption", "Data & Analytics", "Digital Transformation"], yearsOfExperience: 10, linkedIn: "#", website: null, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "s6", userId: "u6", name: "Dr. Kenji Tanaka", title: "Innovation & R&D Consultant", bio: "Leads innovation labs and R&D transformation programs for manufacturing and pharma sectors.", avatar: null, expertiseAreas: ["Innovation Strategy", "Technology Adoption", "Operational Excellence"], yearsOfExperience: 16, linkedIn: "#", website: null, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
]

const PLACEHOLDER_PROFILES: Record<string, CorporateProfile> = {
  c1: {
    id: "c1",
    name: "Aetna Dynamics",
    slug: "aetna-dynamics",
    description: "Global leader in enterprise digital transformation and AI-powered operational solutions serving Fortune 500 clients across 40+ countries.",
    mission: "To empower every enterprise to become an intelligent, adaptive organization through the strategic application of AI, automation, and human-centered design.",
    logo: null,
    coverImage: null,
    website: "https://aetnadynamics.io",
    industry: "Technology & Software",
    size: "5000+",
    location: "San Francisco, CA",
    founded: "2004",
    isVerified: true,
    memberCount: 342,
    projectCount: 28,
    strategistCount: 6,
    innovationScore: 94,
    partnershipStatus: "platinum",
    contactEmail: "partnerships@aetnadynamics.io",
    contactPhone: "+1 (415) 555-0189",
    socialLinks: { linkedin: "https://linkedin.com/company/aetna-dynamics", twitter: "https://twitter.com/aetnadynamics" },
    team: [
      { id: "t1", name: "Amara Sterling", title: "Chief Strategy Officer", role: "Executive Leadership", avatar: null },
      { id: "t2", name: "David Okoro", title: "VP of Innovation", role: "Executive Leadership", avatar: null },
      { id: "t3", name: "Lena Fischer", title: "Director of Strategic Partnerships", role: "Partnerships", avatar: null },
      { id: "t4", name: "Raj Mehta", title: "Head of AI Strategy", role: "Technology", avatar: null },
    ],
    strategists: PLACEHOLDER_STRATEGISTS.slice(0, 4),
    projects: [
      { id: "p1", title: "AI-Powered Operations Suite", description: "Building a comprehensive AI operations platform leveraging machine learning for predictive maintenance, supply chain optimization, and intelligent resource allocation.", innovationAreas: ["Artificial Intelligence & ML", "Cloud Computing"], status: "active", startDate: "2025-09-01", endDate: null, budget: 4500000 },
      { id: "p2", title: "Digital Twin Infrastructure", description: "Creating digital twin simulations of core infrastructure to enable real-time monitoring, scenario planning, and autonomous decision-making.", innovationAreas: ["Digital Twins", "Edge Computing & IoT"], status: "active", startDate: "2025-06-15", endDate: null, budget: 3200000 },
      { id: "p3", title: "Enterprise AI Governance Framework", description: "Developing an ethical AI governance framework encompassing bias detection, explainability, regulatory compliance, and responsible deployment.", innovationAreas: ["Artificial Intelligence & ML", "Cybersecurity"], status: "completed", startDate: "2024-03-01", endDate: "2025-02-28", budget: 1800000 },
    ],
    initiatives: [
      { id: "i1", title: "AI Ethics & Governance Board", description: "Establishing an independent board to oversee ethical AI deployment and algorithmic accountability.", area: "Artificial Intelligence & ML", progress: 75 },
      { id: "i2", title: "Net-Zero Data Centers", description: "Transitioning global data center operations to 100% renewable energy by 2028.", area: "Green Technology", progress: 45 },
      { id: "i3", title: "Strategic Innovation Lab", description: "In-house incubator for experimenting with emerging technologies and rapid prototyping.", area: "Robotics & Automation", progress: 90 },
    ],
  },
  c2: {
    id: "c2",
    name: "Meridian Capital Group",
    slug: "meridian-capital-group",
    description: "Premier investment banking and financial advisory firm specializing in cross-border M&A, capital raising, and strategic restructuring.",
    mission: "Delivering exceptional financial counsel and capital solutions that empower clients to achieve transformative growth and long-term value creation.",
    logo: null,
    coverImage: null,
    website: "https://meridiancap.com",
    industry: "Financial Services",
    size: "1001-5000",
    location: "New York, NY",
    founded: "1998",
    isVerified: true,
    memberCount: 218,
    projectCount: 19,
    strategistCount: 4,
    innovationScore: 87,
    partnershipStatus: "gold",
    contactEmail: "strategic-partnerships@meridiancap.com",
    contactPhone: "+1 (212) 555-0742",
    socialLinks: { linkedin: "https://linkedin.com/company/meridian-capital", twitter: null },
    team: [
      { id: "t5", name: "Jonathan Pierce", title: "Managing Partner", role: "Executive Leadership", avatar: null },
      { id: "t6", name: "Victoria Alvarez", title: "Head of Strategic Advisory", role: "Executive Leadership", avatar: null },
    ],
    strategists: PLACEHOLDER_STRATEGISTS.slice(2, 5),
    projects: [
      { id: "p4", title: "Cross-Border M&A Playbook", description: "Developing a comprehensive playbook for cross-border M&A execution across emerging markets.", innovationAreas: ["Financial Strategy", "Risk Management"], status: "active", startDate: "2025-04-01", endDate: null, budget: 2800000 },
      { id: "p5", title: "ESG Investment Framework", description: "Creating an ESG-integrated investment framework for evaluating portfolio companies.", innovationAreas: ["Sustainability & ESG", "Financial Strategy"], status: "active", startDate: "2025-07-01", endDate: null, budget: 1500000 },
    ],
    initiatives: [
      { id: "i4", title: "FinTech Innovation Fund", description: "Venture fund focused on early-stage FinTech disrupting traditional banking and capital markets.", area: "Blockchain & Web3", progress: 60 },
      { id: "i5", title: "AI-Driven Risk Analytics", description: "Implementing machine learning models for real-time portfolio risk assessment.", area: "Artificial Intelligence & ML", progress: 35 },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(PLACEHOLDER_PROFILES).map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const profile = PLACEHOLDER_PROFILES[id]
  if (!profile) return { title: "Organization Not Found" }
  return {
    title: profile.name,
    description: profile.description,
  }
}

export default async function CorporateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const profile = PLACEHOLDER_PROFILES[id]

  if (!profile) {
    notFound()
  }

  return <CorporateProfileClient profile={profile} />
}
