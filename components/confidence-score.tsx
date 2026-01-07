import { cn } from "@/lib/utils"

interface ConfidenceScoreProps {
  score: number
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "subtle"
  className?: string
}

export function ConfidenceScore({ score, showLabel = true, size = "md", variant = "default", className }: ConfidenceScoreProps) {
  const getColor = (score: number) => {
    if (variant === "subtle") {
      // Subtle variant - better contrast, no background
      if (score >= 80) return "text-emerald-700 dark:text-emerald-400"
      if (score >= 60) return "text-amber-700 dark:text-amber-400"
      return "text-red-700 dark:text-red-400"
    }
    // Default variant - white background
    if (score >= 80) return "text-emerald-900 dark:text-emerald-700 bg-white dark:bg-gray-900"
    if (score >= 60) return "text-amber-900 dark:text-amber-700 bg-white dark:bg-gray-900"
    return "text-red-900 dark:text-red-700 bg-white dark:bg-gray-900"
  }

  const getDotColor = (score: number) => {
    if (score >= 80) return "bg-emerald-400 dark:bg-emerald-300"
    if (score >= 60) return "bg-amber-500 dark:bg-amber-400"
    return "bg-red-500 dark:bg-red-400"
  }

  const getLabel = (score: number) => {
    if (score >= 80) return "Strong"
    if (score >= 60) return "Moderate"
    return "Weak"
  }

  const sizeClasses = {
    sm: variant === "subtle" ? "text-sm" : "px-2 py-1 text-xs",
    md: variant === "subtle" ? "text-sm" : "px-3 py-1.5 text-sm",
    lg: variant === "subtle" ? "text-base" : "px-4 py-2 text-base",
  }

  const dotSizes = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-2.5 w-2.5",
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-2 font-semibold",
      variant === "default" && "rounded-full",
      getColor(score), 
      sizeClasses[size], 
      className
    )}>
      <div className={cn("rounded-full", getDotColor(score), dotSizes[size])} />
      {showLabel && <span>{getLabel(score)}</span>}
      <span>{score}%</span>
    </div>
  )
}
