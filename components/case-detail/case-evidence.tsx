"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect, useTransition, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import {
  File01Icon,
  Image01Icon,
  Video01Icon,
  Upload01Icon,
  Download01Icon,
  Delete01Icon,
  CheckmarkCircle01Icon,
  Add01Icon,
  Cancel01Icon,
  FolderZipIcon,
  Alert02Icon,
  Loading03Icon,
  Search01Icon,
  InformationCircleIcon,
  ArrowRight01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Evidence, EvidenceAnalysisDetails } from "@/lib/types"
import {
  getEvidence,
  uploadEvidence,
  deleteEvidence,
  getEvidenceDownloadUrl,
  getAllEvidenceDownloadUrls,
  getEvidenceFileBase64,
  updateEvidenceAnalysis,
} from "@/lib/actions/evidence"
import { EvidenceUploadSheet } from "./evidence-upload-sheet"
import { EvidenceDetailSheet } from "./evidence-detail-sheet"

interface CaseEvidenceProps {
  caseId: string
  initialEvidence?: Evidence[]
  complaint?: string
  companyName?: string
}

// Size limits
const UPLOAD_LIMIT = 50 * 1024 * 1024 // 50MB per file
const EMAIL_LIMITS = {
  gmail: 25 * 1024 * 1024,
  outlook: 20 * 1024 * 1024,
  yahoo: 25 * 1024 * 1024,
  icloud: 20 * 1024 * 1024,
}

const getFileType = (mimeType: string): "image" | "document" | "video" => {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  return "document"
}

const typeIcons = {
  image: Image01Icon,
  document: File01Icon,
  video: Video01Icon,
}

const typeBgColors = {
  image: "bg-peach-100 dark:bg-peach-900/50 text-peach-600 dark:text-peach-400",
  document: "bg-lavender-100 dark:bg-lavender-900/50 text-lavender-600 dark:text-lavender-400",
  video: "bg-forest-100 dark:bg-forest-900/50 text-forest-600 dark:text-forest-400",
}

const suggestedEvidence = [
  { type: "Receipt/Invoice", icon: File01Icon },
  { type: "Photos", icon: Image01Icon },
  { type: "Emails", icon: File01Icon },
  { type: "Contract", icon: File01Icon },
]

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

// Check if file type is an image
const isImageType = (fileType: string) => fileType.startsWith("image/")

// Thumbnail component for evidence items
function EvidenceItemThumbnail({ 
  evidence, 
  isAnalyzing 
}: { 
  evidence: Evidence
  isAnalyzing: boolean
}) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const isImage = isImageType(evidence.file_type)
  const fileType = getFileType(evidence.file_type)
  const FileTypeIcon = typeIcons[fileType]

  // Fetch thumbnail URL for images
  useEffect(() => {
    if (isImage && !thumbnailUrl) {
      setIsLoading(true)
      getEvidenceDownloadUrl(evidence.id)
        .then((url) => setThumbnailUrl(url))
        .catch((err) => console.error("Failed to load thumbnail:", err))
        .finally(() => setIsLoading(false))
    }
  }, [evidence.id, isImage, thumbnailUrl])

  return (
    <div className={cn(
      "h-8 w-8 rounded-md flex items-center justify-center shrink-0 relative overflow-hidden",
      !isImage && typeBgColors[fileType]
    )}>
      {isImage && thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={evidence.file_name}
          fill
          className="object-cover"
          sizes="32px"
        />
      ) : isImage && isLoading ? (
        <div className="bg-muted animate-pulse w-full h-full" />
      ) : (
        <Icon icon={FileTypeIcon} size={16} />
      )}
      {/* Analyzed indicator */}
      {evidence.analyzed && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-forest-500 flex items-center justify-center z-10">
          <Icon icon={CheckmarkCircle01Icon} size={8} className="text-white" />
        </div>
      )}
      {/* Analyzing spinner */}
      {isAnalyzing && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-coral-500 flex items-center justify-center z-10">
          <Icon icon={Loading03Icon} size={8} className="text-white animate-spin" />
        </div>
      )}
    </div>
  )
}

