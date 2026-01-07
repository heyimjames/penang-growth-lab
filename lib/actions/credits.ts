"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface UserCredits {
  credits: number
  userId: string
}

export interface CreditTransaction {
  id: string
  amount: number
  type: string
  description: string | null
  caseId: string | null
  balanceAfter: number
  createdAt: string
}

/**
 * Get the current user's credit balance
 */
export async function getUserCredits(): Promise<UserCredits | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", user.id)
    .single()

  if (error) {
    // If no record exists, user might be new - return 0 credits
    // The trigger should have created the record, but handle edge case
    if (error.code === "PGRST116") {
      return { credits: 0, userId: user.id }
    }
    console.error("Error fetching user credits:", error)
    return null
  }

  return {
    credits: data.credits,
    userId: user.id,
  }
}

/**
 * Get the user's credit transaction history
 */
export async function getCreditTransactions(limit = 20): Promise<CreditTransaction[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("credit_transactions")
    .select("id, amount, type, description, case_id, balance_after, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching credit transactions:", error)
    return []
  }

  return data.map((t) => ({
    id: t.id,
    amount: t.amount,
    type: t.type,
    description: t.description,
    caseId: t.case_id,
    balanceAfter: t.balance_after,
    createdAt: t.created_at,
  }))
}

/**
 * Check if user has enough credits to create a case
 */
export async function hasCreditsForCase(): Promise<boolean> {
  const credits = await getUserCredits()
  return credits !== null && credits.credits >= 1
}

/**
 * Use a credit to create a case (called during case creation)
 * Returns true if successful, false if no credits available
 */
export async function useCredit(caseId: string): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  // Call the database function to atomically use a credit
  const { data, error } = await supabase.rpc("use_credit", {
    p_user_id: user.id,
    p_case_id: caseId,
  })

  if (error) {
    console.error("Error using credit:", error)
    return false
  }

  if (data === true) {
    // Revalidate dashboard layout to update credit display
    revalidatePath("/dashboard", "layout")
    revalidatePath("/cases", "layout")
    revalidatePath("/new", "layout")
  }

  return data === true
}

/**
 * Add credits to user account (for purchases)
 * This should be called from a webhook handler after payment confirmation
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: "purchase" | "bundle_purchase" | "refund" | "admin_adjustment",
  description?: string,
  paymentProvider?: string,
  paymentReference?: string
): Promise<number | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_type: type,
    p_description: description || null,
    p_payment_provider: paymentProvider || null,
    p_payment_reference: paymentReference || null,
  })

  if (error) {
    console.error("Error adding credits:", error)
    return null
  }

  // Revalidate dashboard layout to update credit display
  revalidatePath("/dashboard", "layout")
  revalidatePath("/cases", "layout")
  revalidatePath("/new", "layout")

  return data
}
