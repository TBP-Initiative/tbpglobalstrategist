export interface StrategistData {
  id: string
  name: string
  headline: string
  bio: string
  avatar: string
  isOnline: boolean
  verified: boolean
  role: string
  expertiseTags: string[]
  focus: {
    strategicDomain: string
    primaryContribution: string
    currentTbpFocus: string
    collaborationStatus: string
    memberSince: string
    basedIn: string
  }
  projects: {
    id: string
    title: string
    category: string
    role: string
    image: string
    description?: string
    contribution?: string
  }[]
  activities: {
    id: string
    title: string
    description: string
    date: string
    type: "publication" | "milestone" | "contribution" | "assignment"
  }[]
  stats: {
    projectsCompleted: number
    activeProjects: number
    publications: number
    networkSize: number
  }
}

export const strategistData: StrategistData = {
  id: "strat-001",
  name: "Dr. Elena Voss",
  headline: "Leading Strategic Innovation in Energy Infrastructure & Offshore Engineering",
  bio: "Dr. Elena Voss is a globally recognized strategist specializing in offshore energy infrastructure, floating systems, and cross-border energy corridors. With over 18 years of experience spanning engineering research, policy advisory, and large-scale infrastructure deployment, she currently leads TBP's strategic initiatives in the Neo-Polar Neutrality Global System (NPNGS) — focusing on resilient energy networks, maritime logistics, and Arctic engineering corridors.",
  avatar: "https://i.pravatar.cc/400?u=elena-voss",
  isOnline: true,
  verified: true,
  role: "TBP Global Strategist",
  expertiseTags: [
    "Engineering Research",
    "Offshore Platforms",
    "Energy Corridors",
    "Logistics Infrastructure",
    "Floating Systems",
    "Arctic Engineering",
    "Subsea Networks",
    "Maritime Strategy",
  ],
  focus: {
    strategicDomain: "Energy Infrastructure & Maritime Systems",
    primaryContribution: "Arctic Energy Corridor Design & Feasibility",
    currentTbpFocus: "Neo-Polar Neutrality Global System (NPNGS) — Energy Pillar Lead",
    collaborationStatus: "Open for Strategic Partnerships",
    memberSince: "March 2024",
    basedIn: "Reykjavik, Iceland",
  },
  projects: [
    {
      id: "proj-001",
      title: "Arctic Energy Corridor",
      category: "Energy Infrastructure",
      role: "Lead Strategist",
      image: "/images/project_images/tbp-new-york-neutral-trade-city.png",
      description: "Designing a transnational energy corridor connecting Arctic resources to global markets through neutral-zone infrastructure.",
      contribution: "Strategic framework design, stakeholder mapping, feasibility analysis",
    },
    {
      id: "proj-002",
      title: "Floating Logistics Platform",
      category: "Maritime Systems",
      role: "Senior Advisor",
      image: "https://images.unsplash.com/photo-1511406361295-0a1c2f4fd0c0?w=800",
      description: "Developing modular floating logistics hubs for polar and subsea operations.",
      contribution: "Concept validation, partner engagement, regulatory pathway",
    },
    {
      id: "proj-003",
      title: "Global Subsea Network",
      category: "Subsea Infrastructure",
      role: "Research Lead",
      image: "https://images.unsplash.com/photo-1559128010-7c1ad2e1b8a9?w=800",
      description: "Mapping and designing next-generation subsea cable and pipeline corridors.",
      contribution: "Route optimization, environmental assessment, cost modeling",
    },
    {
      id: "proj-004",
      title: "Neutral Zone Trade Protocol",
      category: "Trade & Policy",
      role: "Policy Advisor",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      description: "Framing trade and transit protocols for neutral-zone energy and resource corridors.",
      contribution: "Legal framework, cross-border governance model",
    },
    {
      id: "proj-005",
      title: "Offshore Wind Grid Integration",
      category: "Renewable Energy",
      role: "Technical Strategist",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800",
      description: "Integrating large-scale offshore wind into Arctic and sub-Arctic energy grids.",
      contribution: "Grid architecture, storage requirements, seasonal modeling",
    },
    {
      id: "proj-006",
      title: "Polar Logistics Resilience",
      category: "Logistics",
      role: "Co-Lead",
      image: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=800",
      description: "Building climate-resilient supply chain networks for high-latitude operations.",
      contribution: "Risk framework, alternative routing, infrastructure gap analysis",
    },
  ],
  activities: [
    {
      id: "act-001",
      title: "Concept Paper Published",
      description: "Published 'Arctic Energy Corridors: A Neutral-Zone Framework for Polar Infrastructure Development' in the Journal of Global Energy Strategy.",
      date: "2 weeks ago",
      type: "publication",
    },
    {
      id: "act-002",
      title: "Research Contribution",
      description: "Submitted technical feasibility report on floating platform modular architecture for the NPNGS Maritime Working Group.",
      date: "1 month ago",
      type: "contribution",
    },
    {
      id: "act-003",
      title: "Project Milestone",
      description: "Completed Phase II stakeholder engagement for the Arctic Energy Corridor, securing commitments from 12 partner organizations.",
      date: "2 months ago",
      type: "milestone",
    },
    {
      id: "act-004",
      title: "Working Group Assignment",
      description: "Appointed lead of the NPNGS Energy Infrastructure Working Group, coordinating 28 strategists across 14 countries.",
      date: "3 months ago",
      type: "assignment",
    },
    {
      id: "act-005",
      title: "Summit Presentation",
      description: "Keynote presentation at the TBP Global Strategy Summit on 'Engineering the Future of Polar Energy Systems.'",
      date: "4 months ago",
      type: "milestone",
    },
    {
      id: "act-006",
      title: "Publication Released",
      description: "Co-authored 'Subsea Network Resilience in High-Latitude Environments' published in collaboration with the Arctic Research Consortium.",
      date: "5 months ago",
      type: "publication",
    },
  ],
  stats: {
    projectsCompleted: 24,
    activeProjects: 6,
    publications: 37,
    networkSize: 12800,
  },
}
