import { useState, useEffect } from "react"
import { api, Case } from "@/lib/api"
import { MessageSquare, Copy, Check, Loader2, Sparkles, AlertCircle, Save, ChevronDown } from "lucide-react"

export function AIResponseAssistant() {
  const [companyMessage, setCompanyMessage] = useState("")
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Quick capture state
  const [cases, setCases] = useState<Case[]>([])
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Fetch cases on mount
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await api.getCases()
        setCases(data)
        if (data.length > 0) {
          setSelectedCaseId(data[0].id)
        }
      } catch (err) {
        console.error("Failed to fetch cases:", err)
      }
    }
    fetchCases()
  }, [])

  const handleSuggest = async () => {
    if (!companyMessage.trim()) return

    setLoading(true)
    setError(null)
    setSuggestion(null)

    try {
      const result = await api.suggestResponse(companyMessage, "firm")
      setSuggestion(result.suggestion)
    } catch (err) {
      setError("Failed to generate suggestion. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!suggestion) return

    try {
      await navigator.clipboard.writeText(suggestion)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleSaveToCase = async () => {
    if (!selectedCaseId || !suggestion || !companyMessage) return

    setSaving(true)
    try {
      const noteContent = `**Company said:**\n${companyMessage}\n\n**My response:**\n${suggestion}`
      await api.addNote(selectedCaseId, noteContent)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error("Failed to save:", err)
      setError("Failed to save to case. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Company Message Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-forest-500 uppercase tracking-wide">
          Company's Message
        </label>
        <textarea
          value={companyMessage}
          onChange={(e) => setCompanyMessage(e.target.value)}
          placeholder="Paste what the company said here..."
          className="w-full h-32 p-3 text-sm bg-white border border-forest-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleSuggest}
        disabled={loading || !companyMessage.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 bg-coral-500 hover:bg-coral-600 disabled:bg-coral-300 text-white font-medium rounded-full transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Suggest Response
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Suggestion */}
      {suggestion && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-forest-500 uppercase tracking-wide">
              Suggested Response
            </label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-coral-500 hover:text-coral-600 font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="p-4 bg-forest-50 border border-forest-200 rounded-lg">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-forest-500 shrink-0 mt-0.5" />
              <p className="text-sm text-forest-800 whitespace-pre-wrap">{suggestion}</p>
            </div>
          </div>

          {/* Save to Case */}
          {cases.length > 0 && (
            <div className="p-3 bg-white border border-forest-100 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <select
                    value={selectedCaseId || ""}
                    onChange={(e) => setSelectedCaseId(e.target.value)}
                    className="w-full appearance-none text-xs py-2 pl-3 pr-8 bg-forest-50 border border-forest-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name || c.title || "Untitled Case"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 pointer-events-none" />
                </div>
                <button
                  onClick={handleSaveToCase}
                  disabled={saving || saved}
                  className="flex items-center gap-1.5 px-3 py-2 bg-forest-500 hover:bg-forest-600 disabled:bg-forest-300 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  {saving ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : saved ? (
                    <>
                      <Check className="w-3 h-3" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3" />
                      Save
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-forest-400">
                Save this conversation to your case as evidence
              </p>
            </div>
          )}

          <p className="text-xs text-forest-400 text-center">
            Review and personalize before sending
          </p>
        </div>
      )}

      {/* Empty State */}
      {!suggestion && !loading && (
        <div className="p-6 bg-forest-50 border border-forest-100 rounded-lg text-center">
          <MessageSquare className="w-8 h-8 text-forest-300 mx-auto mb-2" />
          <p className="text-sm text-forest-500">
            Paste the company's message and get AI-powered response suggestions
          </p>
        </div>
      )}
    </div>
  )
}
