export type DesqueletStageKey = "D" | "E1" | "S" | "Q" | "U" | "E2" | "L" | "E3" | "T"

export interface DesqueletStageConfig {
  key: DesqueletStageKey
  letter: string
  name: string
  fullName: string
  description: string
  prompts: string[]
  evidenceCategories: string[]
}

export const DESQUELET_STAGES: DesqueletStageConfig[] = [
  {
    key: "D",
    letter: "D",
    name: "Deep Understanding",
    fullName: "D — Deep Understanding",
    description: "Demonstrate your understanding of the core problem or challenge you are addressing.",
    prompts: [
      "What is the fundamental problem or challenge you are addressing?",
      "Who are the primary stakeholders affected by this issue?",
      "What is the context and background of this challenge?",
      "What assumptions are you making about the problem?",
      "What would success look like if this problem were solved?",
      "What constraints or limitations define the scope of this challenge?",
    ],
    evidenceCategories: ["literature", "precedent_studies", "stakeholder_maps", "background_research", "problem_statement"],
  },
  {
    key: "E1",
    letter: "E",
    name: "Exploration of Systems",
    fullName: "E — Exploration of Systems",
    description: "Map the systems, structures, and forces that shape this challenge.",
    prompts: [
      "What existing systems or structures are relevant to this challenge?",
      "What competing solutions or approaches already exist?",
      "What regulatory or institutional frameworks apply?",
      "What are the interdependencies between systems involved?",
      "What precedent studies inform your understanding?",
      "What external factors or trends influence this system?",
    ],
    evidenceCategories: ["literature", "precedent_studies", "competing_solutions", "regulatory_documents", "comparable_technologies", "system_maps"],
  },
  {
    key: "S",
    letter: "S",
    name: "Strategic Planning",
    fullName: "S — Strategic Planning",
    description: "Develop a clear strategic approach to addressing the challenge.",
    prompts: [
      "What is your strategic approach to this challenge?",
      "What are the key objectives you aim to achieve?",
      "What resources or capabilities are required?",
      "What are the critical milestones or decision points?",
      "How does your strategy align with broader goals?",
      "What risks or obstacles could derail this strategy?",
    ],
    evidenceCategories: ["strategic_plan", "project_plan", "resource_analysis", "risk_assessment", "milestone_map"],
  },
  {
    key: "Q",
    letter: "Q",
    name: "Questioning",
    fullName: "Q — Questioning",
    description: "Challenge assumptions and ask critical questions that refine your approach.",
    prompts: [
      "What assumptions are you questioning about this challenge?",
      "What would happen if the opposite of your assumption were true?",
      "What questions emerged from your systems exploration?",
      "What did you initially get wrong or misunderstand?",
      "What perspectives have you not yet considered?",
      "How has your understanding changed through questioning?",
    ],
    evidenceCategories: ["assumption_log", "question_journal", "perspective_analysis", "contradiction_documentation"],
  },
  {
    key: "U",
    letter: "U",
    name: "Unique Framing",
    fullName: "U — Unique Framing",
    description: "Develop a distinctive perspective or framing that sets your approach apart.",
    prompts: [
      "What is your unique perspective on this challenge?",
      "How does your framing differ from conventional approaches?",
      "What new insight emerged from your questioning phase?",
      "How would you articulate this framing to a stakeholder?",
      "What makes this framing particularly effective?",
      "How does this framing guide your next steps?",
    ],
    evidenceCategories: ["framing_document", "stakeholder_presentation", "unique_insight", "position_paper"],
  },
  {
    key: "E2",
    letter: "E",
    name: "Effective Engagement",
    fullName: "E — Effective Engagement",
    description: "Demonstrate how you engage with stakeholders, teams, and the challenge itself.",
    prompts: [
      "Who are the key stakeholders you need to engage?",
      "What engagement approach will you use?",
      "How will you communicate your findings or proposal?",
      "What feedback have you received from stakeholders?",
      "How have you adapted your approach based on engagement?",
      "What collaboration or partnership opportunities exist?",
    ],
    evidenceCategories: ["meeting_notes", "stakeholder_feedback", "supervisor_comments", "correspondence", "presentation", "engagement_log"],
  },
  {
    key: "L",
    letter: "L",
    name: "Learning Through Simulation",
    fullName: "L — Learning Through Simulation",
    description: "Test your approach through simulation, prototyping, or modelling.",
    prompts: [
      "What did you simulate or prototype?",
      "What was the methodology used for testing?",
      "What were the key results or findings?",
      "What assumptions were validated or invalidated?",
      "What unexpected outcomes emerged?",
      "How will these results inform your next steps?",
    ],
    evidenceCategories: ["simulation_file", "animated_result", "calculation_spreadsheet", "graph", "technical_diagram", "supporting_paper", "video", "model_output"],
  },
  {
    key: "E3",
    letter: "E",
    name: "Execution Model",
    fullName: "E — Execution Model",
    description: "Define how your approach will be implemented in practice.",
    prompts: [
      "What is your execution model or implementation plan?",
      "What are the key phases or stages of implementation?",
      "What resources, tools, or technologies are required?",
      "What are the dependencies and critical path?",
      "How will you measure success during execution?",
      "What contingency plans exist for potential setbacks?",
    ],
    evidenceCategories: ["execution_plan", "implementation_roadmap", "resource_plan", "gantt_chart", "technical_specification", "workflow_diagram"],
  },
  {
    key: "T",
    letter: "T",
    name: "Transferability",
    fullName: "T — Transferability",
    description: "Demonstrate how your work can be applied beyond the immediate context.",
    prompts: [
      "How can this approach be applied to other contexts?",
      "What is the transferable methodology or framework?",
      "What lessons learned are broadly applicable?",
      "How could this work inform similar challenges elsewhere?",
      "What documentation or knowledge transfer is needed?",
      "What is the scalability potential of this approach?",
    ],
    evidenceCategories: ["transferability_report", "methodology_document", "case_study", "knowledge_transfer_plan", "scalability_analysis"],
  },
]

export const DESQUELET_STAGE_MAP: Record<DesqueletStageKey, DesqueletStageConfig> = Object.fromEntries(
  DESQUELET_STAGES.map((s) => [s.key, s])
) as Record<DesqueletStageKey, DesqueletStageConfig>

export const DESQUELET_STAGE_ORDER: DesqueletStageKey[] = ["D", "E1", "S", "Q", "U", "E2", "L", "E3", "T"]

export function getStageConfig(key: DesqueletStageKey): DesqueletStageConfig | undefined {
  return DESQUELET_STAGE_MAP[key]
}

export function getStageByLetter(letter: string): DesqueletStageConfig | undefined {
  return DESQUELET_STAGES.find((s) => s.letter === letter)
}
