import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type CaseStatusType = "draft" | "analyzing" | "analyzed" | "ready" | "sent" | "resolved"

interface CaseStatusProps {
  status: CaseStatusType
  resolutionOutcome?: string | null
}

// Map internal statuses to user-friendly display labels
function getStatusDisplay(status: CaseStatusType, resolutionOutcome?: string | null): { label: string; className: string } {
  // All pre-send statuses show as "Preparing"
  if (status === "draft" || status === "analyzing" || status === "analyzed" || status === "ready") {
    return {
      label: "Preparing",
      className: "bg-lavender-500 text-white",
    }
  }
  
  if (status === "sent") {
    return {
      label: "Sent",
      className: "bg-forest-500 text-white",
    }
  }
  
  if (status === "resolved") {
    // Check resolution outcome to determine success/failure
    const isSuccessful = resolutionOutcome && (
      resolutionOutcome.toLowerCase().includes("refund") ||
      resolutionOutcome.toLowerCase().includes("compensation") ||
      resolutionOutcome.toLowerCase().includes("resolved") ||
      resolutionOutcome.toLowerCase().includes("successful") ||
      resolutionOutcome.toLowerCase().includes("accepted")
    )
    
    if (isSuccessful) {
      return {
        label: "Successful",
        className: "bg-forest-500 text-white",
      }
    } else if (resolutionOutcome) {
      return {
        label: "Unsuccessful",
        className: "bg-cream-600 text-white",
      }
    } else {
      // Resolved but no specific outcome - default to successful
      return {
        label: "Resolved",
        className: "bg-peach-400 text-white",
      }
    }
  }
  
  // Fallback
  return {
    label: status,
    className: "bg-muted text-muted-foreground",
  }
}

export function CaseStatus({ status, resolutionOutcome }: CaseStatusProps) {
  const config = getStatusDisplay(status, resolutionOutcome)

  return <Badge className={cn("capitalize border-0", config.className)}>{config.label}</Badge>
}
