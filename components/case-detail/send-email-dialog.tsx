"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icon } from "@/lib/icons"
import {
  Mail01Icon,
  SentIcon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Loading01Icon,
  EyeIcon,
} from "@hugeicons-pro/core-stroke-rounded"
import { toast } from "sonner"
import { motion, AnimatePresence } from "motion/react"

interface SendEmailDialogProps {
  caseId: string
  letterId?: string
  companyName: string
  letterSubject: string
  letterBody: string
  contactEmails: string[]
  executiveContacts?: { name: string; title: string; email?: string }[]
  onSent?: () => void
}

type SendState = "idle" | "sending" | "success" | "error"

export function SendEmailDialog({
  caseId,
  letterId,
  companyName,
  letterSubject,
  letterBody,
  contactEmails,
  executiveContacts,
  onSent,
}: SendEmailDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<SendState>("idle")
  const [recipientEmail, setRecipientEmail] = useState(contactEmails[0] || "")
  const [customEmail, setCustomEmail] = useState("")
  const [subject, setSubject] = useState(letterSubject)
  const [body, setBody] = useState(letterBody)
  const [trackingId, setTrackingId] = useState<string | null>(null)

  // Build email options from contacts
  const emailOptions = [
    ...contactEmails.map((email) => ({ email, label: email, type: "Support" })),
    ...(executiveContacts || [])
      .filter((e) => e.email)
      .map((exec) => ({
        email: exec.email!,
        label: `${exec.name} (${exec.title})`,
        type: "Executive",
      })),
    { email: "custom", label: "Enter custom email...", type: "Custom" },
  ]

  const handleEmailSelect = (value: string) => {
    if (value === "custom") {
      setRecipientEmail("custom")
    } else {
      setRecipientEmail(value)
      setCustomEmail("")
    }
  }

  const handleSend = async () => {
    const finalEmail = recipientEmail === "custom" ? customEmail : recipientEmail

    if (!finalEmail) {
      toast.error("Please enter a recipient email")
      return
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEmail)) {
      toast.error("Please enter a valid email address")
      return
    }

    setState("sending")

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          letterId,
          recipientEmail: finalEmail,
          recipientName: companyName,
          subject,
          letterBody: body,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email")
      }

      setState("success")
      setTrackingId(data.trackingId)
      toast.success(`Email sent to ${finalEmail}`)
      onSent?.()
    } catch (error) {
      setState("error")
      toast.error(error instanceof Error ? error.message : "Failed to send email")
    }
  }

  const handleClose = () => {
    setOpen(false)
    // Reset state after dialog closes
    setTimeout(() => {
      setState("idle")
      setTrackingId(null)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="coral" className="gap-2">
          <Icon icon={SentIcon} size={16} />
          Send to Company
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <AnimatePresence mode="wait">
          {state === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <div className="h-16 w-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4">
                <Icon icon={CheckmarkCircle01Icon} size={32} className="text-forest-500" />
              </div>
              <DialogTitle className="mb-2">Email Sent Successfully!</DialogTitle>
              <DialogDescription className="mb-6">
                Your complaint has been sent to {recipientEmail === "custom" ? customEmail : recipientEmail}.
                We&apos;ll notify you when they open it.
              </DialogDescription>

              <div className="bg-forest-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-center gap-2 text-forest-700 text-sm font-medium mb-2">
                  <Icon icon={EyeIcon} size={16} />
                  Open Tracking Enabled
                </div>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll see when the company reads your email. Check back on the case detail page for updates.
                </p>
              </div>

              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            </motion.div>
          ) : state === "error" ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Icon icon={AlertCircleIcon} size={32} className="text-red-500" />
              </div>
              <DialogTitle className="mb-2">Failed to Send</DialogTitle>
              <DialogDescription className="mb-6">
                Something went wrong sending your email. Please try again or copy the letter and send it manually.
              </DialogDescription>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setState("idle")} className="flex-1">
                  Try Again
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Close
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Icon icon={Mail01Icon} size={20} className="text-peach-500" />
                  Send Complaint to {companyName}
                </DialogTitle>
                <DialogDescription>
                  Send your complaint letter directly from NoReply. We&apos;ll track when they open it.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Recipient Selection */}
                <div className="space-y-2">
                  <Label htmlFor="recipient">Send To</Label>
                  <Select value={recipientEmail} onValueChange={handleEmailSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient email" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailOptions.map((option, i) => (
                        <SelectItem key={i} value={option.email}>
                          <div className="flex items-center gap-2">
                            <span>{option.label}</span>
                            {option.type !== "Custom" && (
                              <span className="text-xs text-muted-foreground">({option.type})</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Email Input */}
                {recipientEmail === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="customEmail">Custom Email Address</Label>
                    <Input
                      id="customEmail"
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="complaints@company.com"
                    />
                  </div>
                )}

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Formal Complaint: ..."
                  />
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <Label>Letter Preview</Label>
                  <div className="bg-muted/50 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                    <p className="text-sm whitespace-pre-wrap font-mono text-muted-foreground">
                      {body.slice(0, 500)}
                      {body.length > 500 && "..."}
                    </p>
                  </div>
                </div>

                {/* Tracking Notice */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-forest-50 border border-forest-200">
                  <Icon icon={EyeIcon} size={16} className="text-forest-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-forest-700">
                    <strong>Open tracking enabled:</strong> You&apos;ll be notified when the company reads your email.
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={state === "sending"}
                  variant="coral"
                >
                  {state === "sending" ? (
                    <>
                      <Icon icon={Loading01Icon} size={16} className="mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icon icon={SentIcon} size={16} className="mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
