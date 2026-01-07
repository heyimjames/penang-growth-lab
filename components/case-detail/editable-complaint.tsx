"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Icon } from "@/lib/icons"
import { File01Icon, Edit01Icon, Tick01Icon, Cancel01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { updateCase } from "@/lib/actions/cases"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"

interface EditableComplaintProps {
  caseId: string
  initialComplaint: string
}

export function EditableComplaint({ caseId, initialComplaint }: EditableComplaintProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [complaint, setComplaint] = useState(initialComplaint)
  const [editedComplaint, setEditedComplaint] = useState(initialComplaint)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus and select text when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      // Move cursor to end
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      )
    }
  }, [isEditing])

  const handleEdit = () => {
    setEditedComplaint(complaint)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditedComplaint(complaint)
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (editedComplaint.trim() === complaint.trim()) {
      setIsEditing(false)
      return
    }

    if (!editedComplaint.trim()) {
      toast.error("Complaint cannot be empty")
      return
    }

    setIsSaving(true)

    try {
      const result = await updateCase(caseId, {
        complaint_text: editedComplaint.trim(),
      })

      if (result) {
        setComplaint(editedComplaint.trim())
        setIsEditing(false)
        toast.success("Complaint updated successfully")
      } else {
        toast.error("Failed to update complaint")
      }
    } catch (error) {
      console.error("Error updating complaint:", error)
      toast.error("Failed to update complaint")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel()
    }
    // Cmd/Ctrl + Enter to save
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 group relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <Icon icon={File01Icon} size={18} className="text-muted-foreground" />
          Your Complaint
        </h3>
        
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="edit-button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 px-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon icon={Edit01Icon} size={16} className="mr-1.5" />
                Edit
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="action-buttons"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <Icon icon={Cancel01Icon} size={16} className="mr-1.5" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !editedComplaint.trim()}
                className="h-8 px-3 bg-forest-500 hover:bg-forest-600 text-white"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin mr-1.5">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Icon icon={Tick01Icon} size={16} className="mr-1.5" />
                    Save
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleEdit}
            className="cursor-pointer rounded-lg -mx-2 px-2 py-1 -my-1 hover:bg-muted/50 transition-colors"
          >
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {complaint}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to edit
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Textarea
              ref={textareaRef}
              value={editedComplaint}
              onChange={(e) => setEditedComplaint(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSaving}
              className={cn(
                "min-h-[150px] text-sm leading-relaxed resize-y",
                "focus-visible:ring-forest-500 focus-visible:border-forest-500"
              )}
              placeholder="Describe your complaint..."
            />
            <p className="text-xs text-muted-foreground mt-2">
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Esc</kbd> to cancel, <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">⌘↵</kbd> to save
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


