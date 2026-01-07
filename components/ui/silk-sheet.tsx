"use client"

import { Sheet } from "@silk-hq/components"
import { cn } from "@/lib/utils"

interface SilkSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

/**
 * Reusable Silk Sheet wrapper component
 * Provides consistent styling and behavior across the app
 */
export function SilkSheet({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
}: SilkSheetProps) {
  return (
    <Sheet.Root presented={open} onPresentedChange={onOpenChange} license="non-commercial">
      <Sheet.Portal>
        <Sheet.View
          className="z-[100]"
          contentPlacement="bottom"
          swipeOvershoot={false}
        >
          <Sheet.Backdrop 
            className="bg-black/40 backdrop-blur-sm"
            themeColorDimming="auto"
          />
          <Sheet.Content className={cn(
            "rounded-t-[20px] bg-card border-t border-x border-border shadow-xl max-h-[85dvh] flex flex-col",
            className
          )}>
            <Sheet.BleedingBackground className="bg-card" />
            <Sheet.Handle className="bg-muted-foreground/20 w-10 h-1 rounded-full mx-auto mt-3 mb-2" />
            
            {/* Header - only if title provided */}
            {(title || description) && (
              <div className="px-5 pb-3 border-b border-border shrink-0">
                {title && (
                  <Sheet.Title className="text-lg font-semibold text-foreground">
                    {title}
                  </Sheet.Title>
                )}
                {description && (
                  <Sheet.Description className="text-sm text-muted-foreground mt-1">
                    {description}
                  </Sheet.Description>
                )}
              </div>
            )}
            
            {children}
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}

/**
 * Trigger wrapper for Silk Sheets
 */
export function SilkSheetTrigger({
  children,
  asChild = true,
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  return (
    <Sheet.Trigger asChild={asChild}>
      {children}
    </Sheet.Trigger>
  )
}

/**
 * Sheet content body with optional scrolling
 */
export function SilkSheetBody({
  children,
  className,
  scrollable = true,
}: {
  children: React.ReactNode
  className?: string
  scrollable?: boolean
}) {
  return (
    <div className={cn(
      "px-5 py-4 flex-1",
      scrollable && "overflow-y-auto",
      className
    )}>
      {children}
    </div>
  )
}

/**
 * Fixed footer for sheet actions
 */
export function SilkSheetFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      "sticky bottom-0 px-5 py-4 border-t border-border bg-card safe-area-bottom shrink-0",
      className
    )}>
      {children}
    </div>
  )
}

// Re-export Sheet.Root for controlled usage
export { Sheet }


