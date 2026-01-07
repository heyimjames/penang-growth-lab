"use client"

import { useState } from "react"
import { FeatureRequestForm } from "@/components/feature-request-form"
import { FeatureRequestList } from "@/components/feature-request-list"
import type { FeatureRequest } from "@/lib/types"

interface FeatureRequestsSectionProps {
  requests: FeatureRequest[]
  userVotes: string[]
  isAuthenticated: boolean
  highlightedId?: string
}

export function FeatureRequestsSection({
  requests,
  userVotes,
  isAuthenticated,
  highlightedId,
}: FeatureRequestsSectionProps) {
  const [key, setKey] = useState(0)

  const handleSuccess = () => {
    // Force re-render of list to show new request
    setKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-12">
      {/* Submit form */}
      <div className="max-w-2xl">
        <h3 className="text-xl font-semibold mb-4 font-display">
          Submit Your Idea
        </h3>
        <FeatureRequestForm
          isAuthenticated={isAuthenticated}
          onSuccess={handleSuccess}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-stone-200 dark:border-stone-800" />

      {/* Requests list */}
      <div key={key}>
        <h3 className="text-xl font-semibold mb-6 font-display">
          Community Requests
        </h3>
        <FeatureRequestList
          requests={requests}
          userVotes={userVotes}
          isAuthenticated={isAuthenticated}
          highlightedId={highlightedId}
        />
      </div>
    </div>
  )
}
