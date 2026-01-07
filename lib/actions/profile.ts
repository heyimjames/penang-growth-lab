"use server"

import { createClient } from "@/lib/supabase/server"

export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  phone_number: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  postcode: string | null
  country: string | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface ProfileUpdate {
  full_name?: string | null
  phone_number?: string | null
  address_line_1?: string | null
  address_line_2?: string | null
  city?: string | null
  postcode?: string | null
  country?: string | null
  onboarding_completed?: boolean
}

/**
 * Get the current user's profile
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()
  
  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }
  
  return data as Profile
}

/**
 * Update the current user's profile
 */
export async function updateProfile(updates: ProfileUpdate): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id)
    .select()
    .single()
  
  if (error) {
    console.error("Error updating profile:", error)
    return null
  }
  
  return data as Profile
}

/**
 * Get profile data formatted for letter generation
 */
export async function getProfileForLetter(): Promise<{
  fullName: string | null
  email: string | null
  phone: string | null
  address: string | null
} | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()
  
  // Build address string
  let address: string | null = null
  if (profile) {
    const parts = [
      profile.address_line_1,
      profile.address_line_2,
      profile.city,
      profile.postcode,
      profile.country
    ].filter(Boolean)
    
    if (parts.length > 0) {
      address = parts.join("\n")
    }
  }
  
  return {
    fullName: profile?.full_name || null,
    email: user.email || null,
    phone: profile?.phone_number || null,
    address
  }
}

/**
 * Mark the user's onboarding as completed
 */
export async function completeOnboarding(): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("user_id", user.id)

  if (error) {
    console.error("Error completing onboarding:", error)
    return false
  }

  return true
}
