export interface Programme {
  name: string
  price: string
  amountGBP: number
  duration: string
  features: string[]
}

export const PROGRAMMES: Record<"STANDARD" | "PLUS", Programme> = {
  STANDARD: {
    name: "TBP Global Strategist Fellowship",
    price: "£2,500",
    amountGBP: 250000,
    duration: "12\u201324 weeks",
    features: [
      "Guided DESQUELET\u00AE learning pathway",
      "TBP Global Strategist Portal access",
      "Primary Project + up to 2 Supporting Projects",
      "Public profile and portfolio development",
      "Feedback and progress review",
      "Certificate of Completion",
      "Verified Project Experience Record",
    ],
  },
  PLUS: {
    name: "Applied R&D & Technology Development",
    price: "£7,500",
    amountGBP: 750000,
    duration: "16\u201324 weeks",
    features: [
      "Core Fellowship learning + DESQUELET\u00AE",
      "One approved TBP R&D project",
      "Research / engineering / software development",
      "Modelling, simulation or prototyping where relevant",
      "Structured technical reviews",
      "Applied R&D Project Record",
      "Professional evidence portfolio",
    ],
  },
}