import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles with GPU-accelerated transitions (transform, opacity only for animations)
  // Focus-visible over focus per Vercel guidelines
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background select-none",
  {
    variants: {
      variant: {
        // Primary: Lime button with black text - high contrast
        default:
          "bg-[#cff128] text-[#0a0a0a] hover:bg-[#e5f875] active:bg-[#a8c41f] focus-visible:ring-[#cff128]/70 shadow-sm hover:shadow-md active:scale-[0.98]",
        // Lime variant alias for explicit usage
        lime:
          "bg-[#cff128] text-[#0a0a0a] hover:bg-[#e5f875] active:bg-[#a8c41f] focus-visible:ring-[#cff128]/70 shadow-sm hover:shadow-md active:scale-[0.98]",
        // Dark: Black button with white text
        dark:
          "bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] active:bg-black focus-visible:ring-[#cff128]/50 border border-white/10 hover:border-white/20",
        // Destructive: Red for dangerous actions
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive focus-visible:ring-destructive/50",
        // Outline: Bordered button
        outline:
          "border-2 border-[#cff128] bg-transparent text-foreground hover:bg-[#cff128]/10 active:bg-[#cff128]/20 focus-visible:ring-[#cff128]/50",
        // Secondary: Subtle gray button
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 focus-visible:ring-secondary/50",
        // Ghost: Invisible until hovered
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 focus-visible:ring-accent/50",
        // Link: Text only with underline
        link:
          "text-[#cff128] underline-offset-4 hover:underline focus-visible:ring-[#cff128]/50",
      },
      size: {
        // Sizes ensure 44px min touch target on mobile (Vercel guidelines)
        default: "h-11 px-6 py-2.5 min-w-[44px]",
        sm: "h-9 rounded-full gap-1.5 px-4 text-xs min-w-[44px]",
        lg: "h-12 rounded-full px-8 text-base min-w-[44px]",
        xl: "h-14 rounded-full px-10 text-lg min-w-[44px]",
        icon: "size-11 rounded-full",
        "icon-sm": "size-9 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
