import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getStripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { promoCode } = await request.json()

    if (!promoCode || typeof promoCode !== "string") {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 })
    }

    const stripe = getStripe()

    // Look up the promotion code
    const promotionCodes = await stripe.promotionCodes.list({
      code: promoCode.toUpperCase(),
      active: true,
      limit: 1,
    })

    if (promotionCodes.data.length === 0) {
      return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 400 })
    }

    const promoCodeData = promotionCodes.data[0]
    const coupon = promoCodeData.coupon

    // Build discount description
    let discountText = ""
    if (coupon.percent_off) {
      discountText = `${coupon.percent_off}% off`
    } else if (coupon.amount_off) {
      const currency = coupon.currency?.toUpperCase() || "GBP"
      const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : currency
      discountText = `${symbol}${(coupon.amount_off / 100).toFixed(2)} off`
    }

    return NextResponse.json({
      valid: true,
      code: promoCode.toUpperCase(),
      discount: discountText,
      name: coupon.name || promoCode.toUpperCase(),
    })
  } catch (error) {
    console.error("Promo validation error:", error)
    return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 })
  }
}
