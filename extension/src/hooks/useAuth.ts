import { useState, useEffect, useCallback } from "react"
import { getStoredUser } from "@/lib/api"

export interface User {
  id: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const storedUser = await getStoredUser()
      setUser(storedUser)
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()

    // Listen for auth state changes from the background script
    const handleMessage = (message: { type: string; user?: User | null }) => {
      if (message.type === "AUTH_STATE_CHANGED") {
        setUser(message.user || null)
        setLoading(false)
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    // Recheck auth when window gains focus (user might have logged in via website)
    const handleFocus = () => {
      checkAuth()
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
      window.removeEventListener("focus", handleFocus)
    }
  }, [checkAuth])

  const logout = useCallback(async () => {
    chrome.runtime.sendMessage({ type: "LOGOUT" })
  }, [])

  return { user, loading, logout, refreshAuth: checkAuth }
}
