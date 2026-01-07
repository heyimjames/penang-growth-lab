"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Case, CaseInsert, CaseUpdate } from "@/lib/types"

export async function getCases(): Promise<Case[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching cases:", error)
    return []
  }

  return data || []
}

export async function getCase(id: string): Promise<Case | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase.from("cases").select("*").eq("id", id).eq("user_id", user.id).single()

  if (error) {
    console.error("Error fetching case:", error)
    return null
  }

  return data
}

export async function createCase(caseData: Omit<CaseInsert, "user_id">): Promise<Case | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error("createCase failed: No authenticated user found")
    return null
  }

  const { data, error } = await supabase
    .from("cases")
    .insert({
      ...caseData,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating case:", error.message, error.code, error.details)
    return null
  }

  revalidatePath("/dashboard")
  revalidatePath("/cases")

  return data
}

export async function updateCase(id: string, updates: CaseUpdate): Promise<Case | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("cases")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating case:", error)
    return null
  }

  revalidatePath("/dashboard")
  revalidatePath("/cases")
  revalidatePath(`/cases/${id}`)

  return data
}

export async function deleteCase(id: string): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase.from("cases").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting case:", error)
    return false
  }

  revalidatePath("/dashboard")
  revalidatePath("/cases")

  return true
}

export async function getCaseStats() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { total: 0, active: 0, resolved: 0, draft: 0 }

  const { data, error } = await supabase.from("cases").select("status").eq("user_id", user.id)

  if (error || !data) {
    return { total: 0, active: 0, resolved: 0, draft: 0 }
  }

  return {
    total: data.length,
    active: data.filter((c) => ["submitted", "in_progress", "awaiting_response"].includes(c.status)).length,
    resolved: data.filter((c) => c.status === "resolved").length,
    draft: data.filter((c) => c.status === "draft").length,
  }
}
