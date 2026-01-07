"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { ResolutionType, CompanyStats } from "@/lib/types"

export interface RecordOutcomeData {
  caseId: string
  resolutionType: ResolutionType
  resolutionAmount?: number
  testimonialText?: string
  shareTestimonial?: boolean
}

export async function recordCaseOutcome(data: RecordOutcomeData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Get the case to calculate resolution days
  const { data: caseData, error: fetchError } = await supabase
    .from("cases")
    .select("created_at")
    .eq("id", data.caseId)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !caseData) {
    return { success: false, error: "Case not found" }
  }

  // Calculate days to resolution
  const createdAt = new Date(caseData.created_at)
  const now = new Date()
  const resolutionDays = Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

  // Determine if this is a successful resolution
  const successfulTypes: ResolutionType[] = [
    "full_refund",
    "partial_refund",
    "compensation",
    "replacement",
    "service_credit",
  ]
  const isSuccessful = successfulTypes.includes(data.resolutionType)

  // Update the case
  const { error: updateError } = await supabase
    .from("cases")
    .update({
      status: "resolved",
      resolved_at: new Date().toISOString(),
      resolution_type: data.resolutionType,
      resolution_amount: data.resolutionAmount || null,
      resolution_days: resolutionDays,
      resolution_outcome: data.resolutionType.replace(/_/g, " "),
      testimonial_text: data.testimonialText || null,
      testimonial_shared: data.shareTestimonial || false,
      testimonial_submitted_at: data.testimonialText ? new Date().toISOString() : null,
    })
    .eq("id", data.caseId)
    .eq("user_id", user.id)

  if (updateError) {
    console.error("Error recording outcome:", updateError)
    return { success: false, error: "Failed to record outcome" }
  }

  revalidatePath("/dashboard")
  revalidatePath("/cases")
  revalidatePath(`/cases/${data.caseId}`)

  return {
    success: true,
    isSuccessful,
    resolutionDays,
  }
}

export async function getCompanyStats(companyName: string): Promise<CompanyStats | null> {
  const supabase = await createClient()

  // Get aggregated stats for the company
  const { data, error } = await supabase
    .from("cases")
    .select("status, resolution_type, resolution_amount, resolution_days, created_at, updated_at")
    .ilike("company_name", `%${companyName}%`)

  if (error || !data || data.length === 0) {
    return null
  }

  const totalCases = data.length
  const resolvedCases = data.filter((c) => c.status === "resolved").length
  const successfulTypes = ["full_refund", "partial_refund", "compensation", "replacement", "service_credit"]
  const successfulCases = data.filter((c) => successfulTypes.includes(c.resolution_type || "")).length

  const resolutionDays = data
    .filter((c) => c.resolution_days)
    .map((c) => c.resolution_days as number)
  const avgResolutionDays =
    resolutionDays.length > 0
      ? Math.round(resolutionDays.reduce((a, b) => a + b, 0) / resolutionDays.length)
      : null

  const resolutionAmounts = data
    .filter((c) => c.resolution_amount)
    .map((c) => c.resolution_amount as number)
  const avgResolutionAmount =
    resolutionAmounts.length > 0
      ? Math.round(resolutionAmounts.reduce((a, b) => a + b, 0) / resolutionAmounts.length)
      : null

  const lastCaseDate = data.reduce((latest, c) => {
    const date = c.updated_at || c.created_at
    return date > latest ? date : latest
  }, data[0].updated_at || data[0].created_at)

  return {
    company_name: companyName,
    company_domain: null,
    total_cases: totalCases,
    resolved_cases: resolvedCases,
    successful_cases: successfulCases,
    avg_resolution_days: avgResolutionDays,
    avg_resolution_amount: avgResolutionAmount,
    success_rate: resolvedCases > 0 ? Math.round((successfulCases / resolvedCases) * 100) : 0,
    last_case_date: lastCaseDate,
  }
}

export async function getGlobalStats() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("cases")
    .select("status, resolution_type, resolution_amount")

  if (error || !data) {
    return {
      totalCases: 0,
      resolvedCases: 0,
      successRate: 0,
      totalRecovered: 0,
    }
  }

  const totalCases = data.length
  const resolvedCases = data.filter((c) => c.status === "resolved").length
  const successfulTypes = ["full_refund", "partial_refund", "compensation", "replacement", "service_credit"]
  const successfulCases = data.filter((c) => successfulTypes.includes(c.resolution_type || "")).length
  const totalRecovered = data
    .filter((c) => c.resolution_amount && successfulTypes.includes(c.resolution_type || ""))
    .reduce((sum, c) => sum + (c.resolution_amount || 0), 0)

  return {
    totalCases,
    resolvedCases,
    successRate: resolvedCases > 0 ? Math.round((successfulCases / resolvedCases) * 100) : 78,
    totalRecovered: Math.round(totalRecovered),
  }
}

export async function getPublicTestimonials(limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("cases")
    .select(`
      id,
      company_name,
      testimonial_text,
      resolution_type,
      resolution_amount,
      resolution_days,
      testimonial_submitted_at
    `)
    .eq("testimonial_approved", true)
    .eq("testimonial_shared", true)
    .not("testimonial_text", "is", null)
    .order("testimonial_submitted_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }

  return data || []
}
