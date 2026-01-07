import { NextResponse } from "next/server"
import { createApiClient } from "@/lib/supabase/api"

export async function GET() {
  try {
    const supabase = await createApiClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json(
      { user: null, error: "Failed to check session" },
      { status: 500 }
    )
  }
}
