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

    const { data: cases, error } = await supabase
      .from("cases")
      .select(`
        id,
        title,
        company_name,
        company_domain,
        status,
        confidence_score,
        identified_issues,
        legal_basis,
        created_at,
        updated_at
      `)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching cases:", error)
      return NextResponse.json(
        { error: "Failed to fetch cases" },
        { status: 500 }
      )
    }

    return NextResponse.json(cases || [])
  } catch (error) {
    console.error("Cases fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch cases" },
      { status: 500 }
    )
  }
}
