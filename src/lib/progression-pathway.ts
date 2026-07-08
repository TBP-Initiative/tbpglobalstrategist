export interface ProgressionStageInfo {
  stage: string
  title: string
  summary: string
  focus: string
  tasks: string[]
  typicalOutputs: string[]
  nextStage?: {
    name: string
    requirements: string[]
  }
}

export const stageOrder = [
  "CANDIDATE",
  "STRATEGIST",
  "CONTRIBUTOR",
  "PROJECT_ALIGNED",
  "SECTOR_LEAD",
  "PAID_ADVISER",
] as const

export type Stage = (typeof stageOrder)[number]

export const pathwayData: Record<Stage, ProgressionStageInfo> = {
  CANDIDATE: {
    stage: "CANDIDATE",
    title: "Stage 1 — Global Strategist Candidate",
    summary:
      "You have been accepted into the onboarding pathway but have not yet been fully attached to a TBP workstream.",
    focus: "Learning and orientation",
    tasks: [
      "Review the relevant TBP pathway document",
      "Complete onboarding forms",
      "Sign the required agreement",
      "Complete any conflict of interest declaration",
      "Review the TBP Self-Onboarding Pack",
      "Understand the TBP system",
      "Understand NPNGS",
      "Understand TBP's physical project portfolio",
      "Understand the role of trust, capital and corridor participation",
      "Identify where your expertise may contribute",
      "Submit a one-page onboarding reflection if requested",
    ],
    typicalOutputs: [
      "A short reflection or introductory note explaining:",
      "— How the candidate understands TBP",
      "— Which sector they are most aligned with",
      "— Which TBP projects interest them",
      "— What expertise they can contribute",
      "— Any questions they want to explore during induction",
    ],
    nextStage: {
      name: "STRATEGIST",
      requirements: [
        "Complete all onboarding tasks",
        "Demonstrate understanding of TBP system",
        "Submit onboarding reflection if requested",
      ],
    },
  },

  STRATEGIST: {
    stage: "STRATEGIST",
    title: "Stage 2 — Global Strategist",
    summary:
      "You have completed initial onboarding and may be recognised as a TBP Global Strategist within an agreed sector or advisory track.",
    focus: "Exploratory and contribution-based learning while supporting selected internal workstreams",
    tasks: [
      "Attach to one or more work areas such as Capital Advisory, Engineering, Architecture, AI Automation, Software Development, Energy, Maritime, Logistics, Policy, Communications, or Regional Development",
      "Learn TBP while beginning to support selected internal workstreams",
      "Prepare research notes, project summaries, or sector opportunity maps",
      "Contribute technical observations or strategic memos",
    ],
    typicalOutputs: [
      "Research notes",
      "Project summaries",
      "Sector opportunity maps",
      "Technical observations",
      "Strategic memos",
      "Design concept notes",
      "Investor or stakeholder profiles",
      "Market intelligence summaries",
      "Regional briefings",
      "Internal presentation material",
    ],
    nextStage: {
      name: "CONTRIBUTOR",
      requirements: [
        "Demonstrate reliability and quality in contributions",
        "Build sector knowledge and understanding",
        "Show ability to produce useful outputs for workstreams",
      ],
    },
  },

  CONTRIBUTOR: {
    stage: "CONTRIBUTOR",
    title: "Stage 3 — Strategic Contributor",
    summary:
      "You begin to contribute more actively to defined TBP workstreams and support internal development work.",
    focus:
      "Active contribution — TBP assesses your working style, reliability, judgement, sector understanding and ability to contribute constructively",
    tasks: [
      "Contribute to project mapping and technical research",
      "Support design development and engineering review",
      "Prepare economic impact assumptions and stakeholder mapping",
      "Contribute to investor intelligence and AI workflow development",
      "Participate in platform planning and corridor analysis",
      "Prepare briefing packs and internal coordination notes",
    ],
    typicalOutputs: [
      "Capital Advisory: preparing family office profiles or private-market investor maps",
      "Engineering: reviewing ASMOFP platform use cases or offshore infrastructure assumptions",
      "Architecture: developing neutral trade city spatial logic or building-use concepts",
      "Software Development: drafting AI automation workflow architecture or dashboard logic",
      "Energy: mapping hydrogen, offshore energy or storage opportunities",
      "Maritime: analysing port, airport and offshore logistics connectivity",
      "Policy: preparing government or institutional stakeholder maps",
      "Communications: creating messaging frameworks or campaign briefs",
    ],
    nextStage: {
      name: "PROJECT_ALIGNED",
      requirements: [
        "Demonstrate strong working style and reliability",
        "Show deep sector understanding",
        "Produce consistently high-quality contributions",
        "Show ability to work constructively within teams",
      ],
    },
  },

  PROJECT_ALIGNED: {
    stage: "PROJECT_ALIGNED",
    title: "Stage 4 — Project-Aligned Strategist",
    summary:
      "You may be attached to a specific TBP project, corridor, capital circle, technical workstream or regional initiative.",
    focus:
      "Contributing to a defined area of project development — no longer only learning TBP generally",
    tasks: [
      "Contribute to project brief development and technical notes",
      "Support concept design inputs and engineering assumptions",
      "Assist with project-owner preparation and investor-readiness material",
      "Contribute to stakeholder mapping and regional market analysis",
      "Support economic impact research and design standards",
      "Develop AI workflow prototypes and presentation decks",
      "Build internal project dashboards",
    ],
    typicalOutputs: [
      "Project brief development",
      "Technical notes",
      "Concept design inputs",
      "Engineering assumptions",
      "Project-owner preparation",
      "Investor-readiness material",
      "Stakeholder mapping",
      "Regional market analysis",
      "Economic impact research",
      "Design standards",
      "AI workflow prototypes",
      "Presentation decks",
      "Internal project dashboards",
    ],
    nextStage: {
      name: "SECTOR_LEAD",
      requirements: [
        "Demonstrate strong understanding of TBP methodologies",
        "Show leadership potential within workstream",
        "Produce consistently excellent project outputs",
        "Help coordinate and guide other contributors",
      ],
    },
  },

  SECTOR_LEAD: {
    stage: "SECTOR_LEAD",
    title: "Stage 5 — Sector Lead or Workstream Lead",
    summary:
      "You have demonstrated strong understanding, reliability and sector capability and may be considered for a more senior internal role.",
    focus: "Coordinating contributors, organising research, preparing work plans, reviewing outputs and supporting TBP's internal project development process",
    tasks: [
      "Coordinate a small team or project group",
      "Set research priorities and review contributor outputs",
      "Prepare structured briefing notes",
      "Support internal project planning",
      "Align sector work with TBP's wider strategy",
      "Identify gaps in research, technical assumptions or documentation",
      "Support project-readiness development",
      "Report progress to TBP leadership",
    ],
    typicalOutputs: [
      "Team coordination and task assignment",
      "Research priority setting",
      "Output review and quality assurance",
      "Structured briefing notes",
      "Internal project plans",
      "Sector alignment with TBP strategy",
      "Gap analysis reports",
      "Progress reports to leadership",
    ],
    nextStage: {
      name: "PAID_ADVISER",
      requirements: [
        "Project activation and funding availability",
        "Formal approval and role suitability",
        "Strong contribution history and performance",
        "Availability and conflict checks",
        "Compliance review and agreed terms of engagement",
      ],
    },
  },

  PAID_ADVISER: {
    stage: "PAID_ADVISER",
    title: "Stage 6 — Paid Project Adviser, Specialist or Implementation Contributor",
    summary:
      "Where a TBP project becomes active, funded, formally mandated or enters implementation, selected strategists may be considered for paid roles.",
    focus: "Paid advisory, research, coordination, technical, design or implementation roles on active projects",
    tasks: [
      "Await project activation and funding availability",
      "Undergo formal approval and role suitability assessment",
      "Demonstrate strong contribution history and performance",
      "Complete conflict checks and compliance review",
      "Agree to terms of engagement and project-level documentation",
    ],
    typicalOutputs: [
      "Paid capital advisory support",
      "Paid engineering review",
      "Paid architecture or design support",
      "Paid software development work",
      "Paid AI automation development",
      "Paid research or economic impact modelling",
      "Paid stakeholder coordination",
      "Paid communications or media support",
      "Paid project management support",
      "Paid technical documentation",
      "Paid regional corridor development support",
    ],
  },
}

export function getPathwayForStage(stage: string): ProgressionStageInfo | null {
  const key = stage.toUpperCase() as Stage
  return pathwayData[key] ?? null
}
