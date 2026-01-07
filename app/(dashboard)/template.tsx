"use client"

import { ReactNode } from "react"
import { PageTransition } from "@/components/page-transition"

export default function DashboardTemplate({ children }: { children: ReactNode }) {
  return <PageTransition mode="slide">{children}</PageTransition>
}
