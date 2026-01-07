"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Letter, LetterInsert, LetterUpdate, LetterType } from "@/lib/types"

// Get all letters for a case
export async function getLettersForCase(caseId: string): Promise<Letter[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("letters")
    .select("*")
    .eq("case_id", caseId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching letters:", error)
    return []
  }

  return data as Letter[]
}

// Get a single letter by ID
export async function getLetter(letterId: string): Promise<Letter | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("letters")
    .select("*")
    .eq("id", letterId)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching letter:", error)
    return null
  }

  return data as Letter
}

// Get the most recent letter of a specific type for a case
export async function getLatestLetterByType(
  caseId: string,
  letterType: LetterType
): Promise<Letter | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("letters")
    .select("*")
    .eq("case_id", caseId)
    .eq("user_id", user.id)
    .eq("letter_type", letterType)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error fetching letter by type:", error)
  }

  return data as Letter | null
}

// Create a new letter
export async function createLetter(
  caseId: string,
  letterData: {
    letter_type: LetterType
    subject: string | null
    body: string
    tone?: string
  }
): Promise<Letter | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const insertData: LetterInsert = {
    case_id: caseId,
    user_id: user.id,
    letter_type: letterData.letter_type,
    subject: letterData.subject,
    body: letterData.body,
    tone: letterData.tone || "assertive",
  }

  const { data, error } = await supabase
    .from("letters")
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error("Error creating letter:", error)
    return null
  }

  revalidatePath(`/cases/${caseId}`)

  return data as Letter
}

// Update an existing letter
export async function updateLetter(
  letterId: string,
  updates: LetterUpdate
): Promise<Letter | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("letters")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", letterId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating letter:", error)
    return null
  }

  // Get case_id from the letter for revalidation
  if (data) {
    revalidatePath(`/cases/${data.case_id}`)
  }

  return data as Letter
}

// Delete a letter
export async function deleteLetter(letterId: string): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  // First get the letter to know the case_id for revalidation
  const { data: letter } = await supabase
    .from("letters")
    .select("case_id")
    .eq("id", letterId)
    .eq("user_id", user.id)
    .single()

  const { error } = await supabase
    .from("letters")
    .delete()
    .eq("id", letterId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error deleting letter:", error)
    return false
  }

  if (letter) {
    revalidatePath(`/cases/${letter.case_id}`)
  }

  return true
}

// Get letter count by type for a case
export async function getLetterCountsByType(
  caseId: string
): Promise<Record<LetterType, number>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const defaultCounts: Record<LetterType, number> = {
    initial: 0,
    "follow-up": 0,
    "letter-before-action": 0,
    escalation: 0,
    chargeback: 0,
    "response-counter": 0,
  }

  if (!user) return defaultCounts

  const { data, error } = await supabase
    .from("letters")
    .select("letter_type")
    .eq("case_id", caseId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching letter counts:", error)
    return defaultCounts
  }

  // Count letters by type
  const counts = { ...defaultCounts }
  for (const letter of data) {
    const type = letter.letter_type as LetterType
    if (type in counts) {
      counts[type]++
    }
  }

  return counts
}
