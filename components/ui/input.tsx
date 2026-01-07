import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - 16px min font size prevents iOS zoom (Vercel guidelines)
        // Height 44px+ for touch targets
        "file:text-foreground placeholder:text-muted-foreground selection:bg-[#cff128] selection:text-[#0a0a0a] dark:bg-input/30 border-input min-h-[44px] h-11 w-full min-w-0 rounded-lg border bg-transparent px-4 py-2.5 text-base shadow-xs transition-[color,box-shadow,border-color] duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-base file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Focus states - focus-visible over focus (Vercel guidelines)
        "focus-visible:border-[#cff128] focus-visible:ring-[#cff128]/30 focus-visible:ring-[3px]",
        // Error states
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
