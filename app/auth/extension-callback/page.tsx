"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { Icon } from "@/lib/icons"

export default function ExtensionCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session) {
          setStatus("error")
          setMessage("Not logged in. Please sign in first.")
          return
        }

        // Post message to extension
        // The extension's content script will listen for this
        window.postMessage({
          type: "NOREPLY_AUTH_CALLBACK",
          payload: {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            user: {
              id: session.user.id,
              email: session.user.email || "",
            },
          },
        }, "*")

        setStatus("success")
        setMessage("You're logged in! You can close this tab and return to the extension.")

        // Also try to close the tab after a delay
        setTimeout(() => {
          window.close()
        }, 2000)
      } catch (err) {
        console.error("Extension callback error:", err)
        setStatus("error")
        setMessage("Something went wrong. Please try again.")
      }
    }

    handleAuth()
  }, [])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm text-center">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-coral-500">
            <Icon icon={KnightShieldIcon} size={28} color="white" />
          </div>

          {status === "loading" && (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
              <div>
                <h1 className="text-xl font-semibold mb-2">Connecting to Extension</h1>
                <p className="text-muted-foreground">Please wait...</p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500" />
              <div>
                <h1 className="text-xl font-semibold mb-2">Connected!</h1>
                <p className="text-muted-foreground">{message}</p>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-12 h-12 text-red-500" />
              <div>
                <h1 className="text-xl font-semibold mb-2">Connection Failed</h1>
                <p className="text-muted-foreground">{message}</p>
              </div>
              <a
                href="/auth/login?redirect=/auth/extension-callback"
                className="px-6 py-3 bg-coral-500 text-white rounded-full font-medium hover:bg-coral-600 transition-colors"
              >
                Sign In
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
