import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { getStripe, CREDIT_AMOUNTS, PRICE_IDS } from "@/lib/stripe"
import { addCredits } from "@/lib/actions/credits"
import type Stripe from "stripe"

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session

      // Get user ID and price ID from metadata
      const userId = session.metadata?.user_id
      const priceId = session.metadata?.price_id

      if (!userId || !priceId) {
        console.error("Missing metadata in checkout session")
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
      }

      // Determine credit amount and type
      const creditAmount = CREDIT_AMOUNTS[priceId]
      const type = priceId === PRICE_IDS.CASE_BUNDLE ? "bundle_purchase" : "purchase"

      if (!creditAmount) {
        console.error("Unknown price ID:", priceId)
        return NextResponse.json({ error: "Unknown price" }, { status: 400 })
      }

      // Add credits to user account
      const newBalance = await addCredits(
        userId,
        creditAmount,
        type,
        type === "bundle_purchase"
          ? "Purchased 5-case bundle"
          : `Purchased ${creditAmount} case credit`,
        "stripe",
        session.payment_intent as string
      )

      if (newBalance === null) {
        console.error("Failed to add credits for user:", userId)
        return NextResponse.json({ error: "Failed to add credits" }, { status: 500 })
      }

      console.log(`Added ${creditAmount} credits to user ${userId}. New balance: ${newBalance}`)
      break
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error("Payment failed:", paymentIntent.id)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
