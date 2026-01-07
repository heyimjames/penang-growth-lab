import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: caseData, error } = await supabase
      .from("cases")
      .select(`
        id,
        title,
        company_name,
        company_domain,
        complaint,
        status,
        confidence_score,
        identified_issues,
        legal_basis,
        company_intel,
        generated_letter,
        created_at,
        updated_at
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Case not found" },
          { status: 404 }
        )
      }
      console.error("Error fetching case:", error)
      return NextResponse.json(
        { error: "Failed to fetch case" },
        { status: 500 }
      )
    }

    return NextResponse.json(caseData)
  } catch (error) {
    console.error("Case fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch case" },
      { status: 500 }
    )
  }
}
