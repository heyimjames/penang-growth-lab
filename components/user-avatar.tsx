"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Color palettes from the app's design system
const colorPalettes = [
  { bg: "bg-coral-100", text: "text-coral-700", hex: { bg: "#FFE5DF", text: "#B5442E" } },
  { bg: "bg-forest-100", text: "text-forest-700", hex: { bg: "#E3EDE8", text: "#234038" } },
  { bg: "bg-lavender-100", text: "text-lavender-700", hex: { bg: "#F0E8F4", text: "#6B4A7D" } },
  { bg: "bg-peach-100", text: "text-peach-700", hex: { bg: "#FFF0E5", text: "#B56A2E" } },
  { bg: "bg-acrylic-100", text: "text-acrylic-700", hex: { bg: "#E5EFFF", text: "#1E4A9D" } },
  { bg: "bg-amber-100", text: "text-amber-700", hex: { bg: "#FEF3C7", text: "#92400E" } },
  { bg: "bg-emerald-100", text: "text-emerald-700", hex: { bg: "#D1FAE5", text: "#047857" } },
  { bg: "bg-rose-100", text: "text-rose-700", hex: { bg: "#FFE4E6", text: "#BE123C" } },
  { bg: "bg-sky-100", text: "text-sky-700", hex: { bg: "#E0F2FE", text: "#0369A1" } },
  { bg: "bg-violet-100", text: "text-violet-700", hex: { bg: "#EDE9FE", text: "#6D28D9" } },
]

/**
 * Get initials from a name or email
 */
function getInitials(name: string | null | undefined, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  if (email) {
    const localPart = email.split("@")[0]
    return localPart.slice(0, 2).toUpperCase()
  }

  return "??"
}

/**
 * Get a consistent color palette based on a string (name or email)
 */
function getColorForString(str: string): typeof colorPalettes[0] {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  const index = Math.abs(hash) % colorPalettes.length
  return colorPalettes[index]
}

interface UserAvatarProps {
  name?: string | null
  email?: string | null
  imageUrl?: string | null
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
  showTooltip?: boolean
}

const sizeClasses = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
}

export function UserAvatar({
  name,
  email,
  imageUrl,
  size = "md",
  className,
}: UserAvatarProps) {
  const initials = getInitials(name, email)
  const colorKey = name || email || "unknown"
  const colors = getColorForString(colorKey)

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {imageUrl && (
        <AvatarImage src={imageUrl} alt={name || email || "User avatar"} />
      )}
      <AvatarFallback
        className={cn(
          colors.bg,
          colors.text,
          "font-medium select-none"
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

/**
 * Get avatar color styles for inline use (e.g., in emails or when Tailwind classes aren't available)
 */
export function getAvatarStyles(name: string | null | undefined, email?: string | null) {
  const colorKey = name || email || "unknown"
  const colors = getColorForString(colorKey)
  const initials = getInitials(name, email)

  return {
    initials,
    backgroundColor: colors.hex.bg,
    color: colors.hex.text,
    bgClass: colors.bg,
    textClass: colors.text,
  }
}
