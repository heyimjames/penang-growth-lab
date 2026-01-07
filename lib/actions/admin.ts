"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

const ADMIN_EMAIL = "james@octoberwip.com"

export interface AdminUser {
  id: string
  email: string
  fullName: string | null
  createdAt: string
  lastSignIn: string | null
  credits: number
  totalCases: number
  stripeCustomerId: string | null
  phone: string | null
  city: string | null
  country: string | null
  isBanned: boolean
  bannedUntil: string | null
  provider: string | null
  lastIp: string | null
  spamScore: number
  spamFlags: string[]
  isIpBlocked: boolean
}

export interface UserTransaction {
  id: string
  amount: number
  type: string
  description: string | null
  createdAt: string
  balanceAfter: number
}

export interface UserCase {
  id: string
  companyName: string | null
  status: string
  createdAt: string
  amount: number | null
  currency: string
  confidenceScore: number | null
  hasLetter: boolean
  evidenceCount: number
}

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized")
  }
  // Return admin client for operations that need service role
  const adminClient = createAdminClient()
  return { supabase, adminClient, adminUser: user }
}

/**
 * Get all users with their profile data, credits, and case counts
 * Fetches from auth.users first (authoritative source) then enriches with profile data
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  const { adminClient } = await verifyAdmin()

  // Get all auth users first - this is the authoritative source
  // Using adminClient which has service role key for auth.admin access
  const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers()

  if (authError) {
    console.error("Error fetching auth users:", authError)
    return []
  }

  if (!authUsers?.users?.length) {
    return []
  }

  // Get all profiles (adminClient bypasses RLS)
  const { data: profiles } = await adminClient
    .from("profiles")
    .select(`
      user_id,
      full_name,
      phone_number,
      city,
      country,
      stripe_customer_id,
      last_ip,
      spam_score,
      spam_flags
    `)

  const profilesMap = new Map(
    profiles?.map(p => [p.user_id, {
      fullName: p.full_name,
      phone: p.phone_number,
      city: p.city,
      country: p.country,
      stripeCustomerId: p.stripe_customer_id,
      lastIp: p.last_ip,
      spamScore: p.spam_score || 0,
      spamFlags: p.spam_flags || [],
    }]) || []
  )

  // Get blocked IPs
  const { data: blockedIps } = await adminClient
    .from("blocked_ips")
    .select("ip_address")

  const blockedIpSet = new Set(blockedIps?.map(b => b.ip_address) || [])

  // Get user credits
  const { data: credits } = await adminClient
    .from("user_credits")
    .select("user_id, credits")

  const creditsMap = new Map(credits?.map(c => [c.user_id, c.credits]) || [])

  // Get case counts per user
  const { data: cases } = await adminClient
    .from("cases")
    .select("user_id")

  const caseCounts = new Map<string, number>()
  cases?.forEach(c => {
    caseCounts.set(c.user_id, (caseCounts.get(c.user_id) || 0) + 1)
  })

  // Build user list from auth users, enriched with profile data
  const users: AdminUser[] = authUsers.users.map(authUser => {
    const profile = profilesMap.get(authUser.id)

    // Check if user is banned (banned_until is set and in the future)
    const bannedUntil = authUser.banned_until as string | null
    const isBanned = bannedUntil ? new Date(bannedUntil) > new Date() : false

    // Get primary auth provider
    const provider = authUser.app_metadata?.provider ||
      (authUser.identities?.[0]?.provider) ||
      "email"

    const lastIp = profile?.lastIp || null

    return {
      id: authUser.id,
      email: authUser.email || "",
      fullName: profile?.fullName || authUser.user_metadata?.full_name || null,
      createdAt: authUser.created_at,
      lastSignIn: authUser.last_sign_in_at || null,
      credits: creditsMap.get(authUser.id) || 0,
      totalCases: caseCounts.get(authUser.id) || 0,
      stripeCustomerId: profile?.stripeCustomerId || null,
      phone: profile?.phone || null,
      city: profile?.city || null,
      country: profile?.country || null,
      isBanned,
      bannedUntil,
      provider,
      lastIp,
      spamScore: profile?.spamScore || 0,
      spamFlags: profile?.spamFlags || [],
      isIpBlocked: lastIp ? blockedIpSet.has(lastIp) : false,
    }
  })

  // Sort by created_at descending (newest first)
  users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return users
}

/**
 * Get detailed user info including transactions and cases
 */
