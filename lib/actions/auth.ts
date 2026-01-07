"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function resetPassword(email: string) {
  const supabase = await createClient()

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    return { error: "Site URL not configured. Please set NEXT_PUBLIC_SITE_URL environment variable." }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
