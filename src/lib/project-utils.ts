export const PREDEFINED_MILESTONES = [
  { title: "Concept Development", weight: 10 },
  { title: "Feasibility Study", weight: 15 },
  { title: "Strategic Approval", weight: 20 },
  { title: "Technical Design", weight: 20 },
  { title: "Implementation", weight: 25 },
  { title: "Final Deployment", weight: 10 },
] as const

export function milestoneWeight(title: string): number {
  const found = PREDEFINED_MILESTONES.find((m) => m.title === title)
  return found?.weight ?? 1
}

export function computeProgress(milestones: { completed: boolean; weight?: number }[]): number {
  if (milestones.length === 0) return 0
  const totalWeight = milestones.reduce((sum, m) => sum + (m.weight ?? 1), 0)
  const completedWeight = milestones.reduce((sum, m) => (m.completed ? sum + (m.weight ?? 1) : sum), 0)
  return Math.round((completedWeight / totalWeight) * 100)
}

export function progressToStage(progress: number): string {
  if (progress === 100) return "Completed"
  if (progress >= 86) return "Scaling"
  if (progress >= 71) return "Active"
  if (progress >= 56) return "Pilot"
  if (progress >= 36) return "Development"
  if (progress >= 16) return "Planning"
  if (progress >= 1) return "Research"
  return "Concept"
}