export async function getAdminUserDetails(userId: string): Promise<{
  user: AdminUser | null
  transactions: UserTransaction[]
  cases: UserCase[]
}> {
  const { adminClient } = await verifyAdmin()

  // Get auth data first
  const { data: authData, error: authError } = await adminClient.auth.admin.getUserById(userId)

  if (authError || !authData?.user) {
    console.error("Failed to get auth user:", authError)
    return { user: null, transactions: [], cases: [] }
  }

  // Get profile
  const { data: profile } = await adminClient
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  // Get credits
  const { data: credits } = await adminClient
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single()

  // Get cases with more detail
  const { data: userCases } = await adminClient
    .from("cases")
    .select("id, company_name, status, created_at, amount, currency, confidence_score, generated_letter")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  // Get evidence counts per case
  const caseIds = userCases?.map(c => c.id) || []
  const { data: evidenceCounts } = caseIds.length > 0
    ? await adminClient
        .from("evidence")
        .select("case_id")
        .in("case_id", caseIds)
    : { data: [] }

  const evidenceCountMap = new Map<string, number>()
  evidenceCounts?.forEach(e => {
    evidenceCountMap.set(e.case_id, (evidenceCountMap.get(e.case_id) || 0) + 1)
  })

  // Get transactions
  const { data: transactions } = await adminClient
    .from("credit_transactions")
    .select("id, amount, type, description, created_at, balance_after")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)

  // Check if user's IP is blocked
  const lastIp = profile?.last_ip
  let isIpBlocked = false
  if (lastIp) {
    const { data: blockedIp } = await adminClient
      .from("blocked_ips")
      .select("id")
      .eq("ip_address", lastIp)
      .single()
    isIpBlocked = !!blockedIp
  }

  // Check ban status
  const bannedUntil = authData?.user?.banned_until as string | null
  const isBanned = bannedUntil ? new Date(bannedUntil) > new Date() : false

  // Get provider
  const provider = authData?.user?.app_metadata?.provider ||
    (authData?.user?.identities?.[0]?.provider) ||
    "email"

  // Build user even if no profile exists (user may not have completed profile)
  const user: AdminUser = {
    id: userId,
    email: authData?.user?.email || "",
    fullName: profile?.full_name || authData?.user?.user_metadata?.full_name || null,
    createdAt: authData?.user?.created_at || profile?.created_at || "",
    lastSignIn: authData?.user?.last_sign_in_at || null,
    credits: credits?.credits || 0,
    totalCases: userCases?.length || 0,
    stripeCustomerId: profile?.stripe_customer_id || null,
    phone: profile?.phone_number || null,
    city: profile?.city || null,
    country: profile?.country || null,
    isBanned,
    bannedUntil,
    provider,
    lastIp: profile?.last_ip || null,
    spamScore: profile?.spam_score || 0,
    spamFlags: profile?.spam_flags || [],
    isIpBlocked,
  }

  return {
    user,
    transactions: (transactions || []).map(t => ({
      id: t.id,
      amount: t.amount,
      type: t.type,
      description: t.description,
      createdAt: t.created_at,
      balanceAfter: t.balance_after,
    })),
    cases: (userCases || []).map(c => ({
      id: c.id,
      companyName: c.company_name,
      status: c.status,
      createdAt: c.created_at,
      amount: c.amount,
      currency: c.currency || "GBP",
      confidenceScore: c.confidence_score,
      hasLetter: !!c.generated_letter,
      evidenceCount: evidenceCountMap.get(c.id) || 0,
    })),
  }
}

/**
 * Add credits to a user's account (admin action)
 */
