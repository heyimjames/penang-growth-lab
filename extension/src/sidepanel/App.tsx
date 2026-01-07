import { useState, useEffect } from "react"
import { AuthGate } from "@/components/AuthGate"
import { LegalReferencePanel } from "@/components/LegalReferencePanel"
import { AIResponseAssistant } from "@/components/AIResponseAssistant"
import { CaseContextPanel } from "@/components/CaseContextPanel"
import { useAuth } from "@/hooks/useAuth"
import { api } from "@/lib/api"
import { Scale, MessageSquare, Folder, Coins } from "lucide-react"

// KnightShieldIcon SVG from hugeicons
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M10.9148 1.49784C11.2831 1.35888 11.6453 1.25 12 1.25C12.3547 1.25 12.7169 1.35888 13.0852 1.49784C13.4581 1.63848 13.9238 1.8452 14.5045 2.103C15.3581 2.48193 16.4848 2.91682 17.6932 3.26033L17.6933 3.26035C18.5751 3.51102 19.2881 3.71368 19.8282 3.9231C20.371 4.13358 20.8631 4.39466 21.1943 4.83324C21.5152 5.258 21.6386 5.75424 21.6953 6.28941C21.75 6.80597 21.75 7.45411 21.75 8.23883V11.1833C21.75 14.2392 20.3705 16.6624 18.7033 18.4686C17.0412 20.2691 14.9982 21.5272 13.6931 22.216C13.1373 22.5098 12.6829 22.75 12 22.75C11.3171 22.75 10.8627 22.5098 10.3069 22.216C9.00184 21.5272 6.95877 20.2691 5.29669 18.4686C3.62946 16.6624 2.25 14.2392 2.25 11.1833V8.23885V8.23883C2.24998 7.4541 2.24997 6.80596 2.30469 6.28941C2.36138 5.75424 2.48481 5.258 2.80565 4.83324C3.13694 4.39466 3.62904 4.13358 4.17183 3.9231C4.71192 3.71367 5.42488 3.51101 6.30675 3.26034L6.30676 3.26034C7.5152 2.91682 8.64182 2.48194 9.49543 2.10302C10.0762 1.84521 10.5419 1.63848 10.9148 1.49784Z"
        fill="currentColor"
      />
      <path
        d="M21.1944 4.83352C21.5153 5.25827 21.6387 5.75452 21.6954 6.28968C21.7501 6.80624 21.7501 7.45438 21.7501 8.23911V11.1836C21.7501 14.2395 20.3706 16.6627 18.7034 18.4688C17.0413 20.2694 14.9982 21.5275 13.6932 22.2163C13.1373 22.5101 12.683 22.7503 12.0001 22.7503C11.3171 22.7503 10.8628 22.5101 10.307 22.2163C9.03195 21.5433 7.05249 20.327 5.41211 18.5923L20.0084 3.99609C20.4791 4.19449 20.9002 4.444 21.1944 4.83352Z"
        fill="currentColor"
      />
    </svg>
  )
}

type TabId = "legal" | "suggest" | "case"

interface Tab {
  id: TabId
  label: string
  icon: typeof Scale
}

const tabs: Tab[] = [
  { id: "legal", label: "Rights", icon: Scale },
  { id: "suggest", label: "Suggest", icon: MessageSquare },
  { id: "case", label: "Case", icon: Folder },
]

export default function App() {
  const { user, loading, refreshAuth } = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>("legal")
  const [currentDomain, setCurrentDomain] = useState<string | null>(null)
  const [credits, setCredits] = useState<number | null>(null)

  // Fetch credits when user is authenticated
  useEffect(() => {
    if (!user) return

    const fetchCredits = async () => {
      try {
        const data = await api.getCredits()
        setCredits(data.credits)
      } catch (err) {
        console.error("Failed to fetch credits:", err)
      }
    }

    fetchCredits()
  }, [user])

  // Get current tab's domain
  useEffect(() => {
    const getCurrentDomain = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (tab?.url) {
          const url = new URL(tab.url)
          setCurrentDomain(url.hostname)
        }
      } catch (error) {
        console.error("Failed to get current tab:", error)
      }
    }

    getCurrentDomain()

    // Listen for tab changes
    const handleTabUpdate = () => {
      getCurrentDomain()
    }

    chrome.tabs.onActivated?.addListener(handleTabUpdate)
    chrome.tabs.onUpdated?.addListener(handleTabUpdate)

    return () => {
      chrome.tabs.onActivated?.removeListener(handleTabUpdate)
      chrome.tabs.onUpdated?.removeListener(handleTabUpdate)
    }
  }, [])

  const renderTabContent = () => {
    switch (activeTab) {
      case "legal":
        return <LegalReferencePanel domain={currentDomain} />
      case "suggest":
        return <AIResponseAssistant />
      case "case":
        return <CaseContextPanel />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-x-hidden" style={{ backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header className="flex items-center gap-2 px-4 py-3 shrink-0" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0" style={{ backgroundColor: '#355146' }}>
          <ShieldIcon className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold" style={{ color: '#111827' }}>NoReply</span>
        {currentDomain && (
          <span className="ml-auto text-xs truncate max-w-[100px]" style={{ color: '#9ca3af' }}>
            {currentDomain}
          </span>
        )}
      </header>

      <AuthGate loading={loading} user={user} onAuthSuccess={refreshAuth}>
        {/* Tab Navigation */}
        <nav className="flex gap-1 p-2 shrink-0" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: isActive ? '#FF7759' : 'transparent',
                  color: isActive ? '#ffffff' : '#4b5563',
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderTabContent()}
        </main>

        {/* Footer */}
        <footer className="px-4 py-2.5 shrink-0" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span style={{ color: '#6b7280' }}>
                {user?.email?.split("@")[0]}
              </span>
              {credits !== null && (
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: '#FFF5F2', color: '#E5634A' }}
                >
                  <Coins className="w-3 h-3" />
                  {credits} credit{credits !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <a
              href="https://www.usenoreply.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium"
              style={{ color: '#FF7759' }}
            >
              Dashboard
            </a>
          </div>
        </footer>
      </AuthGate>
    </div>
  )
}
