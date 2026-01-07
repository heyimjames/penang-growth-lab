"use client"

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react"

interface CaseTabsContextValue {
  activeTab: string
  previousTab: string | null
  setActiveTab: (tab: string) => void
  goToLetters: () => void
  goToResponses: () => void
}

const CaseTabsContext = createContext<CaseTabsContextValue | null>(null)

export function CaseTabsProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTabState] = useState("overview")
  const previousTabRef = useRef<string | null>(null)

  const setActiveTab = useCallback((tab: string) => {
    previousTabRef.current = activeTab
    setActiveTabState(tab)
  }, [activeTab])

  const goToLetters = useCallback(() => {
    setActiveTab("letters")
  }, [setActiveTab])

  const goToResponses = useCallback(() => {
    setActiveTab("responses")
  }, [setActiveTab])

  return (
    <CaseTabsContext.Provider
      value={{
        activeTab,
        previousTab: previousTabRef.current,
        setActiveTab,
        goToLetters,
        goToResponses,
      }}
    >
      {children}
    </CaseTabsContext.Provider>
  )
}

export function useCaseTabs() {
  const context = useContext(CaseTabsContext)
  if (!context) {
    throw new Error("useCaseTabs must be used within CaseTabsProvider")
  }
  return context
}