export async function adminAddCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  const { adminClient } = await verifyAdmin()

  const { data, error } = await adminClient.rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_type: "admin_adjustment",
    p_description: reason,
    p_payment_provider: null,
    p_payment_reference: null,
  })

  if (error) {
    console.error("Error adding credits:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true, newBalance: data }
}

/**
 * Send password reset email to user
 */
export async function adminSendPasswordReset(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const { adminClient } = await verifyAdmin()

  const { error } = await adminClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) {
    console.error("Error sending password reset:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Delete a user account (admin action)
 */
export async function adminDeleteUser(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const { adminClient } = await verifyAdmin()

  // First delete user's data (cases, evidence, credits, etc.)
  // The database should have ON DELETE CASCADE, but let's be explicit

  // Delete cases (evidence should cascade)
  await adminClient.from("cases").delete().eq("user_id", userId)

  // Delete credit transactions
  await adminClient.from("credit_transactions").delete().eq("user_id", userId)

  // Delete user credits
  await adminClient.from("user_credits").delete().eq("user_id", userId)

  // Delete profile
  await adminClient.from("profiles").delete().eq("user_id", userId)

  // Finally, delete the auth user
  const { error } = await adminClient.auth.admin.deleteUser(userId)

  if (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

/**
 * Update user's profile data (admin action)
 */
export async function adminUpdateUserProfile(
  userId: string,
  updates: {
    fullName?: string
    phone?: string
    city?: string
    country?: string
  }
): Promise<{ success: boolean; error?: string }> {
  const { adminClient } = await verifyAdmin()

  const { error } = await adminClient
    .from("profiles")
    .update({
      full_name: updates.fullName,
      phone_number: updates.phone,
      city: updates.city,
      country: updates.country,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)

  if (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

/**
 * Ban a user (admin action)
 * Sets banned_until to a far future date to effectively ban the user
 */
export async function adminBanUser(
  userId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const { adminClient } = await verifyAdmin()

  // Ban until year 2099 (effectively permanent)
  const bannedUntil = new Date("2099-12-31T23:59:59Z").toISOString()

  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    ban_duration: "876000h", // ~100 years
    user_metadata: {
      banned_reason: reason || "Banned by admin",
      banned_at: new Date().toISOString(),
    },
  })

  if (error) {
    console.error("Error banning user:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

/**
 * Unban a user (admin action)
 */
export async function adminUnbanUser(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const { adminClient } = await verifyAdmin()

  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    ban_duration: "none",
    user_metadata: {
      banned_reason: null,
      banned_at: null,
    },
  })

  if (error) {
    console.error("Error unbanning user:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

/**
 * Get Stripe payment history for a user
 */
export async function getAdminUserPayments(stripeCustomerId: string): Promise<{
  payments: Array<{
    id: string
    amount: number
    currency: string
    status: string
    createdAt: string
    description: string | null
  }>
}> {
  if (!stripeCustomerId) {
    return { payments: [] }
  }

  try {
    // Import Stripe dynamically to avoid issues
    const { getStripe } = await import("@/lib/stripe")
    const stripe = getStripe()

    const paymentIntents = await stripe.paymentIntents.list({
      customer: stripeCustomerId,
      limit: 20,
    })

    return {
      payments: paymentIntents.data.map(pi => ({
        id: pi.id,
        amount: pi.amount / 100, // Convert from cents
        currency: pi.currency.toUpperCase(),
        status: pi.status,
        createdAt: new Date(pi.created * 1000).toISOString(),
        description: pi.description,
      })),
    }
  } catch (error) {
    console.error("Error fetching Stripe payments:", error)
    return { payments: [] }
  }
}

/**
 * Block an IP address (admin action)
 */
export async function adminBlockIp(
  ipAddress: string,
  userId?: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const { adminClient, adminUser } = await verifyAdmin()

  const { error } = await adminClient
    .from("blocked_ips")
    .upsert({
      ip_address: ipAddress,
      reason: reason || "Blocked by admin",
      blocked_by: adminUser.id,
      user_id: userId || null,
    }, {
      onConflict: "ip_address",
    })

  if (error) {
    console.error("Error blocking IP:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

/**
 * Unblock an IP address (admin action)
 */
export async function adminUnblockIp(
  ipAddress: string
): Promise<{ success: boolean; error?: string }> {
  const { adminClient } = await verifyAdmin()

  const { error } = await adminClient
    .from("blocked_ips")
    .delete()
    .eq("ip_address", ipAddress)

  if (error) {
    console.error("Error unblocking IP:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

/**
 * Analyze user for spam/bot behavior using AI
 */
export async function analyzeUserForSpam(
  userId: string
): Promise<{
  success: boolean
  spamScore?: number
  flags?: string[]
  reasoning?: string
  error?: string
}> {
  const { adminClient } = await verifyAdmin()

  // Gather user data for analysis
  const { data: authData } = await adminClient.auth.admin.getUserById(userId)

  const { data: profile } = await adminClient
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  const { data: cases } = await adminClient
    .from("cases")
    .select("id, company_name, complaint_text, created_at, status")
    .eq("user_id", userId)

  const { data: evidence } = await adminClient
    .from("evidence")
    .select("id, file_name, created_at")
    .eq("user_id", userId)

  // Calculate heuristic spam signals
  const flags: string[] = []
  let score = 0

  const user = authData?.user
  if (!user) {
    return { success: false, error: "User not found" }
  }

  // 1. Email pattern checks
  const email = user.email || ""
  const emailDomain = email.split("@")[1] || ""

  // Disposable email domains
  const disposableDomains = [
    "tempmail", "throwaway", "guerrillamail", "mailinator", "10minutemail",
    "yopmail", "trashmail", "fakeinbox", "temp-mail", "discard.email"
  ]
  if (disposableDomains.some(d => emailDomain.includes(d))) {
    flags.push("disposable_email")
    score += 30
  }

  // Random-looking email
  const emailLocal = email.split("@")[0]
  if (/^[a-z0-9]{10,}$/i.test(emailLocal) && !/[aeiou]{2,}/i.test(emailLocal)) {
    flags.push("random_email_pattern")
    score += 15
  }

  // 2. Account age vs activity
  const accountAge = Date.now() - new Date(user.created_at).getTime()
  const hoursSinceCreation = accountAge / (1000 * 60 * 60)

  if (hoursSinceCreation < 1 && (cases?.length || 0) > 2) {
    flags.push("rapid_case_creation")
    score += 25
  }

  // 3. Never signed in after creation (possible bot signup)
  if (!user.last_sign_in_at && hoursSinceCreation > 24) {
    flags.push("never_returned")
    score += 10
  }

  // 4. No profile data
  if (!profile?.full_name && !profile?.phone_number && !profile?.city) {
    flags.push("empty_profile")
    score += 10
  }

  // 5. Complaint text analysis
  const allComplaints = cases?.map(c => c.complaint_text || "").join(" ") || ""

  // Very short complaints
  if (cases?.length && allComplaints.length < 50 * (cases.length || 1)) {
    flags.push("minimal_complaint_text")
    score += 15
  }

  // Repeated text patterns
  const words = allComplaints.toLowerCase().split(/\s+/)
  const wordFreq = new Map<string, number>()
  words.forEach(w => wordFreq.set(w, (wordFreq.get(w) || 0) + 1))
  const maxFreq = Math.max(...Array.from(wordFreq.values()), 0)
  if (maxFreq > 20 && words.length > 50) {
    flags.push("repetitive_content")
    score += 20
  }

  // 6. No evidence uploaded
  if ((cases?.length || 0) > 0 && (evidence?.length || 0) === 0) {
    flags.push("no_evidence")
    score += 10
  }

  // 7. All cases targeting same company
  const companies = new Set(cases?.map(c => c.company_name?.toLowerCase()).filter(Boolean))
  if ((cases?.length || 0) > 3 && companies.size === 1) {
    flags.push("single_target")
    score += 15
  }

  // 8. OAuth provider check (Google/Apple less likely spam)
  const provider = user.app_metadata?.provider || user.identities?.[0]?.provider
  if (provider === "google" || provider === "apple") {
    score -= 20 // Less likely spam with verified OAuth
  }

  // Cap score at 100
  score = Math.max(0, Math.min(100, score))

  // Update profile with spam data
  await adminClient
    .from("profiles")
    .update({
      spam_score: score,
      spam_flags: flags,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)

  // Generate reasoning
  const reasoning = flags.length > 0
    ? `User flagged for: ${flags.join(", ")}. Score: ${score}/100.`
    : "No significant spam indicators detected."

  revalidatePath("/admin")
  return {
    success: true,
    spamScore: score,
    flags,
    reasoning
  }
}
