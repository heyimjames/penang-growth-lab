"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Icon } from "@/lib/icons"
import { Mic01Icon, MicOff01Icon, Upload01Icon, Cancel01Icon, File01Icon, Image01Icon, Video01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"
import type { CaseFormData } from "@/app/(dashboard)/new/page"
import { toast } from "sonner"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface StepOneProps {
  formData: CaseFormData
  updateFormData: (updates: Partial<CaseFormData>) => void
}

export function StepOne({ formData, updateFormData }: StepOneProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4",
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop())

        if (audioChunksRef.current.length === 0) {
          toast.error("No audio recorded")
          return
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType
        })

        // Transcribe the audio
        await transcribeAudio(audioBlob)
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setRecordingTime(0)

      trackEvent(AnalyticsEvents.CASE.VOICE_RECORDING_STARTED)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      toast.success("Recording started", { duration: 1500 })
    } catch (error) {
      console.error("Error starting recording:", error)
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        toast.error("Microphone access denied. Please allow microphone access in your browser settings.")
      } else {
        toast.error("Could not start recording. Please check your microphone.")
      }
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    toast.loading("Transcribing your voice...", { id: "transcribe" })

    try {
      const audioFormData = new FormData()
      // Convert to a file with proper extension
      const extension = audioBlob.type.includes("webm") ? "webm" : "mp4"
      const audioFile = new File([audioBlob], `recording.${extension}`, { 
        type: audioBlob.type 
      })
      audioFormData.append("audio", audioFile)

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: audioFormData,
      })

      const data = await response.json()

      if (data.success && data.text) {
        // Append transcribed text to existing complaint
        updateFormData({
          complaint: formData.complaint
            ? `${formData.complaint}\n\n${data.text}`
            : data.text,
        })
        trackEvent(AnalyticsEvents.CASE.VOICE_RECORDING_COMPLETED, {
          transcription_length: data.text.length,
          success: true,
        })
        toast.success("Voice transcribed!", { id: "transcribe" })
      } else {
        throw new Error(data.error || "Transcription failed")
      }
    } catch (error) {
      console.error("Transcription error:", error)
      trackEvent(AnalyticsEvents.CASE.VOICE_RECORDING_COMPLETED, { success: false })
      toast.error("Failed to transcribe. Please try again or type your complaint.", {
        id: "transcribe"
      })
    } finally {
      setIsTranscribing(false)
      setRecordingTime(0)
    }
  }

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      trackEvent(AnalyticsEvents.CASE.EVIDENCE_UPLOADED, {
        file_count: files.length,
        file_types: files.map(f => f.type),
        total_size_bytes: files.reduce((sum, f) => sum + f.size, 0),
      })
    }
    updateFormData({ evidence: [...formData.evidence, ...files] })
  }

  const removeFile = (index: number) => {
    const removedFile = formData.evidence[index]
    trackEvent(AnalyticsEvents.CASE.EVIDENCE_REMOVED, {
      file_type: removedFile?.type,
    })
    updateFormData({
      evidence: formData.evidence.filter((_, i) => i !== index),
    })
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return Image01Icon
    if (file.type.startsWith("video/")) return Video01Icon
    return File01Icon
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Complaint Text */}
      <div className="space-y-2">
        <Label htmlFor="complaint" className="text-base font-medium">
          Describe what happened
        </Label>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Tell us your story. The more detail you include, the stronger your case.
        </p>

        {/* Guided prompts */}
        <div className="flex flex-wrap gap-1.5 pb-1">
          <span className="text-[10px] px-2 py-1 rounded-full bg-lavender-100 dark:bg-lavender-950/40 text-lavender-700 dark:text-lavender-300">
            What went wrong?
          </span>
          <span className="text-[10px] px-2 py-1 rounded-full bg-lavender-100 dark:bg-lavender-950/40 text-lavender-700 dark:text-lavender-300">
            When did it happen?
          </span>
          <span className="text-[10px] px-2 py-1 rounded-full bg-lavender-100 dark:bg-lavender-950/40 text-lavender-700 dark:text-lavender-300">
            How much did you pay?
          </span>
          <span className="text-[10px] px-2 py-1 rounded-full bg-lavender-100 dark:bg-lavender-950/40 text-lavender-700 dark:text-lavender-300">
            What do you want them to do?
          </span>
        </div>

        <Textarea
          id="complaint"
          placeholder="Example: I booked a hotel room for my anniversary trip on March 15th, paying £450. When we arrived, the room was nothing like the photos - it had mould on the walls and a broken air conditioner. Despite complaining at reception, nothing was done. I want a full refund."
          className="min-h-[160px] sm:min-h-[200px] resize-none text-base"
          value={formData.complaint}
          onChange={(e) => updateFormData({ complaint: e.target.value })}
        />
        <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
          <span className={formData.complaint.length < 50 ? "text-amber-600" : "text-green-600"}>
            {formData.complaint.length} characters
          </span>
          <span>Min. 50</span>
        </div>
      </div>

      {/* Voice Input */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={isRecording ? "destructive" : "outline"}
          onClick={handleRecordToggle}
          disabled={isTranscribing}
          size="sm"
          className={cn(
            "gap-2",
            isRecording && "animate-pulse"
          )}
        >
          {isRecording ? (
            <>
              <Icon icon={MicOff01Icon} size={16} />
              <span className="hidden sm:inline">Stop ({formatTime(recordingTime)})</span>
              <span className="sm:hidden">{formatTime(recordingTime)}</span>
            </>
          ) : isTranscribing ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Transcribing...</span>
            </>
          ) : (
            <>
              <Icon icon={Mic01Icon} size={16} />
              <span className="hidden sm:inline">Record Voice</span>
              <span className="sm:hidden">Record</span>
            </>
          )}
        </Button>
        <span className="text-xs sm:text-sm text-muted-foreground">
          {isRecording 
            ? "Recording... click to stop" 
            : isTranscribing 
              ? "Processing your voice..." 
              : "Or speak your complaint"
          }
        </span>
      </div>

      {/* Evidence Upload */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Evidence</Label>
          <span className="text-xs text-muted-foreground">Optional</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {formData.evidence.length === 0 ? (
            <motion.button
              key="upload-zone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-full border border-dashed border-border rounded-xl p-4 sm:p-6 text-center",
                "hover:border-lavender-300 hover:bg-lavender-50/50 transition-colors active:bg-lavender-50",
              )}
            >
              <Icon icon={Upload01Icon} size={24} color="currentColor" className="mx-auto text-muted-foreground mb-1.5" />
              <p className="text-sm font-medium">Upload files</p>
              <p className="text-xs text-muted-foreground mt-0.5">Photos, receipts, screenshots</p>
            </motion.button>
          ) : (
            <motion.div 
              key="file-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {formData.evidence.map((file, index) => {
                    const FileIcon = getFileIcon(file)
                    return (
                      <motion.div
                        key={`${file.name}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                        layout
                        className="flex items-center gap-2 bg-muted rounded-lg pl-3 pr-2 py-2"
                      >
                        <Icon icon={FileIcon} size={16} color="currentColor" className="text-muted-foreground shrink-0" />
                        <span className="text-xs truncate max-w-[120px]">{file.name}</span>
                        <motion.button
                          type="button"
                          onClick={() => removeFile(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="h-5 w-5 rounded-full bg-muted-foreground/20 hover:bg-destructive/20 hover:text-destructive flex items-center justify-center transition-colors"
                        >
                          <Icon icon={Cancel01Icon} size={10} />
                        </motion.button>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-peach-500 font-medium hover:underline"
              >
                + Add more files
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Evidence tips */}
        <div className="text-xs text-muted-foreground space-y-1 pt-1">
          <p className="font-medium text-foreground/70">Strong evidence includes:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            <li>Receipts, invoices, or proof of payment</li>
            <li>Screenshots of emails or chat conversations</li>
            <li>Photos showing the problem or damage</li>
            <li>Contracts or terms of service</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
