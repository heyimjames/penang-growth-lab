import { type NextRequest, NextResponse } from "next/server"
import { isAdminUser } from "@/lib/actions/stats"

const SELINE_API_BASE = "https://api.seline.com/api/v1"
const SELINE_API_TOKEN = process.env.SELINE_API_TOKEN || "sln_b5b5b3d23b4404ad0aa3611966bf3a68af6747c2a7927a217b0e4b482f5d741b"

export type SelineTimeRange =
  | "1h"
  | "24h"
  | "48h"
  | "7d"
  | "30d"
  | "6m"
  | "12m"
  | "all_time"
  | "month_to_date"
  | "week_to_date"
  | "year_to_date"
  | "today"
  | { start: string; end: string }

interface SelineVisitsResponse {
  data: Array<{
    date: string
    visits: number
    pageviews: number
    visitors: number
    bounceRate?: number
    avgSessionDuration?: number
  }>
  total: {
    visits: number
    pageviews: number
    visitors: number
    bounceRate?: number
    avgSessionDuration?: number
  }
}

interface SelineStatsResponse {
  data: Array<{
    type: string
    visitors: number
    visits?: number
    pageviews?: number
  }>
  total: number
}

async function fetchSeline(endpoint: string, body: Record<string, unknown>) {
  const response = await fetch(`${SELINE_API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SELINE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Seline API error: ${response.status} - ${error}`)
  }

  return response.json()
}

function getPeriodParam(timeRange: SelineTimeRange): { period?: string; range?: { start: string; end: string } } {
  if (typeof timeRange === "object" && "start" in timeRange) {
    return { range: timeRange }
  }
  return { period: timeRange }
}

function getIntervalForPeriod(timeRange: SelineTimeRange): string {
  if (typeof timeRange === "object") {
    // For custom ranges, calculate appropriate interval
    const start = new Date(timeRange.start)
    const end = new Date(timeRange.end)
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) return "1 hour"
    if (diffDays <= 7) return "1 hour"
    if (diffDays <= 90) return "1 day"
    return "1 month"
  }

  switch (timeRange) {
    case "1h":
    case "today":
      return "10 minutes"
    case "24h":
    case "48h":
      return "1 hour"
    case "7d":
    case "week_to_date":
      return "1 day"
    case "30d":
    case "month_to_date":
      return "1 day"
    case "6m":
    case "12m":
    case "year_to_date":
    case "all_time":
      return "1 month"
    default:
      return "1 day"
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const isAdmin = await isAdminUser()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { timeRange = "7d" } = await request.json() as { timeRange?: SelineTimeRange }

    const periodParam = getPeriodParam(timeRange)
    const interval = getIntervalForPeriod(timeRange)

    // Fetch all data in parallel
    const [visitsData, countryStats, browserStats, deviceStats, referrerStats, pageStats] = await Promise.all([
      // Visits over time
      fetchSeline("/visits", {
        ...periodParam,
        interval,
      }).catch((e) => {
        console.error("Visits fetch error:", e)
        return { data: [], total: { visits: 0, pageviews: 0, visitors: 0 } }
      }) as Promise<SelineVisitsResponse>,

      // Top countries
      fetchSeline("/stats", {
        type: "country",
        ...periodParam,
        limit: 10,
      }).catch((e) => {
        console.error("Country stats error:", e)
        return { data: [], total: 0 }
      }) as Promise<SelineStatsResponse>,

      // Top browsers
      fetchSeline("/stats", {
        type: "browser",
        ...periodParam,
        limit: 10,
      }).catch((e) => {
        console.error("Browser stats error:", e)
        return { data: [], total: 0 }
      }) as Promise<SelineStatsResponse>,

      // Device breakdown
      fetchSeline("/stats", {
        type: "device",
        ...periodParam,
        limit: 10,
      }).catch((e) => {
        console.error("Device stats error:", e)
        return { data: [], total: 0 }
      }) as Promise<SelineStatsResponse>,

      // Top referrers
      fetchSeline("/stats", {
        type: "referrer",
        ...periodParam,
        limit: 10,
      }).catch((e) => {
        console.error("Referrer stats error:", e)
        return { data: [], total: 0 }
      }) as Promise<SelineStatsResponse>,

      // Top pages
      fetchSeline("/stats", {
        type: "page",
        ...periodParam,
        limit: 15,
      }).catch((e) => {
        console.error("Page stats error:", e)
        return { data: [], total: 0 }
      }) as Promise<SelineStatsResponse>,
    ])

    return NextResponse.json({
      visits: visitsData,
      countries: countryStats,
      browsers: browserStats,
      devices: deviceStats,
      referrers: referrerStats,
      pages: pageStats,
      timeRange,
    })
  } catch (error) {
    console.error("Seline analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
