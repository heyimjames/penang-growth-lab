"use client"

import { useState, useTransition, useEffect } from "react"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Icon } from "@/lib/icons"
import {
  Search01Icon,
  CheckmarkCircle01Icon,
  Edit02Icon,
  Cancel01Icon,
  Loading03Icon,
  File01Icon,
  Image01Icon,
  Video01Icon,
  Mail01Icon,
  Camera01Icon,
  FileAttachmentIcon,
} from "@hugeicons-pro/core-stroke-rounded"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Evidence, EvidenceAnalysisDetails } from "@/lib/types"
import {
  updateEvidenceUserContext,
  updateEvidenceAnalysisSummary,
  toggleEvidenceIndexed,
  getEvidenceFileBase64,
  getEvidenceDownloadUrl,
} from "@/lib/actions/evidence"

interface EvidenceDetailSheetProps {
  evidence: Evidence
  complaint?: string
  companyName?: string
  onAnalyze: (evidenceId: string) => Promise<void>
  onUpdate: (updated: Evidence) => void
  trigger?: React.ReactNode
}

const typeLabels: Record<EvidenceAnalysisDetails["type"], string> = {
  receipt: "Receipt/Invoice",
  communication: "Communication",
  damage: "Damage Photo",
  contract: "Contract/Terms",
  screenshot: "Screenshot",
  photo: "Photo",
  other: "Other",
}

const typeIcons: Record<EvidenceAnalysisDetails["type"], React.ComponentType<{ className?: string }>> = {
  receipt: File01Icon,
  communication: Mail01Icon,
  damage: Camera01Icon,
  contract: File01Icon,
  screenshot: Image01Icon,
  photo: Camera01Icon,
  other: File01Icon,
}

