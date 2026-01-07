"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Icon } from "@/lib/icons"
import {
  Tick01Icon,
  Loading03Icon,
  ArrowRight01Icon,
  CreditCardIcon,
  ZapIcon,
  File01Icon,
  PercentCircleIcon,
  Cancel01Icon,
  ArrowDown01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { KnightShieldIcon, CheckmarkCircle02Icon as CheckmarkCircle02IconFill } from "@hugeicons-pro/core-bulk-rounded"
import { toast } from "sonner"
import { PRICE_IDS } from "@/lib/stripe"
import { cn } from "@/lib/utils"

interface BuyCreditsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentCredits?: number
  trigger?: "low_credits" | "no_credits" | "buy_more"
}

const creditOptions = [
  {
    id: "single",
    name: "1 Credit",
    price: "2.99",
    credits: 1,
    description: "Perfect for a single complaint",
    priceId: PRICE_IDS.SINGLE_CASE,
    icon: ZapIcon,
    perCredit: "2.99",
  },
  {
    id: "bundle",
    name: "5 Credits",
    price: "9.99",
    credits: 5,
    description: "Best value for multiple complaints",
    priceId: PRICE_IDS.CASE_BUNDLE,
    icon: File01Icon,
    perCredit: "2.00",
    savings: "33%",
    savingsAmount: "4.96",
    recommended: true,
  },
]

