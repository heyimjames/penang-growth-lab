"use client"

import { useState } from "react"
import { Sheet } from "@silk-hq/components"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import { 
  Mail01Icon, 
  Edit02Icon,
  Clock01Icon,
  Comment01Icon,
  ArrowRight01Icon,
  JusticeScale01Icon,
  CreditCardIcon,
  CheckmarkCircle01Icon,
  File01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { cn } from "@/lib/utils"

type LetterType = 
  | "initial"
  | "follow-up"
  | "letter-before-action"
  | "escalation"
  | "chargeback"
  | "response-counter"

interface LetterTypeOption {
  value: LetterType
  label: string
  description: string
  icon: typeof Mail01Icon
  badge?: string
  badgeColor?: string
  requiresExistingLetter?: boolean
  requiresCompanyResponse?: boolean
  requiresCardPayment?: boolean
}

const letterTypes: LetterTypeOption[] = [
  {
    value: "initial",
    label: "Initial Complaint",
    description: "First letter to the company",
    icon: Mail01Icon,
    badge: "Start Here",
    badgeColor: "bg-forest-100 text-forest-700 border-forest-200",
  },
  {
    value: "follow-up",
    label: "Follow-Up",
    description: "No response after 14 days",
    icon: Clock01Icon,
    requiresExistingLetter: true,
  },
  {
    value: "response-counter",
    label: "Counter Response",
    description: "Reply to inadequate offer",
    icon: Comment01Icon,
    requiresCompanyResponse: true,
  },
  {
    value: "escalation",
    label: "Escalation",
    description: "To ombudsman/regulator",
    icon: ArrowRight01Icon,
    requiresExistingLetter: true,
  },
  {
    value: "letter-before-action",
    label: "Letter Before Action",
    description: "Final legal warning",
    icon: JusticeScale01Icon,
    badge: "Legal",
    badgeColor: "bg-red-100 text-red-700 border-red-200",
    requiresExistingLetter: true,
  },
  {
    value: "chargeback",
    label: "Chargeback / Section 75",
    description: "Claim via card issuer",
    icon: CreditCardIcon,
    requiresCardPayment: true,
  },
]

interface LetterTypeSheetProps {
  selectedType: LetterType
  onSelectType: (type: LetterType) => void
  onGenerate: () => void
  isGenerating: boolean
  hasExistingLetter: boolean
  paymentMethod?: string
  trigger: React.ReactNode
}

export function LetterTypeSheet({
  selectedType,
  onSelectType,
  onGenerate,
  isGenerating,
  hasExistingLetter,
  paymentMethod,
  trigger,
}: LetterTypeSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleGenerate = () => {
    onGenerate()
    setIsOpen(false)
  }

  return (
    <Sheet.Root presented={isOpen} onPresentedChange={setIsOpen} license="non-commercial">
      <Sheet.Trigger asChild>
        {trigger}
      </Sheet.Trigger>
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
            <div className="px-5 pb-3 border-b border-border shrink-0">
              <Sheet.Title className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Icon icon={File01Icon} size={20} className="text-lavender-500" />
                Choose Letter Type
              </Sheet.Title>
              <Sheet.Description className="text-sm text-muted-foreground mt-1">
                Select the type of letter you want to generate
              </Sheet.Description>
            </div>
            
            {/* Letter Type Options */}
            <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-2">
                {letterTypes.map((type) => {
                  const isSelected = selectedType === type.value
                  const isDisabled = (type.requiresExistingLetter && !hasExistingLetter) ||
                    (type.requiresCardPayment && !paymentMethod?.toLowerCase().includes("card") && !paymentMethod?.toLowerCase().includes("credit") && !paymentMethod?.toLowerCase().includes("debit"))
                  
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => !isDisabled && onSelectType(type.value)}
                      disabled={isDisabled}
                      className={cn(
                        "relative w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                        isSelected
                          ? "border-lavender-400 bg-lavender-50 dark:bg-lavender-950/30 ring-1 ring-lavender-400"
                          : "border-border hover:border-muted-foreground/40 bg-card hover:bg-muted/30",
                        isDisabled && "opacity-40 cursor-not-allowed hover:border-border hover:bg-card"
                      )}
                    >
                      {/* Checkmark for selected */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 z-10 bg-lavender-500 rounded-full p-0.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      )}
                      
                      {/* Icon */}
                      <div className={cn(
                        "p-2.5 rounded-xl shrink-0",
                        isSelected 
                          ? "bg-lavender-500 text-white" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        <Icon icon={type.icon} size={20} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-semibold",
                            isSelected ? "text-lavender-700 dark:text-lavender-300" : "text-foreground"
                          )}>
                            {type.label}
                          </span>
                          {type.badge && (
                            <Badge className={cn("text-[10px] px-1.5 py-0 h-4", type.badgeColor)}>
                              {type.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {type.description}
                        </p>
                        {isDisabled && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                            {type.requiresExistingLetter && !hasExistingLetter && "Requires initial letter first"}
                            {type.requiresCardPayment && "Requires card payment method"}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Fixed Footer with Generate Button */}
            <div className="shrink-0 px-5 py-4 border-t border-border bg-card safe-area-bottom">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                variant="coral"
                className="w-full h-12 text-base font-semibold"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Icon icon={Edit02Icon} size={20} className="mr-2" />
                    Generate {letterTypes.find(t => t.value === selectedType)?.label}
                  </>
                )}
              </Button>
            </div>
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}


