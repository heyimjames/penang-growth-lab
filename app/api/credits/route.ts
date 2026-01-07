import { NextResponse } from "next/server"
import { createApiClient } from "@/lib/supabase/api"

export async function GET() {
  try {
    const supabase = await createApiClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's credits from profiles table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (error) {
      console.error("Error fetching credits:", error)
      return NextResponse.json(
        { error: "Failed to fetch credits" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      credits: profile?.credits ?? 0,
    })
  } catch (error) {
    console.error("Credits fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    )
  }
}
