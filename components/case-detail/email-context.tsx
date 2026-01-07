"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

interface ExecutiveContact {
  name: string
  title: string
  email?: string
  linkedIn?: string
}

interface EmailContextType {
  additionalEmails: string[]
  additionalExecutives: ExecutiveContact[]
  addEmails: (emails: string[], executives: ExecutiveContact[]) => void
}

const EmailContext = createContext<EmailContextType | null>(null)

export function EmailProvider({ 
  children,
  initialEmails = [],
  initialExecutives = [],
}: { 
  children: ReactNode
  initialEmails?: string[]
  initialExecutives?: ExecutiveContact[]
}) {
  const [additionalEmails, setAdditionalEmails] = useState<string[]>(initialEmails)
  const [additionalExecutives, setAdditionalExecutives] = useState<ExecutiveContact[]>(initialExecutives)

  const addEmails = useCallback((emails: string[], executives: ExecutiveContact[]) => {
    setAdditionalEmails(prev => {
      const combined = [...prev, ...emails]
      return combined.filter((email, index) => combined.indexOf(email) === index)
    })
    setAdditionalExecutives(prev => {
      const combined = [...prev, ...executives]
      const seen = new Set<string>()
      return combined.filter(exec => {
        const key = exec.name.toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    })
  }, [])

  return (
    <EmailContext.Provider value={{ additionalEmails, additionalExecutives, addEmails }}>
      {children}
    </EmailContext.Provider>
  )
}

export function useEmailContext() {
  const context = useContext(EmailContext)
  if (!context) {
    // Return a no-op version if not in provider (for standalone usage)
    return {
      additionalEmails: [],
      additionalExecutives: [],
      addEmails: () => {},
    }
  }
  return context
}




