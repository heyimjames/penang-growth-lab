import { ReactNode, useState, useEffect } from "react"
import { Loader2, Scale, MessageSquare, FileText, Eye, EyeOff, AlertCircle } from "lucide-react"
import type { User } from "@/hooks/useAuth"
import { api, storeTokens } from "@/lib/api"

const LAST_AUTH_METHOD_KEY = "noreply_last_auth_method"
type AuthMethod = "email" | "google"

interface AuthGateProps {
  loading: boolean
  user: User | null
  children: ReactNode
  onAuthSuccess?: () => void
}

const features = [
  {
    icon: Scale,
    title: "Know Your Rights",
    description: "Instant legal references for any company",
  },
  {
    icon: MessageSquare,
    title: "AI Responses",
    description: "Get suggested replies during live chats",
  },
  {
    icon: FileText,
    title: "Build Your Case",
    description: "Save evidence and notes as you go",
  },
]

// KnightShieldIcon SVG paths from hugeicons
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

export function AuthGate({ loading, user, children, onAuthSuccess }: AuthGateProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastAuthMethod, setLastAuthMethod] = useState<AuthMethod | null>(null)

  // Load last auth method on mount
  useEffect(() => {
    chrome.storage.local.get([LAST_AUTH_METHOD_KEY], (result) => {
      const stored = result[LAST_AUTH_METHOD_KEY] as AuthMethod | null
      if (stored === "email" || stored === "google") {
        setLastAuthMethod(stored)
      }
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.login(email, password)

      // Store tokens and last auth method in chrome.storage
      await storeTokens(response.access_token, response.refresh_token, response.user)
      chrome.storage.local.set({ [LAST_AUTH_METHOD_KEY]: "email" })

      // Notify background script
      chrome.runtime.sendMessage({
        type: "AUTH_STATE_CHANGED",
        user: response.user,
      })

      // Trigger refresh
      onAuthSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true)
    setError(null)

    // Store last auth method before redirect
    chrome.storage.local.set({ [LAST_AUTH_METHOD_KEY]: "google" })

    // Open the website's Google OAuth flow in a new tab
    // The extension-callback page will handle sending the tokens back
    chrome.tabs.create({
      url: "https://www.usenoreply.com/auth/login?extension=true&provider=google",
    })

    // The user will complete auth on the website, then be redirected to extension-callback
    // which will send the auth state back to the extension
    setIsGoogleLoading(false)
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-6 h-6 animate-spin mb-3" style={{ color: '#FF7759' }} />
        <p className="text-sm" style={{ color: '#6b7280' }}>Connecting...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Hero Section */}
        <div className="px-5 pt-8 pb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ backgroundColor: '#355146' }}
          >
            <ShieldIcon className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>
            Stop Getting Ignored
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
            Get real-time legal guidance and AI-powered support when dealing with companies.
          </p>
        </div>

        {/* Login Form */}
        <div className="px-5 pb-4">
          <form onSubmit={handleLogin} className="space-y-3">
            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-lg text-sm"
                style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#374151' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  color: '#111827',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF7759'
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 119, 89, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#374151' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm outline-none transition-all"
                  style={{
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    color: '#111827',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FF7759'
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 119, 89, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#9ca3af' }}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#FF7759', color: '#ffffff' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in with email"
                )}
              </button>
              {lastAuthMethod === "email" && (
                <span
                  className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: '#e0e6e3', color: '#3C5148' }}
                >
                  Last used
                </span>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full" style={{ borderTop: '1px solid #e5e7eb' }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 text-xs uppercase" style={{ backgroundColor: '#ffffff', color: '#9ca3af' }}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div className="relative">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
              style={{
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                color: '#374151',
              }}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            {lastAuthMethod === "google" && (
              <span
                className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#e0e6e3', color: '#3C5148' }}
              >
                Last used
              </span>
            )}
          </div>

          <p className="text-center text-sm mt-4" style={{ color: '#6b7280' }}>
            Don't have an account?{" "}
            <a
              href="https://www.usenoreply.com/auth/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium"
              style={{ color: '#FF7759' }}
            >
              Sign up free
            </a>
          </p>
        </div>

        {/* Features */}
        <div className="flex-1 px-5 py-4" style={{ borderTop: '1px solid #e5e7eb' }}>
          <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: '#9ca3af' }}>
            What you get
          </p>
          <div className="space-y-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#f3f4f6' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: '#4b5563' }} />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-sm font-medium" style={{ color: '#111827' }}>{feature.title}</h3>
                    <p className="text-xs" style={{ color: '#6b7280' }}>{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
