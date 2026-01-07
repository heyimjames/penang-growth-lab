"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group !z-[99999]"
      toastOptions={{
        classNames: {
          toast: "!bg-card !border-border !text-foreground !pointer-events-auto",
          title: "!text-foreground !font-medium",
          description: "!text-muted-foreground",
          success: "!bg-card !border-forest-500/30 !text-foreground [&>svg]:!text-forest-500",
          error: "!bg-card !border-destructive/30 !text-foreground [&>svg]:!text-destructive",
          info: "!bg-card !border-lavender-500/30 !text-foreground [&>svg]:!text-lavender-500",
          warning: "!bg-card !border-peach-500/30 !text-foreground [&>svg]:!text-peach-500",
          loading: "!bg-card !border-border !text-foreground",
          closeButton: "!bg-muted !border-border !text-muted-foreground hover:!bg-muted/80 !pointer-events-auto !cursor-pointer !z-[99999]",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
