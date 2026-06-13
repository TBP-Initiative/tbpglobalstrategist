import type { Metadata } from "next"
import { CorporateDirectoryClient } from "./corporate-directory-client"

export const metadata: Metadata = {
  title: "Organizations",
  description:
    "Discover leading enterprises and organizations partnered with TBP Global Strategists.",
}

// ── Placeholder data ──────────────────────────────────────────────
export interface CorporateItem {
  id: string
  name: string
  slug: string
  description: string
  logo: string | null
  industry: string
  size: string | null
  location: string | null
  memberCount: number
  isVerified: boolean
  isFeatured: boolean
  website: string | null
}

const SIZES = ["2-10", "11-50", "51-200", "201-1000", "1001-5000", "5000+"] as const

const PLACEHOLDER_CORPORATES: CorporateItem[] = [
  {
    id: "c1",
    name: "Aetna Dynamics",
    slug: "aetna-dynamics",
    description:
      "Global leader in enterprise digital transformation and AI-powered operational solutions serving Fortune 500 clients across 40+ countries.",
    logo: null,
    industry: "Technology & Software",
    size: "5000+",
    location: "San Francisco, CA",
    memberCount: 342,
    isVerified: true,
    isFeatured: true,
    website: "https://aetnadynamics.io",
  },
  {
    id: "c2",
    name: "Meridian Capital Group",
    slug: "meridian-capital-group",
    description:
      "Premier investment banking and financial advisory firm specializing in cross-border M&A, capital raising, and strategic restructuring.",
    logo: null,
    industry: "Financial Services",
    size: "1001-5000",
    location: "New York, NY",
    memberCount: 218,
    isVerified: true,
    isFeatured: true,
    website: "https://meridiancap.com",
  },
  {
    id: "c3",
    name: "Verdant Health Systems",
    slug: "verdant-health-systems",
    description:
      "Innovative healthcare provider network leveraging data science and telemedicine to deliver personalized patient outcomes at scale.",
    logo: null,
    industry: "Healthcare & Life Sciences",
    size: "5000+",
    location: "Boston, MA",
    memberCount: 156,
    isVerified: true,
    isFeatured: true,
    website: "https://verdanthealth.com",
  },
  {
    id: "c4",
    name: "Titan Manufacturing Corp",
    slug: "titan-manufacturing-corp",
    description:
      "Industry 4.0 pioneer in smart manufacturing, robotics integration, and sustainable industrial automation solutions.",
    logo: null,
    industry: "Manufacturing & Industrial",
    size: "201-1000",
    location: "Stuttgart, Germany",
    memberCount: 89,
    isVerified: true,
    isFeatured: false,
    website: "https://titanmfg.com",
  },
  {
    id: "c5",
    name: "Nova Energy Group",
    slug: "nova-energy-group",
    description:
      "Renewable energy conglomerate driving the global transition to clean power through solar, wind, and next-generation storage tech.",
    logo: null,
    industry: "Energy & Utilities",
    size: "1001-5000",
    location: "Houston, TX",
    memberCount: 134,
    isVerified: true,
    isFeatured: false,
    website: "https://novaenergy.com",
  },
  {
    id: "c6",
    name: "Atlas Retail Partners",
    slug: "atlas-retail-partners",
    description:
      "Omnichannel retail conglomerate operating premium brands across fashion, home goods, and specialty e-commerce verticals.",
    logo: null,
    industry: "Consumer Goods & Retail",
    size: "5000+",
    location: "London, UK",
    memberCount: 201,
    isVerified: false,
    isFeatured: false,
    website: "https://atlasretail.com",
  },
  {
    id: "c7",
    name: "Pulse Telecom",
    slug: "pulse-telecom",
    description:
      "Next-generation telecommunications provider building the infrastructure for 5G, fiber-optic, and satellite connectivity worldwide.",
    logo: null,
    industry: "Media & Telecommunications",
    size: "201-1000",
    location: "Tokyo, Japan",
    memberCount: 73,
    isVerified: true,
    isFeatured: false,
    website: "https://pulsetelecom.com",
  },
  {
    id: "c8",
    name: "Horizon Logistics",
    slug: "horizon-logistics",
    description:
      "End-to-end supply chain and logistics company using AI-driven route optimization and autonomous delivery fleets.",
    logo: null,
    industry: "Transportation & Logistics",
    size: "1001-5000",
    location: "Singapore",
    memberCount: 112,
    isVerified: false,
    isFeatured: false,
    website: "https://horizonlogistics.com",
  },
  {
    id: "c9",
    name: "Sage Education Trust",
    slug: "sage-education-trust",
    description:
      "Global education network spanning K-12, higher education, and professional certification with a focus on EdTech innovation.",
    logo: null,
    industry: "Education & Research",
    size: "201-1000",
    location: "Oxford, UK",
    memberCount: 67,
    isVerified: true,
    isFeatured: false,
    website: "https://sageeducation.org",
  },
  {
    id: "c10",
    name: "Delta Defense Aerospace",
    slug: "delta-defense-aerospace",
    description:
      "Advanced aerospace and defense contractor developing next-gen avionics, satellite systems, and hypersonic technologies.",
    logo: null,
    industry: "Aerospace & Defense",
    size: "5000+",
    location: "Seattle, WA",
    memberCount: 295,
    isVerified: true,
    isFeatured: true,
    website: "https://deltadefense.com",
  },
  {
    id: "c11",
    name: "Zenith Pharmaceuticals",
    slug: "zenith-pharmaceuticals",
    description:
      "Research-driven pharmaceutical company focused on breakthrough therapies in oncology, neurology, and rare diseases.",
    logo: null,
    industry: "Pharmaceuticals",
    size: "1001-5000",
    location: "Basel, Switzerland",
    memberCount: 178,
    isVerified: true,
    isFeatured: false,
    website: "https://zenithpharma.com",
  },
  {
    id: "c12",
    name: "Greenfield AgriTech",
    slug: "greenfield-agritech",
    description:
      "Sustainable agriculture technology company pioneering precision farming, vertical agriculture, and farm-to-table supply chains.",
    logo: null,
    industry: "Agriculture & Food",
    size: "51-200",
    location: "São Paulo, Brazil",
    memberCount: 45,
    isVerified: false,
    isFeatured: false,
    website: "https://greenfieldagri.com",
  },
]

const ITEMS_PER_PAGE = 6

export default function CorporatesPage() {
  return (
    <CorporateDirectoryClient
      corporates={PLACEHOLDER_CORPORATES}
      sizes={[...SIZES]}
      itemsPerPage={ITEMS_PER_PAGE}
    />
  )
}
