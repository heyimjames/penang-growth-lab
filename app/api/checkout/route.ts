import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getStripe, PRICE_IDS } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { priceId, promoCode } = await request.json()

    // Validate price ID
    if (!Object.values(PRICE_IDS).includes(priceId)) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 })
    }

    // Validate promo code if provided
    let promotionCodeId: string | undefined
    if (promoCode) {
      try {
        const promotionCodes = await stripe.promotionCodes.list({
          code: promoCode,
          active: true,
          limit: 1,
        })
        if (promotionCodes.data.length > 0) {
          promotionCodeId = promotionCodes.data[0].id
        } else {
          return NextResponse.json({ error: "Invalid promo code" }, { status: 400 })
        }
      } catch {
        return NextResponse.json({ error: "Invalid promo code" }, { status: 400 })
      }
    }

    // Get or create Stripe customer
    let customerId: string | undefined

    // Check if user already has a Stripe customer ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      // Store customer ID in profile
      await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
        })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?payment=cancelled`,
      allow_promotion_codes: !promotionCodeId, // Allow manual entry if no code pre-applied
      discounts: promotionCodeId ? [{ promotion_code: promotionCodeId }] : undefined,
      metadata: {
        user_id: user.id,
        price_id: priceId,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
