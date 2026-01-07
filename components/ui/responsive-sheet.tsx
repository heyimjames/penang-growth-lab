"use client"

import { useState, useEffect } from "react"
import { Sheet } from "@silk-hq/components"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ResponsiveSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  trigger?: React.ReactNode
  /** Max width for desktop dialog */
  maxWidth?: "sm" | "md" | "lg" | "xl"
  /** Icon to show next to title */
  icon?: React.ReactNode
  /** Force sheet mode on all screen sizes */
  forceSheet?: boolean
}

const maxWidthClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
}

/**
 * Responsive sheet component that renders as a bottom sheet on mobile
 * and a centered dialog on desktop. Provides consistent UX across devices.
 */
export function ResponsiveSheet({
  open,
  onOpenChange,
  children,
  title,
  description,
  trigger,
  maxWidth = "md",
  icon,
  forceSheet = false,
}: ResponsiveSheetProps) {
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    // Check for mobile on mount and window resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Always use sheet on mobile or if forced
  if (isMobile || forceSheet) {
    return (
      <Sheet.Root presented={open} onPresentedChange={onOpenChange} license="non-commercial">
        {trigger && <Sheet.Trigger asChild>{trigger}</Sheet.Trigger>}
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
            <Sheet.Content className="rounded-t-[20px] bg-card border-t border-x border-border shadow-xl max-h-[85dvh] flex flex-col">
              <Sheet.BleedingBackground className="bg-card" />
              <Sheet.Handle className="bg-muted-foreground/20 w-10 h-1 rounded-full mx-auto mt-3 mb-2" />
              
              {/* Header */}
              {(title || description) && (
                <div className="px-5 pb-3 border-b border-border shrink-0">
                  {title && (
                    <Sheet.Title className="text-lg font-semibold text-foreground flex items-center gap-2">
                      {icon}
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

  // Desktop: use dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent className={cn(
        "p-0 gap-0 overflow-hidden",
        maxWidthClasses[maxWidth]
      )}>
        {/* Header */}
        {(title || description) && (
          <DialogHeader className="px-5 py-4 border-b border-border">
            {title && (
              <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                {icon}
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        
        {children}
      </DialogContent>
    </Dialog>
  )
}

/**
 * Scrollable body content for ResponsiveSheet
 */
export function ResponsiveSheetBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      "px-5 py-4 overflow-y-auto flex-1 min-h-0",
      className
    )}>
      {children}
    </div>
  )
}

/**
 * Fixed footer for ResponsiveSheet
 */
export function ResponsiveSheetFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      "shrink-0 px-5 py-4 border-t border-border bg-card safe-area-bottom",
      className
    )}>
      {children}
    </div>
  )
}


