import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles - 16px font prevents iOS zoom, proper selection colors
        "border-input placeholder:text-muted-foreground/70 selection:bg-[#cff128] selection:text-[#0a0a0a] dark:selection:bg-[#cff128]/30 dark:selection:text-white",
        // Focus states - focus-visible over focus (Vercel guidelines)
        "focus-visible:border-[#cff128] focus-visible:ring-[#cff128]/30",
        // Error states
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // Layout and sizing
        "dark:bg-input/30 flex field-sizing-content min-h-[88px] w-full rounded-lg border bg-transparent px-4 py-3 text-base shadow-xs transition-[color,box-shadow,border-color] duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
