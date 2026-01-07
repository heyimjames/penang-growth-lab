import { useState, useEffect } from "react"
import { api, Case } from "@/lib/api"
import { Folder, FolderOpen, ChevronDown, ExternalLink, Loader2, AlertCircle, Building2 } from "lucide-react"

export function CaseContextPanel() {
  const [cases, setCases] = useState<Case[]>([])
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await api.getCases()
        // Ensure data is an array
        const casesArray = Array.isArray(data) ? data : []
        // Normalize case data to ensure identified_issues is always an array or null
        const normalizedCases = casesArray.map((c: Case) => ({
          ...c,
          identified_issues: Array.isArray(c.identified_issues)
            ? c.identified_issues
            : c.identified_issues
              ? [c.identified_issues]
              : null
        }))
        setCases(normalizedCases)
        // Auto-select the most recent case
        if (normalizedCases.length > 0) {
          setSelectedCase(normalizedCases[0])
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load cases"
        setError(errorMessage)
        console.error("CaseContextPanel fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "in_progress":
        return "bg-yellow-100 text-yellow-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-forest-100 text-forest-700"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "in_progress":
        return "In Progress"
      case "draft":
        return "Draft"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      </div>
    )
  }

  if (cases.length === 0) {
    return (
      <div className="p-4">
        <div className="p-6 bg-forest-50 border border-forest-100 rounded-lg text-center">
          <Folder className="w-8 h-8 text-forest-300 mx-auto mb-2" />
          <p className="text-sm text-forest-600 font-medium mb-1">No Complaints Yet</p>
          <p className="text-xs text-forest-400 mb-4">
            Start a complaint on NoReply to access it here
          </p>
          <a
            href="https://www.usenoreply.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-coral-500 hover:text-coral-600 font-medium"
          >
            Create New Complaint
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Complaint Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-forest-500 uppercase tracking-wide">
          Active Complaint
        </label>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between gap-2 p-3 bg-white border border-forest-200 rounded-lg text-left hover:border-forest-300 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <FolderOpen className="w-4 h-4 text-coral-500 shrink-0" />
              <span className="text-sm font-medium text-forest-900 truncate">
                {selectedCase?.company_name || selectedCase?.title || "Select a case"}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-forest-400 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-forest-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {cases.map((caseItem) => (
                <button
                  key={caseItem.id}
                  onClick={() => {
                    setSelectedCase(caseItem)
                    setDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-2 p-3 text-left hover:bg-forest-50 transition-colors ${
                    selectedCase?.id === caseItem.id ? "bg-forest-50" : ""
                  }`}
                >
                  <Folder className="w-4 h-4 text-forest-400 shrink-0" />
                  <span className="text-sm text-forest-900 truncate">
                    {caseItem.company_name || caseItem.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Case Details */}
      {selectedCase && (
        <div className="space-y-3">
          {/* Status Card */}
          <div className="p-4 bg-white border border-forest-100 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-forest-500" />
                <span className="font-medium text-forest-900">
                  {selectedCase.company_name || "Unknown Company"}
                </span>
              </div>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(
                  selectedCase.status
                )}`}
              >
                {getStatusLabel(selectedCase.status)}
              </span>
            </div>

            {selectedCase.confidence_score && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-forest-500">Complaint Strength</span>
                  <span className="font-medium text-forest-700">
                    {Math.round(selectedCase.confidence_score * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-forest-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-coral-500 rounded-full"
                    style={{ width: `${selectedCase.confidence_score * 100}%` }}
                  />
                </div>
              </div>
            )}

            <a
              href={`https://www.usenoreply.com/cases/${selectedCase.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 w-full py-2 text-xs text-coral-500 hover:text-coral-600 font-medium border border-coral-200 rounded-lg hover:bg-coral-50 transition-colors"
            >
              View Full Complaint
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Issues */}
          {selectedCase.identified_issues && selectedCase.identified_issues.length > 0 && (
            <div className="p-4 bg-white border border-forest-100 rounded-lg">
              <h4 className="text-xs font-medium text-forest-500 uppercase tracking-wide mb-2">
                Identified Issues
              </h4>
              <ul className="space-y-1">
                {selectedCase.identified_issues.slice(0, 4).map((issue, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-forest-700">
                    <span className="text-coral-500 mt-0.5">•</span>
                    {issue}
                  </li>
                ))}
                {selectedCase.identified_issues.length > 4 && (
                  <li className="text-xs text-forest-400">
                    +{selectedCase.identified_issues.length - 4} more
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Legal Basis */}
          {selectedCase.legal_basis && (
            <div className="p-4 bg-coral-50 border border-coral-200 rounded-lg">
              <h4 className="text-xs font-medium text-coral-700 uppercase tracking-wide mb-2">
                Legal Basis
              </h4>
              <p className="text-xs text-coral-800">{selectedCase.legal_basis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