export function BuyCreditsDialog({
  open,
  onOpenChange,
  currentCredits = 0,
  trigger = "buy_more",
}: BuyCreditsDialogProps) {
  const [selectedOption, setSelectedOption] = useState<string>("bundle")
  const [isLoading, setIsLoading] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoStatus, setPromoStatus] = useState<{
    valid: boolean
    discount?: string
    name?: string
    error?: string
  } | null>(null)
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [showPromoInput, setShowPromoInput] = useState(false)

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return

    setIsValidatingPromo(true)
    setPromoStatus(null)

    try {
      const response = await fetch("/api/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCode: promoCode.trim() }),
      })

      const data = await response.json()

      if (data.error) {
        setPromoStatus({ valid: false, error: data.error })
      } else {
        setPromoStatus({
          valid: true,
          discount: data.discount,
          name: data.name,
        })
        toast.success(`Promo code applied: ${data.discount}`)
      }
    } catch {
      setPromoStatus({ valid: false, error: "Failed to validate" })
    } finally {
      setIsValidatingPromo(false)
    }
  }

  const handleClearPromo = () => {
    setPromoCode("")
    setPromoStatus(null)
  }

  const handlePurchase = async () => {
    const option = creditOptions.find((o) => o.id === selectedOption)
    if (!option) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: option.priceId,
          promoCode: promoStatus?.valid ? promoCode : undefined,
        }),
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
        return
      }

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

  const getHeaderContent = () => {
    switch (trigger) {
      case "no_credits":
        return {
          title: "You're out of credits",
          description: "Purchase credits to continue creating complaints",
        }
      case "low_credits":
        return {
          title: "Running low on credits",
          description: `You have ${currentCredits} credit${currentCredits === 1 ? "" : "s"} remaining`,
        }
      default:
        return {
          title: "Buy Credits",
          description: "Choose a credit package to continue",
        }
    }
  }

  const header = getHeaderContent()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <DialogHeader className="text-center pb-2">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-coral-100 dark:bg-coral-950/50"
          >
            <Icon icon={KnightShieldIcon} size={24} className="text-coral-600" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <DialogTitle className="text-xl font-display">{header.title}</DialogTitle>
            <DialogDescription>{header.description}</DialogDescription>
          </motion.div>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {creditOptions.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => setSelectedOption(option.id)}
              className={cn(
                "relative w-full rounded-xl border-2 p-4 text-left transition-colors",
                selectedOption === option.id
                  ? "border-coral-500 bg-coral-500 text-white"
                  : "border-border hover:border-coral-300 hover:bg-muted/30"
              )}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{
                    backgroundColor: selectedOption === option.id ? "rgba(255,255,255,0.2)" : "var(--muted)",
                  }}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    selectedOption === option.id ? "text-white" : "text-muted-foreground"
                  )}
                >
                  <Icon icon={option.icon} size={20} />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{option.name}</span>
                      {option.recommended && (
                        <Badge variant="secondary" className={cn(
                          "text-[10px] px-1.5 py-0",
                          selectedOption === option.id
                            ? "bg-white/20 text-white border-0"
                            : "bg-coral-100 text-coral-700 dark:bg-coral-900/50 dark:text-coral-400"
                        )}>
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">£{option.price}</span>
                    </div>
                  </div>
                  <p className={cn(
                    "text-sm mt-0.5",
                    selectedOption === option.id ? "text-white/80" : "text-muted-foreground"
                  )}>{option.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={cn(
                      "text-xs",
                      selectedOption === option.id ? "text-white/70" : "text-muted-foreground"
                    )}>
                      £{option.perCredit}/credit
                    </span>
                    {option.savingsAmount && (
                      <Badge variant="secondary" className={cn(
                        "text-[10px] px-1.5 py-0",
                        selectedOption === option.id
                          ? "bg-white/20 text-white border-0"
                          : "bg-forest-100 text-forest-700 dark:bg-forest-900/50 dark:text-forest-400"
                      )}>
                        Save £{option.savingsAmount}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="shrink-0 mt-0.5">
                  <AnimatePresence mode="wait">
                    {selectedOption === option.id ? (
                      <motion.div
                        key="selected"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Icon icon={CheckmarkCircle02IconFill} size={20} className="text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="unselected"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-5 w-5 rounded-full border-2 border-muted-foreground/30"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Promo Code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pb-2"
        >
          <AnimatePresence mode="wait">
            {!showPromoInput && !promoStatus?.valid ? (
              <motion.button
                key="promo-trigger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                onClick={() => setShowPromoInput(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-dashed border-muted-foreground/30 text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 hover:bg-muted/30 transition-colors"
              >
                <Icon icon={PercentCircleIcon} size={16} />
                <span>Have a promo code?</span>
                <Icon icon={ArrowDown01Icon} size={14} className="ml-auto" />
              </motion.button>
            ) : (
              <motion.div
                key="promo-input"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="space-y-2"
              >
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1 min-w-0">
                    <Icon
                      icon={PercentCircleIcon}
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
                    />
                    <Input
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase())
                        if (promoStatus) setPromoStatus(null)
                      }}
                      placeholder="ENTER CODE"
                      className={cn(
                        "uppercase text-sm h-10 pl-9 pr-3 bg-background",
                        promoStatus?.valid && "border-forest-500 focus-visible:ring-forest-500 focus-visible:border-forest-500",
                        promoStatus?.error && "border-destructive focus-visible:ring-destructive"
                      )}
                      disabled={promoStatus?.valid}
                      autoFocus
                    />
                  </div>
                  {promoStatus?.valid ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearPromo}
                      className="shrink-0 h-10 px-2"
                    >
                      <Icon icon={Cancel01Icon} size={14} />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleApplyPromo}
                      disabled={!promoCode.trim() || isValidatingPromo}
                      size="sm"
                      className="shrink-0 h-10"
                    >
                      {isValidatingPromo ? (
                        <Icon icon={Loading03Icon} size={14} className="animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  )}
                </div>
                <AnimatePresence>
                  {promoStatus?.valid && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 text-xs text-forest-600 font-medium"
                    >
                      <Icon icon={CheckmarkCircle01Icon} size={14} />
                      <span>{promoStatus.discount} off applied</span>
                    </motion.div>
                  )}
                  {promoStatus?.error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-destructive"
                    >
                      {promoStatus.error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="space-y-3 pt-2"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handlePurchase}
              disabled={isLoading}
              className="w-full"
              variant="coral"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Icon icon={Loading03Icon} size={18} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Checkout
                  <Icon icon={ArrowRight01Icon} size={18} className="ml-2" />
                </>
              )}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center justify-center gap-4 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-1">
              <Icon icon={CreditCardIcon} size={12} />
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon icon={Tick01Icon} size={12} />
              <span>Credits never expire</span>
            </div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
