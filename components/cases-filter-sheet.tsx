"use client"

import { useState } from "react"
import { Sheet } from "@silk-hq/components"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import { 
  FilterIcon,
  SortingIcon,
  CheckmarkCircle01Icon,
  Calendar01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { cn } from "@/lib/utils"

export type CaseStatus = "all" | "draft" | "ready" | "sent" | "in_progress" | "resolved"
export type SortOption = "newest" | "oldest" | "amount_high" | "amount_low" | "company"

interface CasesFilterSheetProps {
  selectedStatus: CaseStatus
  selectedSort: SortOption
  onStatusChange: (status: CaseStatus) => void
  onSortChange: (sort: SortOption) => void
  trigger: React.ReactNode
  caseCounts?: {
    all: number
    draft: number
    ready: number
    sent: number
    in_progress: number
    resolved: number
  }
}

const statusOptions: { value: CaseStatus; label: string; color: string }[] = [
  { value: "all", label: "All Cases", color: "bg-muted text-muted-foreground" },
  { value: "draft", label: "Drafts", color: "bg-amber-100 text-amber-700" },
  { value: "ready", label: "Ready to Send", color: "bg-blue-100 text-blue-700" },
  { value: "sent", label: "Sent", color: "bg-lavender-100 text-lavender-700" },
  { value: "in_progress", label: "In Progress", color: "bg-peach-100 text-peach-700" },
  { value: "resolved", label: "Resolved", color: "bg-forest-100 text-forest-700" },
]

const sortOptions: { value: SortOption; label: string; icon: typeof ArrowUp01Icon }[] = [
  { value: "newest", label: "Newest First", icon: ArrowDown01Icon },
  { value: "oldest", label: "Oldest First", icon: ArrowUp01Icon },
  { value: "amount_high", label: "Highest Amount", icon: ArrowDown01Icon },
  { value: "amount_low", label: "Lowest Amount", icon: ArrowUp01Icon },
  { value: "company", label: "Company A-Z", icon: SortingIcon },
]

export function CasesFilterSheet({
  selectedStatus,
  selectedSort,
  onStatusChange,
  onSortChange,
  trigger,
  caseCounts,
}: CasesFilterSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempStatus, setTempStatus] = useState(selectedStatus)
  const [tempSort, setTempSort] = useState(selectedSort)

  const handleApply = () => {
    onStatusChange(tempStatus)
    onSortChange(tempSort)
    setIsOpen(false)
  }

  const handleReset = () => {
    setTempStatus("all")
    setTempSort("newest")
  }

  const hasActiveFilters = selectedStatus !== "all" || selectedSort !== "newest"

  return (
    <Sheet.Root 
      presented={isOpen} 
      onPresentedChange={(presented) => {
        setIsOpen(presented)
        if (presented) {
          // Reset temp values to current values when opening
          setTempStatus(selectedStatus)
          setTempSort(selectedSort)
        }
      }} 
      license="non-commercial"
    >
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
            <div className="px-5 pb-3 border-b border-border flex items-center justify-between shrink-0">
              <div>
                <Sheet.Title className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Icon icon={FilterIcon} size={20} className="text-lavender-500" />
                  Filter & Sort
                </Sheet.Title>
                <Sheet.Description className="text-sm text-muted-foreground mt-1">
                  Customize how your cases are displayed
                </Sheet.Description>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-sm text-lavender-600 hover:text-lavender-700 font-medium"
                >
                  Reset
                </button>
              )}
            </div>
            
            {/* Filter Content */}
            <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0">
              {/* Status Filter */}
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-3">Status</p>
                <div className="space-y-2">
                  {statusOptions.map((option) => {
                    const isSelected = tempStatus === option.value
                    const count = caseCounts?.[option.value]
                    
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTempStatus(option.value)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left active:scale-[0.98]",
                          isSelected
                            ? "border-lavender-400 bg-lavender-50 dark:bg-lavender-950/30"
                            : "border-border hover:border-muted-foreground/40 bg-card hover:bg-muted/30"
                        )}
                      >
                        <div className={cn("w-3 h-3 rounded-full", option.color)} />
                        <span className={cn(
                          "flex-1 font-medium",
                          isSelected ? "text-lavender-700 dark:text-lavender-300" : "text-foreground"
                        )}>
                          {option.label}
                        </span>
                        {count !== undefined && (
                          <Badge variant="secondary" className="text-xs">
                            {count}
                          </Badge>
                        )}
                        {isSelected && (
                          <Icon icon={CheckmarkCircle01Icon} size={18} className="text-lavender-500" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
              
              {/* Sort Options */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Sort By</p>
                <div className="space-y-2">
                  {sortOptions.map((option) => {
                    const isSelected = tempSort === option.value
                    
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTempSort(option.value)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left active:scale-[0.98]",
                          isSelected
                            ? "border-lavender-400 bg-lavender-50 dark:bg-lavender-950/30"
                            : "border-border hover:border-muted-foreground/40 bg-card hover:bg-muted/30"
                        )}
                      >
                        <Icon 
                          icon={option.icon} 
                          size={18} 
                          className={isSelected ? "text-lavender-500" : "text-muted-foreground"} 
                        />
                        <span className={cn(
                          "flex-1 font-medium",
                          isSelected ? "text-lavender-700 dark:text-lavender-300" : "text-foreground"
                        )}>
                          {option.label}
                        </span>
                        {isSelected && (
                          <Icon icon={CheckmarkCircle01Icon} size={18} className="text-lavender-500" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            
            {/* Apply Button */}
            <div className="sticky bottom-0 px-5 py-4 border-t border-border bg-card safe-area-bottom shrink-0">
              <Button
                onClick={handleApply}
                className="w-full h-12 bg-lavender-500 hover:bg-lavender-600 text-white rounded-xl text-base font-semibold"
              >
                Apply Filters
              </Button>
            </div>
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}


