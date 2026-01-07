import { useState, useEffect } from "react"
import { api, Case } from "@/lib/api"
import { PenLine, Folder, ChevronDown, Save, Loader2, Check, AlertCircle } from "lucide-react"

export function QuickCapture() {
  const [cases, setCases] = useState<Case[]>([])
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await api.getCases()
        setCases(data)
        if (data.length > 0) {
          setSelectedCaseId(data[0].id)
        }
      } catch (err) {
        console.error("Failed to load cases:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
  }, [])

  const selectedCase = cases.find((c) => c.id === selectedCaseId)

  const handleSave = async () => {
    if (!selectedCaseId || !content.trim()) return

    setSaving(true)
    setError(null)

    try {
      await api.addNote(selectedCaseId, content.trim())
      setSaved(true)
      setContent("")
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError("Failed to save note. Please try again.")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
      </div>
    )
  }

  if (cases.length === 0) {
    return (
      <div className="p-4">
        <div className="p-6 bg-forest-50 border border-forest-100 rounded-lg text-center">
          <Folder className="w-8 h-8 text-forest-300 mx-auto mb-2" />
          <p className="text-sm text-forest-600 font-medium mb-1">No Complaints Available</p>
          <p className="text-xs text-forest-400">
            Create a complaint on NoReply first to capture notes
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Complaint Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-forest-500 uppercase tracking-wide">
          Save To Complaint
        </label>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between gap-2 p-3 bg-white border border-forest-200 rounded-lg text-left hover:border-forest-300 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Folder className="w-4 h-4 text-coral-500 shrink-0" />
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
                    setSelectedCaseId(caseItem.id)
                    setDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-2 p-3 text-left hover:bg-forest-50 transition-colors ${
                    selectedCaseId === caseItem.id ? "bg-forest-50" : ""
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

      {/* Note Content */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-forest-500 uppercase tracking-wide">
          Note Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste chat transcript, notes, or important details here..."
          className="w-full h-40 p-3 text-sm bg-white border border-forest-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
        />
        <p className="text-xs text-forest-400">
          {content.length} characters
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Success */}
      {saved && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <Check className="w-4 h-4 shrink-0" />
          Note saved to complaint successfully!
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving || !content.trim() || !selectedCaseId}
        className="w-full flex items-center justify-center gap-2 py-3 bg-coral-500 hover:bg-coral-600 disabled:bg-coral-300 text-white font-medium rounded-full transition-colors"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Note to Complaint
          </>
        )}
      </button>

      {/* Tips */}
      <div className="p-4 bg-forest-50 border border-forest-100 rounded-lg">
        <h4 className="text-xs font-medium text-forest-700 mb-2 flex items-center gap-1">
          <PenLine className="w-3 h-3" />
          Quick Capture Tips
        </h4>
        <ul className="space-y-1 text-xs text-forest-500">
          <li>• Copy important parts of live chat conversations</li>
          <li>• Note promises or commitments made by staff</li>
          <li>• Record reference numbers and agent names</li>
          <li>• Save timestamps of key interactions</li>
        </ul>
      </div>
    </div>
  )
}
