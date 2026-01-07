"use client"

import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: number
  className?: string
}

export function Spinner({ size = 16, className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "border-2 border-current border-t-transparent rounded-full animate-spin",
        className
      )}
      style={{ width: size, height: size }}
    />
  )
}
