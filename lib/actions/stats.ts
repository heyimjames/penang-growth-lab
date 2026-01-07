"use server"

import { createClient } from "@/lib/supabase/server"

const ADMIN_EMAIL = "james@octoberwip.com"

export async function isAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email === ADMIN_EMAIL
}

export async function getAdminStats() {
  const supabase = await createClient()

  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized")
  }

  // Get total users count
  const { count: totalUsers } = await supabase
    .from("cases")
    .select("user_id", { count: "exact", head: true })

  // Get unique users (distinct user_ids from cases)
  const { data: uniqueUsers } = await supabase
    .from("cases")
    .select("user_id")
  const uniqueUserIds = new Set(uniqueUsers?.map(u => u.user_id) || [])

  // Get total cases
  const { count: totalCases } = await supabase
    .from("cases")
    .select("*", { count: "exact", head: true })

  // Get cases by status
  const { data: casesByStatus } = await supabase
    .from("cases")
    .select("status")

  const statusCounts = (casesByStatus || []).reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get total evidence files
  const { count: totalEvidence } = await supabase
    .from("evidence")
    .select("*", { count: "exact", head: true })

  // Get cases created per day (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: recentCases } = await supabase
    .from("cases")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true })

  // Group cases by date
  const casesPerDay = (recentCases || []).reduce((acc, c) => {
    const date = new Date(c.created_at).toISOString().split("T")[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Generate daily data for chart (fill in missing days)
  const dailyData = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    dailyData.push({
      date: dateStr,
      cases: casesPerDay[dateStr] || 0,
    })
  }

  // Get cases by company (top 10)
  const { data: casesByCompany } = await supabase
    .from("cases")
    .select("company_name")

  const companyCounts = (casesByCompany || []).reduce((acc, c) => {
    if (c.company_name) {
      acc[c.company_name] = (acc[c.company_name] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }))

  // Get cases by currency/region
  const { data: casesByCurrency } = await supabase
    .from("cases")
    .select("currency")

  const currencyCounts = (casesByCurrency || []).reduce((acc, c) => {
    acc[c.currency || "GBP"] = (acc[c.currency || "GBP"] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate estimated API costs (rough estimates)
  const analysisCallsEstimate = (totalCases || 0) * 3 // ~3 API calls per case analysis
  const letterCallsEstimate = (totalCases || 0) * 1.5 // ~1.5 letters per case
  const evidenceCallsEstimate = (totalEvidence || 0) * 0.5 // ~0.5 calls per evidence
  const totalApiCalls = analysisCallsEstimate + letterCallsEstimate + evidenceCallsEstimate

  // Estimate costs (Claude Sonnet ~$3/1M input, ~$15/1M output tokens)
  // Assume ~2000 tokens per call average
  const estimatedInputTokens = totalApiCalls * 1500
  const estimatedOutputTokens = totalApiCalls * 500
  const estimatedCost = (estimatedInputTokens * 0.003 / 1000) + (estimatedOutputTokens * 0.015 / 1000)

  return {
    overview: {
      totalUsers: uniqueUserIds.size,
      totalCases: totalCases || 0,
      totalEvidence: totalEvidence || 0,
      casesWithLetters: statusCounts["ready"] || 0,
      draftCases: statusCounts["draft"] || 0,
      analyzedCases: statusCounts["analyzed"] || 0,
    },
    statusBreakdown: statusCounts,
    dailyCases: dailyData,
    topCompanies,
    currencyBreakdown: Object.entries(currencyCounts).map(([currency, count]) => ({
      currency,
      count,
    })),
    apiEstimates: {
      totalCalls: Math.round(totalApiCalls),
      estimatedCost: estimatedCost.toFixed(2),
      inputTokens: Math.round(estimatedInputTokens),
      outputTokens: Math.round(estimatedOutputTokens),
    },
    // Placeholder for future metrics
    mrr: 0,
    arr: 0,
    paidCustomers: 0,
  }
}
