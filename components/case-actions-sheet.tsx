"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sheet } from "@silk-hq/components"
import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icons"
import { 
  EyeIcon,
  Edit01Icon,
  Copy01Icon,
  Delete01Icon,
  MoreVerticalIcon,
  Loading03Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { deleteCase, getCase, createCase } from "@/lib/actions/cases"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CaseActionsSheetProps {
  caseId: string
  caseName: string
  trigger?: React.ReactNode
  onDelete?: () => void
}

export function CaseActionsSheet({
  caseId,
  caseName,
  trigger,
  onDelete,
}: CaseActionsSheetProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)

  const handleView = () => {
    setIsOpen(false)
    router.push(`/cases/${caseId}`)
  }

  const handleEdit = () => {
    setIsOpen(false)
    router.push(`/new?draft=${caseId}`)
  }

  const handleDuplicate = async () => {
    setIsDuplicating(true)
    try {
      const originalCase = await getCase(caseId)
      if (!originalCase) {
        toast.error("Case not found")
        return
      }

      const duplicateData = {
        title: `${originalCase.title || originalCase.company_name} (Copy)`,
        complaint_text: originalCase.complaint_text,
        company_name: originalCase.company_name,
        company_domain: originalCase.company_domain,
        purchase_date: originalCase.purchase_date,
        purchase_amount: originalCase.purchase_amount,
        currency: originalCase.currency,
        desired_outcome: originalCase.desired_outcome,
        status: "draft" as const,
      }

      const newCase = await createCase(duplicateData)
      if (newCase) {
        toast.success("Case duplicated successfully")
        setIsOpen(false)
        router.push(`/cases/${newCase.id}`)
      } else {
        toast.error("Failed to duplicate case")
      }
    } catch (error) {
      console.error("Error duplicating case:", error)
      toast.error("Failed to duplicate case")
    } finally {
      setIsDuplicating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this case? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const success = await deleteCase(caseId)
      if (success) {
        toast.success("Case deleted successfully")
        setIsOpen(false)
        onDelete?.()
        router.push("/cases")
      } else {
        toast.error("Failed to delete case")
      }
    } catch (error) {
      console.error("Error deleting case:", error)
      toast.error("Failed to delete case")
    } finally {
      setIsDeleting(false)
    }
  }

  const actions = [
    {
      id: "view",
      label: "View Case",
      description: "Open case details",
      icon: EyeIcon,
      onClick: handleView,
      color: "bg-forest-100 text-forest-600 dark:bg-forest-900/50 dark:text-forest-400",
    },
    {
      id: "edit",
      label: "Edit Case",
      description: "Modify case information",
      icon: Edit01Icon,
      onClick: handleEdit,
      color: "bg-lavender-100 text-lavender-600 dark:bg-lavender-900/50 dark:text-lavender-400",
    },
    {
      id: "duplicate",
      label: "Duplicate Case",
      description: "Create a copy of this case",
      icon: Copy01Icon,
      onClick: handleDuplicate,
      loading: isDuplicating,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
    },
  ]

  return (
    <Sheet.Root presented={isOpen} onPresentedChange={setIsOpen} license="non-commercial">
      <Sheet.Trigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Icon icon={MoreVerticalIcon} size={16} />
          </Button>
        )}
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
              <Sheet.Title className="text-lg font-semibold text-foreground">
                Case Actions
              </Sheet.Title>
              <Sheet.Description className="text-sm text-muted-foreground mt-1 truncate">
                {caseName}
              </Sheet.Description>
            </div>
            
            {/* Actions */}
            <div className="px-5 py-4 space-y-2 overflow-y-auto flex-1 min-h-0">
              {actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={action.onClick}
                  disabled={action.loading}
                  className="w-full flex items-center gap-4 p-3 rounded-xl border border-border hover:border-muted-foreground/40 bg-card hover:bg-muted/30 transition-all text-left active:scale-[0.98] disabled:opacity-50"
                >
                  <div className={cn("p-2.5 rounded-xl shrink-0", action.color)}>
                    {action.loading ? (
                      <Icon icon={Loading03Icon} size={20} className="animate-spin" />
                    ) : (
                      <Icon icon={action.icon} size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-foreground block">
                      {action.loading ? "Processing..." : action.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Delete Action - Separate for safety */}
            <div className="px-5 pb-4 safe-area-bottom shrink-0 border-t border-border pt-4">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full flex items-center gap-4 p-3 rounded-xl border border-destructive/30 hover:border-destructive/50 bg-destructive/5 hover:bg-destructive/10 transition-all text-left active:scale-[0.98] disabled:opacity-50"
              >
                <div className="p-2.5 rounded-xl shrink-0 bg-destructive/10 text-destructive">
                  {isDeleting ? (
                    <Icon icon={Loading03Icon} size={20} className="animate-spin" />
                  ) : (
                    <Icon icon={Delete01Icon} size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-destructive block">
                    {isDeleting ? "Deleting..." : "Delete Case"}
                  </span>
                  <span className="text-xs text-destructive/70">
                    This action cannot be undone
                  </span>
                </div>
              </button>
            </div>
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}


