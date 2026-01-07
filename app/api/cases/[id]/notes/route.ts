import { type NextRequest, NextResponse } from "next/server"
import { createApiClient } from "@/lib/supabase/api"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createApiClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Verify user owns this case
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json(
        { error: "Case not found" },
        { status: 404 }
      )
    }

    const { data: notes, error } = await supabase
      .from("case_notes")
      .select("*")
      .eq("case_id", id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching notes:", error)
      return NextResponse.json(
        { error: "Failed to fetch notes" },
        { status: 500 }
      )
    }

    return NextResponse.json(notes || [])
  } catch (error) {
    console.error("Notes fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createApiClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, source = "extension" } = body

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    // Verify user owns this case
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json(
        { error: "Case not found" },
        { status: 404 }
      )
    }

    const { data: note, error } = await supabase
      .from("case_notes")
      .insert({
        case_id: id,
        user_id: user.id,
        content: content.trim(),
        source,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating note:", error)
      return NextResponse.json(
        { error: "Failed to create note" },
        { status: 500 }
      )
    }

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("Note creation error:", error)
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    )
  }
}
