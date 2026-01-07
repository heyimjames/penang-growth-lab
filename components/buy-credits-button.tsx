"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icons"
import { Loading03Icon, SparklesIcon } from "@hugeicons-pro/core-stroke-rounded"
import { toast } from "sonner"

interface BuyCreditsButtonProps {
  priceId: string
  label: string
  variant?: "default" | "coral" | "outline" | "ghost"
  className?: string
}

export function BuyCreditsButton({
  priceId,
  label,
  variant = "coral",
  className,
}: BuyCreditsButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
        return
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Purchase error:", error)
      toast.error("Failed to start checkout")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={isLoading}
      variant={variant}
      className={className}
    >
      {isLoading ? (
        <Icon icon={Loading03Icon} size={16} className="mr-2 animate-spin" />
      ) : (
        <Icon icon={SparklesIcon} size={16} className="mr-2" />
      )}
      {label}
    </Button>
  )
}
