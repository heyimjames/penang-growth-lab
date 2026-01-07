import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-[#cff128]/30 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow,background-color] duration-200 overflow-hidden',
  {
    variants: {
      variant: {
        // Primary: Lime badge with black text
        default:
          'border-transparent bg-[#cff128] text-[#0a0a0a] [a&]:hover:bg-[#e5f875]',
        // Secondary: Subtle gray
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        // Destructive: Red for errors/warnings
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        // Outline: Bordered badge
        outline:
          'border-[#cff128]/50 text-foreground [a&]:hover:bg-[#cff128]/10 [a&]:hover:text-foreground',
        // Lime: Explicit lime variant
        lime:
          'border-[#cff128]/30 bg-[#cff128]/10 text-[#cff128] dark:border-[#cff128]/50 dark:bg-[#cff128]/20 dark:text-[#cff128] [a&]:hover:bg-[#cff128]/20 dark:[a&]:hover:bg-[#cff128]/30',
        // Success: Green
        success:
          'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300 [a&]:hover:bg-green-200 dark:[a&]:hover:bg-green-900/50',
        // Warning: Amber
        warning:
          'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300 [a&]:hover:bg-amber-200 dark:[a&]:hover:bg-amber-900/50',
        // Info: Blue
        info:
          'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 [a&]:hover:bg-blue-200 dark:[a&]:hover:bg-blue-900/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
