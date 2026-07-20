import Stripe from "stripe"

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set")
    _stripe = new Stripe(key, { apiVersion: "2025-06-30.basil" })
  }
  return _stripe
}

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
