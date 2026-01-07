"use client"

import { useState, useRef } from "react"
import { Sheet } from "@silk-hq/components"
import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icons"
import { 
  Upload01Icon, 
  Image01Icon,
  File01Icon,
  Camera01Icon,
  Mail01Icon,
  Loading03Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { cn } from "@/lib/utils"

interface EvidenceUploadSheetProps {
  onUpload: (files: FileList | null) => Promise<void>
  isUploading: boolean
  trigger: React.ReactNode
}

const uploadOptions = [
  {
    id: "photos",
    label: "Photos & Screenshots",
    description: "Upload from camera roll",
    icon: Image01Icon,
    accept: "image/*",
    color: "bg-peach-100 text-peach-600 dark:bg-peach-900/50 dark:text-peach-400",
  },
  {
    id: "camera",
    label: "Take Photo",
    description: "Use camera to capture",
    icon: Camera01Icon,
    accept: "image/*",
    capture: "environment" as const,
    color: "bg-forest-100 text-forest-600 dark:bg-forest-900/50 dark:text-forest-400",
  },
  {
    id: "documents",
    label: "Documents & PDFs",
    description: "Receipts, contracts, invoices",
    icon: File01Icon,
    accept: ".pdf,.doc,.docx,.txt",
    color: "bg-lavender-100 text-lavender-600 dark:bg-lavender-900/50 dark:text-lavender-400",
  },
  {
    id: "emails",
    label: "Email Files",
    description: "Saved email conversations",
    icon: Mail01Icon,
    accept: ".eml,.msg,.pdf",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
  },
]

export function EvidenceUploadSheet({
  onUpload,
  isUploading,
  trigger,
}: EvidenceUploadSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await onUpload(e.target.files)
      setIsOpen(false)
      // Reset the input
      e.target.value = ""
    }
  }

  const triggerUpload = (optionId: string) => {
    const input = fileInputRefs.current[optionId]
    if (input) {
      input.click()
    }
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
                <Icon icon={Upload01Icon} size={20} className="text-peach-500" />
                Upload Evidence
              </Sheet.Title>
              <Sheet.Description className="text-sm text-muted-foreground mt-1">
                Choose what type of evidence to upload
              </Sheet.Description>
            </div>
            
            {/* Upload Options */}
            <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0">
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Icon icon={Loading03Icon} size={32} className="text-peach-500 animate-spin mb-3" />
                  <p className="text-sm font-medium text-foreground">Uploading...</p>
                  <p className="text-xs text-muted-foreground mt-1">Please wait while your files are being processed</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {uploadOptions.map((option) => (
                    <div key={option.id}>
                      <input
                        ref={(el) => { fileInputRefs.current[option.id] = el }}
                        type="file"
                        multiple
                        accept={option.accept}
                        capture={option.capture}
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => triggerUpload(option.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-muted-foreground/40 bg-card hover:bg-muted/30 transition-all text-left active:scale-[0.98]"
                      >
                        <div className={cn("p-3 rounded-xl shrink-0", option.color)}>
                          <Icon icon={option.icon} size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-foreground block">
                            {option.label}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {option.description}
                          </span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Tips */}
            <div className="px-5 pb-4 safe-area-bottom shrink-0">
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Tip:</strong> Upload receipts, screenshots, photos, emails, and contracts to strengthen your case. Max 50MB per file.
                </p>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}


