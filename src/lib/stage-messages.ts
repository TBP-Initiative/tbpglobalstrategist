export const stageOrder = ["CANDIDATE", "STRATEGIST", "CONTRIBUTOR", "PROJECT_ALIGNED", "SECTOR_LEAD", "PAID_ADVISER"] as const

export type Stage = typeof stageOrder[number]

const stageMessages: Record<Stage, { title: string; body: string }> = {
  CANDIDATE: {
    title: "Welcome as a Global Strategist Candidate",
    body: "You have been onboarded as a Candidate in The TBP Global Strategist pathway. Complete your profile and submit a reflection to progress to the next stage.",
  },
  STRATEGIST: {
    title: "Congratulations — You Are Now a TBP Global Strategist",
    body: "You have been recognised as a TBP Global Strategist. You can now browse and contribute to active TBP projects. Welcome to the next phase of your journey.",
  },
  CONTRIBUTOR: {
    title: "You Are Now a Strategic Contributor",
    body: "You are now recognised as a Strategic Contributor. Your active participation in TBP workstreams is acknowledged. Continue delivering high-quality contributions.",
  },
  PROJECT_ALIGNED: {
    title: "You Are Now Project-Aligned",
    body: "You have been aligned to a specific TBP project. Your focused contributions are driving measurable impact within the initiative.",
  },
  SECTOR_LEAD: {
    title: "You Are Now a Sector Lead",
    body: "You have been elevated to Sector Lead. You now coordinate contributors and support TBP's development process within your workstream.",
  },
  PAID_ADVISER: {
    title: "You Are Now a Paid Project Adviser",
    body: "You are now eligible for paid advisory, research, or implementation roles on active projects. You will be contacted regarding available opportunities.",
  },
}

export function getStageMessage(stage: Stage) {
  return stageMessages[stage]
}