export function CaseEvidence({ caseId, initialEvidence = [], complaint, companyName }: CaseEvidenceProps) {
  const [files, setFiles] = useState<Evidence[]>(initialEvidence)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate total size and stats
  const totalSize = files.reduce((acc, f) => acc + (f.file_size || 0), 0)
  const analyzedCount = files.filter(f => f.analyzed).length
  const indexedCount = files.filter(f => f.indexed_for_letter).length
  
  // Calculate percentage used for each email provider
  const emailUsage = {
    gmail: Math.min((totalSize / EMAIL_LIMITS.gmail) * 100, 100),
    outlook: Math.min((totalSize / EMAIL_LIMITS.outlook) * 100, 100),
    yahoo: Math.min((totalSize / EMAIL_LIMITS.yahoo) * 100, 100),
    icloud: Math.min((totalSize / EMAIL_LIMITS.icloud) * 100, 100),
  }

  // Fetch evidence on mount
  useEffect(() => {
    if (initialEvidence.length === 0) {
      getEvidence(caseId).then(setFiles)
    }
  }, [caseId, initialEvidence.length])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await processFiles(e.target.files)
  }

  const processFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    
    setIsUploading(true)
    
    try {
      for (const file of Array.from(fileList)) {
        const result = await uploadEvidence(caseId, file)
        if (result) {
          setFiles(prev => [result, ...prev])
          toast.success(`Uploaded ${file.name}`)
        } else {
          toast.error(`Failed to upload ${file.name}`)
        }
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Upload failed")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDelete = async (id: string) => {
    const file = files.find(f => f.id === id)
    if (!file) return

    startTransition(async () => {
      const success = await deleteEvidence(id)
      if (success) {
        setFiles(prev => prev.filter(f => f.id !== id))
        toast.success(`Deleted ${file.file_name}`)
      } else {
        toast.error("Failed to delete file")
      }
    })
  }

  const handleDownload = async (id: string, fileName: string) => {
    setDownloadingId(id)
    try {
      const url = await getEvidenceDownloadUrl(id)
      if (url) {
        // Create a temporary link and click it
        const link = document.createElement("a")
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success(`Downloading ${fileName}`)
      } else {
        toast.error("Failed to get download link")
      }
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Download failed")
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDownloadAll = async () => {
    if (files.length === 0) {
      toast.error("No files to download")
      return
    }

    setIsDownloading(true)
    toast.loading("Preparing download...", { id: "download-all" })

    try {
      const fileUrls = await getAllEvidenceDownloadUrls(caseId)
      
      if (fileUrls.length === 0) {
        toast.error("No files available for download", { id: "download-all" })
        return
      }

      // If only one file, download directly
      if (fileUrls.length === 1) {
        const link = document.createElement("a")
        link.href = fileUrls[0].url
        link.download = fileUrls[0].fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success("Download started!", { id: "download-all" })
        return
      }

      // For multiple files, use JSZip if available, otherwise download individually
      try {
        const JSZip = (await import("jszip")).default
        const zip = new JSZip()

        // Fetch all files and add to zip
        await Promise.all(
          fileUrls.map(async ({ fileName, url }) => {
            const response = await fetch(url)
            const blob = await response.blob()
            zip.file(fileName, blob)
          })
        )

        // Generate and download zip
        const zipBlob = await zip.generateAsync({ type: "blob" })
        const zipUrl = URL.createObjectURL(zipBlob)
        const link = document.createElement("a")
        link.href = zipUrl
        link.download = `evidence-${caseId.slice(0, 8)}.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(zipUrl)
        
        toast.success("ZIP download started!", { id: "download-all" })
      } catch (zipError) {
        // Fallback: download files individually
        console.warn("JSZip not available, downloading individually:", zipError)
        for (const { fileName, url } of fileUrls) {
          const link = document.createElement("a")
          link.href = url
          link.download = fileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          await new Promise(r => setTimeout(r, 500)) // Small delay between downloads
        }
        toast.success("Downloads started!", { id: "download-all" })
      }
    } catch (error) {
      console.error("Download all error:", error)
      toast.error("Failed to download files", { id: "download-all" })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }, [caseId])

  // Analyze a single evidence file
  const handleAnalyze = async (evidenceId: string) => {
    setAnalyzingId(evidenceId)
    const toastId = toast.loading("Analyzing evidence...")

    try {
      // Get the file as base64
      const fileData = await getEvidenceFileBase64(evidenceId)
      if (!fileData) {
        toast.error("Failed to load file", { id: toastId })
        return
      }

      // Call the analysis API
      const response = await fetch("/api/analyze/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: [{
            name: fileData.fileName,
            type: fileData.mimeType,
            base64: fileData.base64,
          }],
          complaint,
          companyName,
        }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const result = await response.json()

      if (result.analyses && result.analyses.length > 0) {
        const analysis = result.analyses[0]

        // Save to database
        const updated = await updateEvidenceAnalysis(evidenceId, {
          summary: analysis.description || result.summary,
          details: {
            type: analysis.type,
            description: analysis.description,
            relevantDetails: analysis.relevantDetails || [],
            extractedText: analysis.extractedText,
            suggestedUse: analysis.suggestedUse,
            strength: analysis.strength,
          },
        })

        if (updated) {
          setFiles(prev => prev.map(f => f.id === evidenceId ? updated : f))
          toast.success("Analysis complete", { id: toastId })
        } else {
          toast.error("Failed to save analysis", { id: toastId })
        }
      }
    } catch (error) {
      console.error("Analysis error:", error)
      toast.error("Failed to analyze evidence", { id: toastId })
    } finally {
      setAnalyzingId(null)
    }
  }

  // Analyze all unanalyzed files
  const handleAnalyzeAll = async () => {
    const unanalyzed = files.filter(f => !f.analyzed)
    if (unanalyzed.length === 0) {
      toast.info("All evidence has been analyzed")
      return
    }

    setIsAnalyzingAll(true)
    const toastId = toast.loading(`Analyzing ${unanalyzed.length} file(s)...`)

    try {
      for (let i = 0; i < unanalyzed.length; i++) {
        const evidence = unanalyzed[i]
        toast.loading(`Analyzing ${i + 1}/${unanalyzed.length}: ${evidence.file_name}`, { id: toastId })
        await handleAnalyze(evidence.id)
      }
      toast.success(`Analyzed ${unanalyzed.length} file(s)`, { id: toastId })
    } catch (error) {
      console.error("Analyze all error:", error)
      toast.error("Some files failed to analyze", { id: toastId })
    } finally {
      setIsAnalyzingAll(false)
    }
  }

  // Update a single evidence item in state
  const handleEvidenceUpdate = (updated: Evidence) => {
    setFiles(prev => prev.map(f => f.id === updated.id ? updated : f))
  }

  return (
    <div className="grid lg:grid-cols-5 gap-5 pb-8">
      {/* Mobile Upload FAB */}
      <div className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom)+1rem)] left-1/2 -translate-x-1/2 z-[60] md:hidden">
        <EvidenceUploadSheet
          onUpload={processFiles}
          isUploading={isUploading}
          trigger={
            <Button
              size="lg"
              variant="coral"
              className="shadow-xl px-6 h-12"
            >
              <Icon icon={Upload01Icon} size={18} />
              <span className="font-semibold">Upload</span>
            </Button>
          }
        />
      </div>

      {/* Main Column */}
      <div className="lg:col-span-3 space-y-5">
        {/* Upload Zone - Compact (hidden on mobile, shown on desktop) */}
        <div className="hidden md:block rounded-xl border border-border bg-card">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.txt,.eml,.msg"
            onChange={handleUpload}
            className="hidden"
            disabled={isUploading}
          />
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={cn(
              "flex items-center gap-4 p-4 cursor-pointer transition-all rounded-xl",
              isDragging 
                ? "bg-peach-50 dark:bg-peach-950/30" 
                : "hover:bg-muted/30",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0",
              isDragging ? "bg-peach-100 scale-105" : "bg-muted",
              isUploading && "animate-pulse"
            )}>
              <Icon 
                icon={isUploading ? Loading03Icon : isDragging ? Add01Icon : Upload01Icon} 
                size={22} 
                className={cn(
                  isDragging ? "text-peach-600" : "text-muted-foreground",
                  isUploading && "animate-spin"
                )} 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">
                {isUploading ? "Uploading..." : isDragging ? "Drop files here" : "Upload Evidence"}
              </p>
              <p className="text-xs text-muted-foreground">
                Images, PDFs, documents, emails • Drag & drop or click
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="shrink-0" 
              disabled={isUploading}
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
            >
              Browse
            </Button>
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 ? (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {files.length} file{files.length !== 1 ? "s" : ""}
                </p>
                <Badge variant="outline" className="text-[10px]">
                  {formatFileSize(totalSize)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {/* Analyze All Button */}
                {files.some(f => !f.analyzed) && (
                  <Button
                    variant="coral"
                    size="sm"
                    onClick={handleAnalyzeAll}
                    disabled={isAnalyzingAll || analyzingId !== null}
                    className="h-7 text-xs"
                  >
                    {isAnalyzingAll ? (
                      <>
                        <Icon icon={Loading03Icon} size={12} className="mr-1.5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Icon icon={Search01Icon} size={12} className="mr-1.5" />
                        Analyze All
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadAll}
                  disabled={isDownloading || files.length === 0}
                  className="h-7 text-xs"
                >
                  {isDownloading ? (
                    <>
                      <Icon icon={Loading03Icon} size={12} className="mr-1.5 animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      <Icon icon={FolderZipIcon} size={12} className="mr-1.5" />
                      Download All
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Analysis status summary */}
            {files.length > 0 && (
              <div className="flex items-center gap-3 mb-3 text-[10px]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-forest-500" />
                  <span className="text-muted-foreground">{analyzedCount}/{files.length} analyzed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-lavender-500" />
                  <span className="text-muted-foreground">{indexedCount}/{files.length} indexed for letter</span>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              {files.map((file) => {
                const isThisDownloading = downloadingId === file.id
                const isThisAnalyzing = analyzingId === file.id

                return (
                  <div
                    key={file.id}
                    className={cn(
                      "group flex items-center gap-2.5 p-2 border rounded-lg hover:bg-muted/30 transition-colors",
                      file.indexed_for_letter
                        ? "border-lavender-300 dark:border-lavender-800 bg-lavender-50/50 dark:bg-lavender-950/20"
                        : "border-border"
                    )}
                  >
                    <EvidenceItemThumbnail evidence={file} isAnalyzing={isThisAnalyzing} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-xs truncate">{file.file_name}</p>
                        {file.indexed_for_letter && (
                          <Badge className="text-[8px] px-1 py-0 h-3.5 bg-lavender-100 text-lavender-700 border-lavender-200">
                            In Letter
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{formatFileSize(file.file_size || 0)}</span>
                        {file.analyzed && (
                          <span className="text-forest-600 dark:text-forest-400 flex items-center gap-0.5">
                            <Icon icon={CheckmarkCircle01Icon} size={10} />
                            Analyzed
                          </span>
                        )}
                        {file.analysis_summary && (
                          <span className="truncate max-w-[120px]" title={file.analysis_summary}>
                            {file.analysis_summary}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-0.5 items-center">
                      {/* Analyze button for unanalyzed files */}
                      {!file.analyzed && !isThisAnalyzing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-coral-600 bg-coral-50/50 hover:text-coral-700 hover:bg-coral-100 dark:bg-coral-950/20 dark:hover:bg-coral-950/40 border border-coral-200/50 dark:border-coral-800/30 hover:border-coral-300 dark:hover:border-coral-700 transition-all"
                          onClick={() => handleAnalyze(file.id)}
                          disabled={isAnalyzingAll || analyzingId !== null}
                        >
                          <Icon icon={Search01Icon} size={12} className="mr-1" />
                          Analyze
                        </Button>
                      )}
                      {/* Download button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleDownload(file.id, file.file_name)}
                        disabled={isThisDownloading}
                      >
                        {isThisDownloading ? (
                          <Icon icon={Loading03Icon} size={14} className="animate-spin" />
                        ) : (
                          <Icon icon={Download01Icon} size={14} />
                        )}
                      </Button>
                      {/* Delete button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(file.id)}
                        disabled={isPending}
                      >
                        <Icon icon={Delete01Icon} size={14} />
                      </Button>
                      {/* View details sheet - chevron on far right */}
                      <EvidenceDetailSheet
                        evidence={file}
                        complaint={complaint}
                        companyName={companyName}
                        onAnalyze={handleAnalyze}
                        onUpdate={handleEvidenceUpdate}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <Icon icon={ArrowRight01Icon} size={14} />
                          </Button>
                        }
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
            <Icon icon={File01Icon} size={24} className="mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No evidence uploaded yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Upload receipts, photos, emails, or other documents</p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-2 space-y-5">
        {/* Checklist */}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground mb-2">Evidence checklist</p>
          <div className="space-y-1">
            {suggestedEvidence.map((item, index) => {
              const hasIt = files.some(f => 
                f.file_name.toLowerCase().includes(item.type.toLowerCase().split("/")[0].split(" ")[0])
              )
              
              return (
                <div 
                  key={index}
                  className={cn(
                    "flex items-center gap-2 py-1.5 px-2 rounded-md text-xs transition-colors",
                    hasIt && "bg-forest-50 dark:bg-forest-950/30"
                  )}
                >
                  <Icon 
                    icon={hasIt ? CheckmarkCircle01Icon : Cancel01Icon} 
                    size={14} 
                    className={hasIt ? "text-forest-500" : "text-muted-foreground/40"} 
                  />
                  <span className={hasIt ? "text-forest-700 dark:text-forest-300 font-medium" : "text-muted-foreground"}>
                    {item.type}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* File Size Limits */}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <span className="text-base">📏</span>
            Size Usage
          </p>
          <div className="space-y-3 text-xs">
            {/* Total usage summary */}
            <div className="p-2 rounded-lg bg-muted/30">
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted-foreground">Total uploaded</span>
                <span className="font-semibold">{formatFileSize(totalSize)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {files.length} file{files.length !== 1 ? "s" : ""} • Max 50 MB per file
              </p>
            </div>

            {/* Email platform limits with progress */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">Email attachment capacity</p>
              <div className="space-y-2">
                {[
                  { name: "Gmail", limit: EMAIL_LIMITS.gmail, usage: emailUsage.gmail },
                  { name: "Outlook", limit: EMAIL_LIMITS.outlook, usage: emailUsage.outlook },
                  { name: "Yahoo", limit: EMAIL_LIMITS.yahoo, usage: emailUsage.yahoo },
                  { name: "iCloud", limit: EMAIL_LIMITS.icloud, usage: emailUsage.icloud },
                ].map((provider) => {
                  const isOverLimit = provider.usage >= 100
                  const isNearLimit = provider.usage >= 80 && provider.usage < 100
                  const remaining = Math.max(0, provider.limit - totalSize)
                  
                  return (
                    <div key={provider.name} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{provider.name}</span>
                        <span className={cn(
                          "text-[10px] font-medium",
                          isOverLimit ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-forest-600"
                        )}>
                          {isOverLimit ? "Over limit" : `${formatFileSize(remaining)} left`}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            isOverLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-forest-500"
                          )}
                          style={{ width: `${Math.min(provider.usage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Warning if over any limit */}
            {emailUsage.outlook >= 100 && (
              <div className="flex items-start gap-1.5 p-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <Icon icon={Alert02Icon} size={12} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 dark:text-amber-300">
                  Files exceed some email limits. Consider using a cloud sharing link.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <span className="text-base">📎</span>
            Evidence Tips
          </p>
          <div className="space-y-1.5">
            {[
              "Take clear, readable photos",
              "Include dates & timestamps",
              "Save emails as PDFs or .eml",
              "Keep original receipts",
              "Screenshot relevant messages",
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-lavender-100 dark:bg-lavender-900/50 flex items-center justify-center shrink-0">
                  <Icon icon={CheckmarkCircle01Icon} size={10} className="text-lavender-600 dark:text-lavender-400" />
                </div>
                <span className="text-xs text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Download Info */}
        {files.length > 0 && (
          <div className="rounded-xl border border-forest-200 dark:border-forest-800 bg-forest-50 dark:bg-forest-950/30 p-5">
            <p className="text-xs font-semibold text-forest-700 dark:text-forest-300 mb-1">
              Ready to Download
            </p>
            <p className="text-[10px] text-forest-600 dark:text-forest-400 mb-2">
              {files.length} file{files.length !== 1 ? "s" : ""} • {formatFileSize(totalSize)}
            </p>
            <Button 
              onClick={handleDownloadAll}
              disabled={isDownloading}
              size="sm"
              className="w-full bg-forest-600 hover:bg-forest-700 text-white h-8 text-xs"
            >
              {isDownloading ? (
                <>
                  <Icon icon={Loading03Icon} size={12} className="mr-1.5 animate-spin" />
                  Preparing ZIP...
                </>
              ) : (
                <>
                  <Icon icon={FolderZipIcon} size={12} className="mr-1.5" />
                  Download as ZIP
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