const strengthColors = {
  strong: "bg-forest-100 text-forest-700 border-forest-200 dark:bg-forest-900/50 dark:text-forest-300 dark:border-forest-800",
  moderate: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800",
  weak: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800",
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

// Check if file type is an image
const isImageType = (fileType: string) => {
  return fileType.startsWith("image/")
}

// Check if file type is a PDF
const isPdfType = (fileType: string) => {
  return fileType === "application/pdf"
}

export function EvidenceDetailSheet({
  evidence,
  complaint,
  companyName,
  onAnalyze,
  onUpdate,
  trigger,
}: EvidenceDetailSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isEditingSummary, setIsEditingSummary] = useState(false)
  const [editedSummary, setEditedSummary] = useState(evidence.analysis_summary || "")
  const [userContext, setUserContext] = useState(evidence.user_context || "")
  const [isPending, startTransition] = useTransition()
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false)

  const details = evidence.analysis_details
  const TypeIcon = details ? typeIcons[details.type] : File01Icon
  const isImage = isImageType(evidence.file_type)
  const isPdf = isPdfType(evidence.file_type)

  // Sync internal state when evidence prop changes (e.g., after analysis)
  useEffect(() => {
    setEditedSummary(evidence.analysis_summary || "")
    setUserContext(evidence.user_context || "")
  }, [evidence.analysis_summary, evidence.user_context, evidence.analyzed])

  // Fetch thumbnail URL when sheet opens
  useEffect(() => {
    if (isOpen && isImage && !thumbnailUrl) {
      setIsLoadingThumbnail(true)
      getEvidenceDownloadUrl(evidence.id)
        .then((url) => {
          setThumbnailUrl(url)
        })
        .catch((err) => {
          console.error("Failed to load thumbnail:", err)
        })
        .finally(() => {
          setIsLoadingThumbnail(false)
        })
    }
  }, [isOpen, evidence.id, isImage, thumbnailUrl])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      await onAnalyze(evidence.id)
      // Don't show toast here - parent's handleAnalyze already shows appropriate toast
    } catch (error) {
      console.error("Analysis error:", error)
      toast.error("Failed to analyze evidence")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveSummary = () => {
    startTransition(async () => {
      const updated = await updateEvidenceAnalysisSummary(evidence.id, editedSummary)
      if (updated) {
        onUpdate(updated)
        setIsEditingSummary(false)
        toast.success("Summary updated")
      } else {
        toast.error("Failed to update summary")
      }
    })
  }

  const handleSaveContext = () => {
    startTransition(async () => {
      const updated = await updateEvidenceUserContext(evidence.id, userContext)
      if (updated) {
        onUpdate(updated)
        toast.success("Context saved")
      } else {
        toast.error("Failed to save context")
      }
    })
  }

  const handleToggleIndexed = (checked: boolean) => {
    startTransition(async () => {
      const updated = await toggleEvidenceIndexed(evidence.id, checked)
      if (updated) {
        onUpdate(updated)
        toast.success(checked ? "Added to letter" : "Removed from letter")
      } else {
        toast.error("Failed to update")
      }
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-7">
            <Icon icon={InformationCircleIcon} size={14} />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-base pr-8">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Icon icon={TypeIcon} size={18} className="text-muted-foreground" />
            </div>
            <span className="truncate">{evidence.file_name}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-6">
          {/* Thumbnail Preview */}
          {isImage && (
            <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
              {isLoadingThumbnail ? (
                <div className="aspect-video flex items-center justify-center">
                  <Icon icon={Loading03Icon} size={24} className="animate-spin text-muted-foreground" />
                </div>
              ) : thumbnailUrl ? (
                <div className="relative aspect-video">
                  <Image
                    src={thumbnailUrl}
                    alt={evidence.file_name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 512px) 100vw, 512px"
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center">
                  <Icon icon={Image01Icon} size={32} className="text-muted-foreground" />
                </div>
              )}
            </div>
          )}

          {/* Document Preview Placeholder */}
          {isPdf && (
            <div className="rounded-xl border border-border bg-muted/30 p-6 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Icon icon={FileAttachmentIcon} size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <span className="text-xs text-muted-foreground">PDF Document</span>
            </div>
          )}

          {/* File Info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{evidence.file_type}</span>
            <span>•</span>
            <span>{formatFileSize(evidence.file_size || 0)}</span>
            <span>•</span>
            <span>{new Date(evidence.created_at).toLocaleDateString()}</span>
          </div>

          {/* Analysis Status */}
          {!evidence.analyzed ? (
            <div className="rounded-xl border border-dashed border-border p-5 text-center">
              <div className="w-11 h-11 rounded-xl bg-muted mx-auto mb-3 flex items-center justify-center">
                <Icon icon={Search01Icon} size={22} className="text-muted-foreground" />
              </div>
              <p className="font-medium text-sm mb-1">Not Yet Analyzed</p>
              <p className="text-xs text-muted-foreground mb-4 max-w-[240px] mx-auto">
                AI will analyze this evidence to extract key details and assess its strength.
              </p>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                variant="coral"
                className="min-w-[140px]"
              >
                {isAnalyzing ? (
                  <>
                    <Icon icon={Loading03Icon} size={16} className="mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Icon icon={Search01Icon} size={16} className="mr-2" />
                    Analyze Now
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              {/* Analysis Results */}
              <div className="space-y-4">
                {/* Type & Strength */}
                <div className="flex items-center gap-2">
                  {details && (
                    <>
                      <Badge variant="outline" className="text-xs">
                        {typeLabels[details.type]}
                      </Badge>
                      <Badge className={cn("text-xs", strengthColors[details.strength])}>
                        {details.strength.charAt(0).toUpperCase() + details.strength.slice(1)} Evidence
                      </Badge>
                    </>
                  )}
                  <Badge variant="outline" className="text-xs text-forest-600 border-forest-200">
                    <Icon icon={CheckmarkCircle01Icon} size={10} className="mr-1" />
                    Analyzed
                  </Badge>
                </div>

                {/* Summary */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-medium text-muted-foreground">AI Summary</Label>
                    {!isEditingSummary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => {
                          setEditedSummary(evidence.analysis_summary || "")
                          setIsEditingSummary(true)
                        }}
                      >
                        <Icon icon={Edit02Icon} size={12} className="mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                  {isEditingSummary ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editedSummary}
                        onChange={(e) => setEditedSummary(e.target.value)}
                        className="min-h-[100px] text-sm"
                        placeholder="Enter analysis summary..."
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveSummary}
                          disabled={isPending}
                          className="h-7"
                        >
                          {isPending ? (
                            <Icon icon={Loading03Icon} size={12} className="mr-1 animate-spin" />
                          ) : (
                            <Icon icon={CheckmarkCircle01Icon} size={12} className="mr-1" />
                          )}
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingSummary(false)}
                          disabled={isPending}
                          className="h-7"
                        >
                          <Icon icon={Cancel01Icon} size={12} className="mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm">
                      {evidence.analysis_summary || "No summary available"}
                    </p>
                  )}
                </div>

                {/* Description */}
                {details?.description && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Description
                    </Label>
                    <p className="text-sm">{details.description}</p>
                  </div>
                )}

                {/* Relevant Details */}
                {details?.relevantDetails && details.relevantDetails.length > 0 && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Key Details
                    </Label>
                    <ul className="space-y-1.5">
                      {details.relevantDetails.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-coral-500 mt-1.5 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Extracted Text */}
                {details?.extractedText && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Extracted Text
                    </Label>
                    <div className="text-sm bg-muted/30 p-3 rounded-lg font-mono text-xs whitespace-pre-wrap">
                      {details.extractedText}
                    </div>
                  </div>
                )}

                {/* Suggested Use */}
                {details?.suggestedUse && (
                  <div className="rounded-xl border border-lavender-200 dark:border-lavender-800 bg-lavender-50 dark:bg-lavender-950/30 p-4">
                    <Label className="text-xs font-medium text-lavender-700 dark:text-lavender-300 mb-2 block">
                      Suggested Use in Complaint
                    </Label>
                    <p className="text-sm text-lavender-900 dark:text-lavender-100">
                      {details.suggestedUse}
                    </p>
                  </div>
                )}

                {/* Re-analyze Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Icon icon={Loading03Icon} size={14} className="mr-2 animate-spin" />
                      Re-analyzing...
                    </>
                  ) : (
                    <>
                      <Icon icon={Search01Icon} size={14} className="mr-2" />
                      Re-analyze
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* User Context */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Your Context
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Add any additional details about this evidence that the AI might have missed.
              </p>
            </div>
            <Textarea
              value={userContext}
              onChange={(e) => setUserContext(e.target.value)}
              placeholder="e.g., 'This receipt shows I paid £250 on March 15th but only received half the items.'"
              className="min-h-[80px] text-sm"
            />
            {userContext !== (evidence.user_context || "") && (
              <Button
                size="sm"
                onClick={handleSaveContext}
                disabled={isPending}
                className="h-8"
              >
                {isPending ? (
                  <Icon icon={Loading03Icon} size={12} className="mr-1.5 animate-spin" />
                ) : (
                  <Icon icon={CheckmarkCircle01Icon} size={12} className="mr-1.5" />
                )}
                Save Context
              </Button>
            )}
          </div>

          {/* Include in Letter Toggle */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Include in Letter</Label>
                <p className="text-xs text-muted-foreground">
                  Reference this evidence in your complaint letter
                </p>
              </div>
              <Switch
                checked={evidence.indexed_for_letter}
                onCheckedChange={handleToggleIndexed}
                disabled={isPending}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
