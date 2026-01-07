"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { getAdminStats, isAdminUser } from "@/lib/actions/stats"
import { UsersManagement } from "@/components/admin/users-management"
import { CompanyLogo } from "@/components/company-logo"
import { Icon } from "@/lib/icons"
import { format, subDays, subHours, subMonths, startOfDay, endOfDay } from "date-fns"
import {
  UserMultipleIcon,
  FolderOpenIcon,
  FileAttachmentIcon,
  Mail01Icon,
  CreditCardIcon,
  AnalyticsUpIcon,
  DollarCircleIcon,
  CloudIcon,
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  Calendar01Icon,
  Globe02Icon,
  BrowserIcon,
  SmartPhone01Icon,
  Link01Icon,
  File01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import type { DateRange } from "react-day-picker"

// Chart color config using brand colors
// Coral: #FF7759, Forest: #355146, Lavender: #D18EE2, Peach: #FFAB73, Acrylic: #3E7EF2
const visitsChartConfig = {
  visitors: {
    label: "Visitors",
    color: "#355146", // Forest
  },
  pageviews: {
    label: "Pageviews",
    color: "#FF7759", // Coral
  },
} satisfies ChartConfig

const statusChartConfig = {
  draft: { label: "Draft", color: "#9A9A94" }, // Stone (muted)
  analyzing: { label: "Analyzing", color: "#FFAB73" }, // Peach
  analyzed: { label: "Analyzed", color: "#355146" }, // Forest
  completed: { label: "Completed", color: "#FF7759" }, // Coral
} satisfies ChartConfig

const deviceChartConfig = {
  Desktop: { label: "Desktop", color: "#355146" }, // Forest
  Mobile: { label: "Mobile", color: "#FF7759" }, // Coral
  Tablet: { label: "Tablet", color: "#D18EE2" }, // Lavender/Violet
} satisfies ChartConfig

type TimeRangePreset = "1h" | "24h" | "48h" | "7d" | "30d" | "6m" | "12m" | "all_time" | "custom"

const timeRangeOptions: { value: TimeRangePreset; label: string }[] = [
  { value: "1h", label: "Last Hour" },
  { value: "24h", label: "Last 24 Hours" },
  { value: "48h", label: "Last 48 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "6m", label: "Last 6 Months" },
  { value: "12m", label: "Last 12 Months" },
  { value: "all_time", label: "All Time" },
  { value: "custom", label: "Custom Range" },
]

interface StatsData {
  overview: {
    totalUsers: number
    totalCases: number
    totalEvidence: number
    casesWithLetters: number
    draftCases: number
    analyzedCases: number
  }
  statusBreakdown: Record<string, number>
  dailyCases: Array<{ date: string; cases: number }>
  topCompanies: Array<{ name: string; count: number }>
  currencyBreakdown: Array<{ currency: string; count: number }>
  apiEstimates: {
    totalCalls: number
    estimatedCost: string
    inputTokens: number
    outputTokens: number
  }
  mrr: number
  arr: number
  paidCustomers: number
}

interface SelineData {
  visits: {
    data: Array<{
      date: string
      visits: number
      pageviews: number
      visitors: number
    }>
    total: {
      visits: number
      pageviews: number
      visitors: number
    }
  }
  countries: { data: Array<{ type: string; visitors: number }>; total: number }
  browsers: { data: Array<{ type: string; visitors: number }>; total: number }
  devices: { data: Array<{ type: string; visitors: number }>; total: number }
  referrers: { data: Array<{ type: string; visitors: number }>; total: number }
  pages: { data: Array<{ type: string; visitors: number }>; total: number }
}

function StatCard({
  title,
  value,
  description,
  icon: IconComponent,
  color = "forest",
  trend,
}: {
  title: string
  value: string | number
  description?: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  color?: "forest" | "coral" | "lavender" | "peach"
  trend?: { value: number; isPositive: boolean }
}) {
  const colorClasses = {
    forest: "bg-forest-100 text-forest-600 dark:bg-forest-900/50 dark:text-forest-400",
    coral: "bg-coral-100 text-coral-600 dark:bg-coral-900/50 dark:text-coral-400",
    lavender: "bg-lavender-100 text-lavender-600 dark:bg-lavender-900/50 dark:text-lavender-400",
    peach: "bg-peach-100 text-peach-600 dark:bg-peach-900/50 dark:text-peach-400",
  }

  const borderClasses = {
    forest: "border-forest-200 dark:border-forest-800",
    coral: "border-coral-200 dark:border-coral-800",
    lavender: "border-lavender-200 dark:border-lavender-800",
    peach: "border-peach-200 dark:border-peach-800",
  }

  return (
    <Card className={`relative overflow-hidden border ${borderClasses[color]}`}>
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${colorClasses[color]} opacity-20`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2.5 rounded-xl ${colorClasses[color]}`}>
          <Icon icon={IconComponent} size={18} />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold font-display tracking-tight">{value}</div>
          {trend && (
            <span className={`flex items-center text-xs font-medium ${trend.isPositive ? "text-forest-500" : "text-coral-500"}`}>
              <Icon icon={trend.isPositive ? ArrowUpRight01Icon : ArrowDownRight01Icon} size={14} />
              {trend.value}%
            </span>
          )}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1.5">{description}</p>}
      </CardContent>
    </Card>
  )
}

export default function StatsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [stats, setStats] = useState<StatsData | null>(null)
  const [selineData, setSelineData] = useState<SelineData | null>(null)
  const [selineLoading, setSelineLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRangePreset>("7d")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("website")

  const fetchSelineData = useCallback(async (range: TimeRangePreset | { start: string; end: string }) => {
    setSelineLoading(true)
    try {
      const response = await fetch("/api/analytics/seline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeRange: range }),
      })

      if (response.ok) {
        const data = await response.json()
        setSelineData(data)
      }
    } catch (err) {
      console.error("Seline fetch error:", err)
    } finally {
      setSelineLoading(false)
    }
  }, [])

  useEffect(() => {
    async function checkAuthAndLoadStats() {
      try {
        const isAdmin = await isAdminUser()
        if (!isAdmin) {
          router.push("/dashboard")
          return
        }
        setAuthorized(true)

        const data = await getAdminStats()
        setStats(data)

        // Fetch Seline data
        await fetchSelineData("7d")
      } catch (err) {
        console.error("Error loading stats:", err)
        setError("Failed to load statistics")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadStats()
  }, [router, fetchSelineData])

  const handleTimeRangeChange = async (value: TimeRangePreset) => {
    setTimeRange(value)
    if (value !== "custom") {
      await fetchSelineData(value)
    }
  }

  const handleDateRangeSelect = async (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to) {
      setIsCalendarOpen(false)
      await fetchSelineData({
        start: startOfDay(range.from).toISOString(),
        end: endOfDay(range.to).toISOString(),
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-muted opacity-20" />
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{error || "Unable to load statistics"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusData = Object.entries(stats.statusBreakdown).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    fill: statusChartConfig[status as keyof typeof statusChartConfig]?.color || "#888",
  }))

  // Format visits data for chart
  const visitsChartData = selineData?.visits?.data?.map((item) => ({
    date: item.date,
    visitors: item.visitors || 0,
    pageviews: item.pageviews || 0,
  })) || []

  // Format device data for pie chart
  const deviceData = selineData?.devices?.data?.map((item) => ({
    name: item.type || "Unknown",
    value: item.visitors,
    fill: deviceChartConfig[item.type as keyof typeof deviceChartConfig]?.color || "hsl(var(--chart-4))",
  })) || []

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight">Admin Dashboard</h1>
            <Badge variant="outline" className="text-xs">Live</Badge>
          </div>
          <p className="text-muted-foreground mt-1">Platform statistics and analytics</p>
        </div>
        {activeTab !== "users" && (
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[180px]">
                <Icon icon={Calendar01Icon} size={16} className="mr-2" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {timeRange === "custom" && (
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-[200px] justify-start text-left font-normal">
                    <Icon icon={Calendar01Icon} size={16} className="mr-2" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={2}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            )}

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-forest-400 animate-ping opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-500" />
              </span>
              Live
            </div>
          </div>
        )}
      </div>

      {/* Tabs for Platform vs Website Analytics */}
      <Tabs defaultValue="website" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="website">Website Analytics</TabsTrigger>
          <TabsTrigger value="platform">Platform Stats</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        {/* Website Analytics Tab (Seline) */}
        <TabsContent value="website" className="space-y-6">
          {/* Website Overview Stats */}
          {selineData && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Visitors"
                value={selineData.visits?.total?.visitors?.toLocaleString() || "0"}
                description={`${timeRangeOptions.find(o => o.value === timeRange)?.label || "Selected period"}`}
                icon={UserMultipleIcon}
                color="forest"
              />
              <StatCard
                title="Page Views"
                value={selineData.visits?.total?.pageviews?.toLocaleString() || "0"}
                description="Total page views"
                icon={File01Icon}
                color="lavender"
              />
              <StatCard
                title="Countries"
                value={selineData.countries?.total || 0}
                description="Unique countries"
                icon={Globe02Icon}
                color="peach"
              />
              <StatCard
                title="Top Referrers"
                value={selineData.referrers?.total || 0}
                description="Traffic sources"
                icon={Link01Icon}
                color="coral"
              />
            </div>
          )}

          {/* Visitors Over Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Visitors & Page Views</CardTitle>
              <CardDescription>
                {timeRangeOptions.find(o => o.value === timeRange)?.label || "Selected period"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selineLoading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : visitsChartData.length > 0 ? (
                <ChartContainer config={visitsChartConfig} className="min-h-[250px] w-full">
                  <AreaChart
                    data={visitsChartData}
                    accessibilityLayer
                    margin={{ left: 12, right: 12 }}
                  >
                    <defs>
                      <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="fillPageviews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-pageviews)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--color-pageviews)" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        if (timeRange === "1h" || timeRange === "24h" || timeRange === "48h") {
                          return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
                        }
                        return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Area
                      dataKey="pageviews"
                      type="monotone"
                      fill="url(#fillPageviews)"
                      stroke="var(--color-pageviews)"
                      strokeWidth={2}
                    />
                    <Area
                      dataKey="visitors"
                      type="monotone"
                      fill="url(#fillVisitors)"
                      stroke="var(--color-visitors)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="min-h-[250px] flex items-center justify-center text-muted-foreground">
                  No data available for the selected period
                </div>
              )}
            </CardContent>
            {selineData?.visits?.total && (
              <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 font-medium leading-none">
                      {selineData.visits.total.visitors.toLocaleString()} visitors
                      <Icon icon={AnalyticsUpIcon} size={16} className="text-forest-500" />
                    </div>
                    <div className="flex items-center gap-2 leading-none text-muted-foreground">
                      {selineData.visits.total.pageviews.toLocaleString()} page views total
                    </div>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>

          {/* Geographic & Device Breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Countries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon icon={Globe02Icon} size={18} />
                  Top Countries
                </CardTitle>
                <CardDescription>Visitors by country</CardDescription>
              </CardHeader>
              <CardContent>
                {selineLoading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <div className="space-y-3">
                    {selineData?.countries?.data?.slice(0, 8).map((country, i) => (
                      <div key={country.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                          <span className="font-medium">{country.type || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-forest-500 rounded-full"
                              style={{
                                width: `${(country.visitors / (selineData?.countries?.data?.[0]?.visitors || 1)) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-16 text-right">
                            {country.visitors.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Devices</CardTitle>
                <CardDescription>Traffic by device type</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                {selineLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : deviceData.length > 0 ? (
                  <ChartContainer config={deviceChartConfig} className="mx-auto aspect-square max-h-[200px]">
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={deviceData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        strokeWidth={5}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    No device data available
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  {deviceData[0]?.name || "Desktop"} leads with {Math.round((deviceData[0]?.value / deviceData.reduce((a, b) => a + b.value, 0)) * 100) || 0}%
                </div>
                <div className="leading-none text-muted-foreground">
                  Based on {deviceData.reduce((a, b) => a + b.value, 0).toLocaleString()} total visitors
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Browsers & Referrers */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Browsers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon icon={BrowserIcon} size={18} />
                  Top Browsers
                </CardTitle>
                <CardDescription>Visitors by browser</CardDescription>
              </CardHeader>
              <CardContent>
                {selineLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <div className="space-y-3">
                    {selineData?.browsers?.data?.slice(0, 6).map((browser, i) => (
                      <div key={browser.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                          <span className="font-medium">{browser.type || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-lavender-500 rounded-full"
                              style={{
                                width: `${(browser.visitors / (selineData?.browsers?.data?.[0]?.visitors || 1)) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-16 text-right">
                            {browser.visitors.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Referrers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon icon={Link01Icon} size={18} />
                  Top Referrers
                </CardTitle>
                <CardDescription>Traffic sources</CardDescription>
              </CardHeader>
              <CardContent>
                {selineLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <div className="space-y-3">
                    {selineData?.referrers?.data?.slice(0, 6).map((referrer, i) => (
                      <div key={referrer.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                          <span className="font-medium truncate">{referrer.type || "Direct"}</span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-coral-500 rounded-full"
                              style={{
                                width: `${(referrer.visitors / (selineData?.referrers?.data?.[0]?.visitors || 1)) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-16 text-right">
                            {referrer.visitors.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon icon={File01Icon} size={18} />
                Top Pages
              </CardTitle>
              <CardDescription>Most visited pages</CardDescription>
            </CardHeader>
            <CardContent>
              {selineLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="space-y-2">
                  {selineData?.pages?.data?.slice(0, 12).map((page, i) => (
                    <div key={page.type} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-xs text-muted-foreground w-5 shrink-0">{i + 1}</span>
                        <span className="font-mono text-sm truncate">{page.type || "/"}</span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-forest-500 rounded-full"
                            style={{
                              width: `${(page.visitors / (selineData?.pages?.data?.[0]?.visitors || 1)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-16 text-right">
                          {page.visitors.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Stats Tab */}
        <TabsContent value="platform" className="space-y-6">
          {/* Platform Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Platform Overview</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                value={stats.overview.totalUsers}
                description="Unique users with cases"
                icon={UserMultipleIcon}
                color="forest"
              />
              <StatCard
                title="Total Cases"
                value={stats.overview.totalCases}
                description={`${stats.overview.draftCases} drafts, ${stats.overview.casesWithLetters} completed`}
                icon={FolderOpenIcon}
                color="lavender"
              />
              <StatCard
                title="Evidence Files"
                value={stats.overview.totalEvidence}
                description="Uploaded across all cases"
                icon={FileAttachmentIcon}
                color="peach"
              />
              <StatCard
                title="Letters Generated"
                value={stats.overview.casesWithLetters}
                description="Cases with generated letters"
                icon={Mail01Icon}
                color="coral"
              />
            </div>
          </div>

          {/* Revenue & Business */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Revenue & Business</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="MRR"
                value={`£${stats.mrr}`}
                description="Monthly recurring revenue"
                icon={DollarCircleIcon}
                color="forest"
              />
              <StatCard
                title="ARR"
                value={`£${stats.arr}`}
                description="Annual recurring revenue"
                icon={AnalyticsUpIcon}
                color="lavender"
              />
              <StatCard
                title="Paid Customers"
                value={stats.paidCustomers}
                description="Active subscriptions"
                icon={CreditCardIcon}
                color="peach"
              />
              <StatCard
                title="Est. API Costs"
                value={`$${stats.apiEstimates.estimatedCost}`}
                description={`~${stats.apiEstimates.totalCalls.toLocaleString()} API calls`}
                icon={CloudIcon}
                color="coral"
              />
            </div>
          </div>

          {/* Cases Analytics */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Cases Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Cases Created</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ cases: { label: "Cases", color: "#355146" } }} className="min-h-[200px] w-full">
                  <AreaChart
                    data={stats.dailyCases}
                    accessibilityLayer
                    margin={{ left: 12, right: 12 }}
                  >
                    <defs>
                      <linearGradient id="fillCases" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-cases)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--color-cases)" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) => new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                      dataKey="cases"
                      type="monotone"
                      fill="url(#fillCases)"
                      stroke="var(--color-cases)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 font-medium leading-none">
                      {stats.overview.totalCases} total cases
                      <Icon icon={AnalyticsUpIcon} size={16} className="text-forest-500" />
                    </div>
                    <div className="flex items-center gap-2 leading-none text-muted-foreground">
                      {stats.overview.casesWithLetters} with letters generated
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>

            {/* Case Status Breakdown */}
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Case Status</CardTitle>
                <CardDescription>Distribution by status</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer config={statusChartConfig} className="mx-auto aspect-square max-h-[200px]">
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      strokeWidth={5}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  {statusData.find(s => s.name === "Analyzed")?.value || 0} cases analyzed
                  <Icon icon={AnalyticsUpIcon} size={16} className="text-forest-500" />
                </div>
                <div className="leading-none text-muted-foreground">
                  {statusData.find(s => s.name === "Completed")?.value || 0} completed with letters
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Top Companies */}
          <Card>
            <CardHeader>
              <CardTitle>Top Companies</CardTitle>
              <CardDescription>Most complained about companies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {stats.topCompanies.slice(0, 50).map((company, index) => {
                  const maxCount = stats.topCompanies[0]?.count || 1
                  const percentage = (company.count / maxCount) * 100
                  return (
                    <div key={company.name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-5 text-right shrink-0">
                        {index + 1}
                      </span>
                      <CompanyLogo
                        companyName={company.name}
                        size={28}
                        className="shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-medium text-sm truncate">
                            {company.name}
                          </span>
                          <span className="text-sm font-semibold text-coral-600 shrink-0">
                            {company.count}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-coral-500 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
              <div className="flex gap-2 font-medium leading-none">
                {stats.topCompanies[0]?.name || "N/A"} has the most cases ({stats.topCompanies[0]?.count || 0})
              </div>
              <div className="leading-none text-muted-foreground">
                Showing top {Math.min(stats.topCompanies.length, 50)} companies by case count
              </div>
            </CardFooter>
          </Card>

          {/* Technical Stats */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Currency/Region Distribution</CardTitle>
                <CardDescription>Cases by currency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.currencyBreakdown.map((item) => (
                    <div key={item.currency} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-forest-500" />
                        <span className="font-medium">{item.currency}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-forest-500 rounded-full"
                            style={{
                              width: `${(item.count / stats.overview.totalCases) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Model Usage</CardTitle>
                <CardDescription>Estimated token consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Input Tokens</p>
                      <p className="text-2xl font-bold font-display">
                        {(stats.apiEstimates.inputTokens / 1000).toFixed(1)}K
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Output Tokens</p>
                      <p className="text-2xl font-bold font-display">
                        {(stats.apiEstimates.outputTokens / 1000).toFixed(1)}K
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Estimated API Calls</span>
                      <span className="font-medium">{stats.apiEstimates.totalCalls.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">Est. Total Cost</span>
                      <span className="font-medium text-coral-500">${stats.apiEstimates.estimatedCost}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on Claude Sonnet pricing (~$3/1M input, ~$15/1M output tokens)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <UsersManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
