"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { deleteCase } from "@/lib/actions/cases"
import { toast } from "sonner"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface DeleteCaseDialogProps {
  caseId: string
  companyName: string
}

export function DeleteCaseDialog({ caseId, companyName }: DeleteCaseDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const success = await deleteCase(caseId)
      if (success) {
        trackEvent(AnalyticsEvents.CASE.DELETED, {
          case_id: caseId,
          company_name: companyName,
        })
        toast.success("Case deleted")
        setIsOpen(false)
        router.push("/dashboard")
      } else {
        toast.error("Failed to delete case")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="text-destructive"
          onSelect={(e) => {
            e.preventDefault()
            setIsOpen(true)
          }}
        >
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete this case?</DialogTitle>
          <DialogDescription>
            This will permanently delete your case against <strong>{companyName}</strong>, including all letters and evidence. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Case"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
