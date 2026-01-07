"use client"

import { useEffect } from "react"
import { identifyUser } from "@/lib/analytics"

interface SelineIdentifyProps {
  userId: string
  email?: string | null
  name?: string | null
  credits?: number
  plan?: string
}

export function SelineIdentify({ userId, email, name, credits, plan }: SelineIdentifyProps) {
  useEffect(() => {
    identifyUser({
      userId,
      email,
      name,
      credits: credits ?? 0,
      plan: plan || "free",
    })
  }, [userId, email, name, credits, plan])

  return null
}
