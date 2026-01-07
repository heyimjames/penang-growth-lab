import Stripe from "stripe"

// Lazy initialization to avoid build-time errors when env vars aren't set
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set")
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-05-28.basil",
      typescript: true,
    })
  }
  return stripeInstance
}

// Price IDs from Stripe Dashboard
export const PRICE_IDS = {
  SINGLE_CASE: "price_1SlxzlErQHM0ygppTNJ25H77",
  CASE_BUNDLE: "price_1SlxzmErQHM0ygppVH6GdH2j",
} as const

export const CREDIT_AMOUNTS: Record<string, number> = {
  [PRICE_IDS.SINGLE_CASE]: 1,
  [PRICE_IDS.CASE_BUNDLE]: 5,
}

export type PriceId = (typeof PRICE_IDS)[keyof typeof PRICE_IDS]
