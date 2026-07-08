export interface StrategistCategory {
  id: string
  name: string
  description: string
}

export const STRATEGIST_CATEGORIES: StrategistCategory[] = [
  {
    id: "CAPITAL_ADVISORY",
    name: "Global Strategist – Capital Advisory",
    description: "Supports investor mapping, family office intelligence, private-market research, sovereign wealth and institutional investor profiling, capital-readiness documentation and project-owner preparation.",
  },
  {
    id: "ENGINEERING",
    name: "Global Strategist – Engineering",
    description: "Supports technical review, infrastructure logic, offshore platform analysis, systems engineering, modular construction thinking, energy infrastructure, maritime structures, logistics systems and project feasibility inputs.",
  },
  {
    id: "ARCHITECTURE",
    name: "Global Strategist – Architecture",
    description: "Supports neutral trade city concepts, building-use strategy, spatial planning, corridor-linked real estate, adaptive reuse of commercial buildings, design standards, user experience and infrastructure-led urban development.",
  },
  {
    id: "INTERIOR_ARCHITECTURE",
    name: "Global Strategist – Interior Architecture and Design",
    description: "Supports TBP office standardisation, corridor node interiors, trading-place environments, cultural spatial experience, hospitality-style business spaces, shared service zones and design identity across TBP locations.",
  },
  {
    id: "SOFTWARE_DEV",
    name: "Global Strategist – Software Development",
    description: "Supports TBP digital architecture, AI systems, automation workflows, platform logic, data tools, internal systems, dashboards, CRM structures, capital intelligence engines and corridor operating software.",
  },
  {
    id: "AI_AUTOMATION",
    name: "Global Strategist – AI Automation",
    description: "Supports automation of internal workflows, investor research, project mapping, document generation, due diligence workflows, data extraction, stakeholder intelligence and AI-assisted coordination tools.",
  },
  {
    id: "ENERGY_OFFSHORE",
    name: "Global Strategist – Energy and Offshore Infrastructure",
    description: "Supports energy corridor analysis, offshore energy systems, ASMOFP™ platform use cases, hydrogen, e-fuels, oil and gas transition infrastructure, storage, floating infrastructure and regional energy corridor strategy.",
  },
  {
    id: "MARITIME_LOGISTICS",
    name: "Global Strategist – Maritime, Ports and Logistics",
    description: "Supports maritime route analysis, port connectivity, transshipment logic, logistics mapping, airport-port-city integration, offshore platform logistics and supply-chain resilience.",
  },
  {
    id: "POLICY_GOVERNMENT",
    name: "Global Strategist – Policy and Government Relations",
    description: "Supports government mapping, public-sector engagement logic, institutional positioning, regional policy analysis, regulatory awareness and strategic public-sector briefing development.",
  },
  {
    id: "COMMUNICATIONS_MEDIA",
    name: "Global Strategist – Communications and Strategic Media",
    description: "Supports messaging, presentations, campaign content, media positioning, stakeholder briefing narratives, event communication, video scripts, thought-leadership content and strategic public-facing language.",
  },
  {
    id: "REGIONAL_CORRIDOR",
    name: "Global Strategist – Regional Corridor Development",
    description: "Supports market research, regional opportunity mapping, city selection, port and airport mapping, economic corridor assessment, stakeholder research and local strategic positioning.",
  },
]

export function getCategory(id: string | null | undefined): StrategistCategory | undefined {
  return STRATEGIST_CATEGORIES.find((c) => c.id === id)
}
