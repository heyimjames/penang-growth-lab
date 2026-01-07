"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import {
  Coins01Icon,
  SparklesIcon,
  Loading03Icon,
  PercentCircleIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  ArrowRight01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { toast } from "sonner"
import { PRICE_IDS } from "@/lib/stripe"
import { getUserCredits, getCreditTransactions, type CreditTransaction } from "@/lib/actions/credits"

export function CreditsBillingSection() {
  const [credits, setCredits] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [promoCode, setPromoCode] = useState("")
  const [promoStatus, setPromoStatus] = useState<{
    valid: boolean
    discount?: string
    name?: string
    error?: string
  } | null>(null)
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [loadingCredits, setLoadingCredits] = useState(true)

  useEffect(() => {
    async function loadCredits() {
      const userCredits = await getUserCredits()
      const recentTransactions = await getCreditTransactions(5)
      setCredits(userCredits?.credits ?? 0)
      setTransactions(recentTransactions)
      setLoadingCredits(false)
    }
    loadCredits()
  }, [])

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
        toast.error(data.error)
      } else {
        setPromoStatus({
          valid: true,
          discount: data.discount,
          name: data.name,
        })
        toast.success(`Promo code applied: ${data.discount}`)
      }
    } catch (error) {
      setPromoStatus({ valid: false, error: "Failed to validate promo code" })
      toast.error("Failed to validate promo code")
    } finally {
      setIsValidatingPromo(false)
    }
  }

  const handleClearPromo = () => {
    setPromoCode("")
    setPromoStatus(null)
  }

  const handlePurchase = async (priceId: string, label: string) => {
    setIsLoading(priceId)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, promoCode: promoCode || undefined }),
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
      setIsLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getTransactionIcon = (type: string) => {
    if (type === "case_usage") return Cancel01Icon
    return CheckmarkCircle01Icon
  }

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? "text-emerald-600" : "text-muted-foreground"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon={Coins01Icon} size={20} />
          Credits & Billing
        </CardTitle>
        <CardDescription>Purchase credits to create complaints. Each complaint uses 1 credit.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance */}
        <div className="flex items-center justify-between p-4 bg-lavender-50 dark:bg-lavender-950/30 rounded-xl border border-lavender-200/50">
          <div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <div className="flex items-baseline gap-2">
              {loadingCredits ? (
                <div className="h-9 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <>
                  <span className="text-3xl font-bold">{credits}</span>
                  <span className="text-muted-foreground">credits</span>
                </>
              )}
            </div>
          </div>
          <div className="h-12 w-12 rounded-full bg-lavender-100 dark:bg-lavender-900/50 flex items-center justify-center">
            <Icon icon={Coins01Icon} size={24} className="text-lavender-600" />
          </div>
        </div>

        {/* Purchase Options */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Buy Credits</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Single Credit */}
            <button
              onClick={() => handlePurchase(PRICE_IDS.SINGLE_CASE, "1 Credit")}
              disabled={isLoading !== null}
              className="relative group p-4 rounded-xl border-2 border-border hover:border-coral transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">1 Credit</p>
                  <p className="text-2xl font-bold mt-1">£2.99</p>
                  <p className="text-xs text-muted-foreground mt-1">Pay as you go</p>
                </div>
                {isLoading === PRICE_IDS.SINGLE_CASE ? (
                  <Icon icon={Loading03Icon} size={20} className="animate-spin text-coral" />
                ) : (
                  <Icon icon={ArrowRight01Icon} size={20} className="text-muted-foreground group-hover:text-coral transition-colors" />
                )}
              </div>
            </button>

            {/* Bundle */}
            <button
              onClick={() => handlePurchase(PRICE_IDS.CASE_BUNDLE, "5 Credits")}
              disabled={isLoading !== null}
              className="relative group p-4 rounded-xl border-2 border-coral bg-coral/5 hover:bg-coral/10 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Badge className="absolute -top-2 -right-2 bg-coral text-white border-0">
                Save 33%
              </Badge>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">5 Credits</p>
                  <p className="text-2xl font-bold mt-1">£9.99</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="line-through">£14.95</span> Best value
                  </p>
                </div>
                {isLoading === PRICE_IDS.CASE_BUNDLE ? (
                  <Icon icon={Loading03Icon} size={20} className="animate-spin text-coral" />
                ) : (
                  <Icon icon={ArrowRight01Icon} size={20} className="text-coral group-hover:translate-x-0.5 transition-transform" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Promo Code */}
        <div className="space-y-2">
          <Label htmlFor="promo-code" className="flex items-center gap-2">
            <Icon icon={PercentCircleIcon} size={16} />
            Promo Code
          </Label>
          <div className="flex gap-2">
            <Input
              id="promo-code"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value.toUpperCase())
                if (promoStatus) setPromoStatus(null)
              }}
              placeholder="Enter code"
              className={`uppercase ${promoStatus?.valid ? "border-emerald-500 focus-visible:ring-emerald-500" : promoStatus?.error ? "border-destructive focus-visible:ring-destructive" : ""}`}
              disabled={promoStatus?.valid}
            />
            {promoStatus?.valid ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearPromo}
                className="shrink-0"
              >
                <Icon icon={Cancel01Icon} size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleApplyPromo}
                disabled={!promoCode.trim() || isValidatingPromo}
                className="shrink-0"
              >
                {isValidatingPromo ? (
                  <Icon icon={Loading03Icon} size={16} className="animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            )}
          </div>
          {promoStatus?.valid ? (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <Icon icon={CheckmarkCircle01Icon} size={16} />
              <span>{promoStatus.discount} discount applied</span>
            </div>
          ) : promoStatus?.error ? (
            <p className="text-xs text-destructive">{promoStatus.error}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Enter a promo code and click Apply to validate.
            </p>
          )}
        </div>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label className="text-base font-medium">Recent Transactions</Label>
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        icon={getTransactionIcon(tx.type)}
                        size={16}
                        className={getTransactionColor(tx.amount)}
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {tx.description || tx.type.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${getTransactionColor(tx.amount)}`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
