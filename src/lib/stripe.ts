import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-06-30.basil",
})

export const STRIPE_PLANS = {
  STANDARD: {
    amount: 120000,
    currency: "usd",
    name: "Standard Fellowship",
    description: "TBP Global Strategist Fellowship - Standard Pathway",
  },
  PLUS: {
    amount: 150000,
    currency: "usd",
    name: "Fellowship Plus",
    description: "TBP Global Strategist Fellowship - Plus Pathway",
  },
} as const
