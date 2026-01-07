"use client"

import { useState, useTransition } from "react"
import { Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { submitFeatureRequest } from "@/lib/actions/feature-requests"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface FeatureRequestFormProps {
  isAuthenticated: boolean
  onSuccess?: () => void
}

export function FeatureRequestForm({
  isAuthenticated,
  onSuccess,
}: FeatureRequestFormProps) {
  const [request, setRequest] = useState("")
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!request.trim()) return

    setResult(null)

    startTransition(async () => {
      const response = await submitFeatureRequest(request.trim())

      if (response.success) {
        trackEvent(AnalyticsEvents.FEATURES.REQUEST_SUBMITTED, {
          request_length: request.trim().length,
          success: true,
        })
        setResult({
          type: "success",
          message: "Thanks! Your feature request has been submitted for review.",
        })
        setRequest("")
        onSuccess?.()
      } else {
        trackEvent(AnalyticsEvents.FEATURES.REQUEST_SUBMITTED, {
          request_length: request.trim().length,
          success: false,
          error: response.error,
        })
        setResult({
          type: "error",
          message: response.error || "Something went wrong. Please try again.",
        })
      }
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 text-center">
        <p className="text-muted-foreground mb-4">
          Sign in to submit and vote on feature requests
        </p>
        <Button asChild>
          <a href="/auth/login">Sign In</a>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="feature-request" className="sr-only">
          Describe your feature request
        </label>
        <Textarea
          id="feature-request"
          placeholder="Describe a feature you'd like to see... (e.g., 'It would be great if I could track my complaint status via email notifications')"
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          disabled={isPending}
          className="min-h-[120px] resize-none"
          maxLength={2000}
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {request.length}/2000
        </p>
      </div>

      {result && (
        <div
          className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
            result.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {result.type === "success" ? (
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          )}
          <p>{result.message}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3 inline mr-1" />
          AI will format your request into a structured feature proposal
        </p>
        <Button
          type="submit"
          disabled={isPending || !request.trim() || request.trim().length < 10}
          className="min-w-[120px]"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  )
}
