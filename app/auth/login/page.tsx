"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { Icon } from "@/lib/icons"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { CheckmarkCircle02Icon, ShieldKeyIcon, Tick02Icon } from "@hugeicons-pro/core-stroke-rounded"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

const LAST_AUTH_METHOD_KEY = "noreply_last_auth_method"

type AuthMethod = "email" | "google"

const benefits = [
  "Pick up where you left off",
  "Track all your active cases",
  "View response deadlines",
  "Access your complaint history"
]

const stats = [
  { value: "87%", label: "Success rate" },
  { value: "£420", label: "Avg. recovered" },
  { value: "24h", label: "Typical response" }
]

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [lastAuthMethod, setLastAuthMethod] = useState<AuthMethod | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const isExtension = searchParams.get("extension") === "true"
  const provider = searchParams.get("provider")
  const redirect = isExtension ? "/auth/extension-callback" : (searchParams.get("redirect") || "/dashboard")

  // Load last auth method on mount
  useEffect(() => {
    const stored = localStorage.getItem(LAST_AUTH_METHOD_KEY) as AuthMethod | null
    if (stored === "email" || stored === "google") {
      setLastAuthMethod(stored)
    }
  }, [])

  // Auto-trigger Google sign-in if requested by extension
  useEffect(() => {
    if (isExtension && provider === "google") {
      const autoTriggerGoogle = async () => {
        const supabase = createClient()
        setIsGoogleLoading(true)
        setError(null)

        try {
          localStorage.setItem(LAST_AUTH_METHOD_KEY, "google")
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
            },
          })
          if (error) throw error
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "An error occurred")
          setIsGoogleLoading(false)
        }
      }
      autoTriggerGoogle()
    }
  }, [isExtension, provider, redirect])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    trackEvent(AnalyticsEvents.AUTH.LOGIN_STARTED, { method: "email" })

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      // Store last used method
      localStorage.setItem(LAST_AUTH_METHOD_KEY, "email")
      trackEvent(AnalyticsEvents.AUTH.LOGIN_COMPLETED, { method: "email" })
      window.location.href = redirect
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      trackEvent("login_failed", { method: "email", error: error instanceof Error ? error.message : "unknown" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    setIsGoogleLoading(true)
    setError(null)

    trackEvent(AnalyticsEvents.AUTH.LOGIN_STARTED, { method: "google" })

    try {
      // Store last used method before redirect
      localStorage.setItem(LAST_AUTH_METHOD_KEY, "google")
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      })
      if (error) throw error
      // Note: completion tracking happens in callback after redirect
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      trackEvent("login_failed", { method: "google", error: error instanceof Error ? error.message : "unknown" })
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full bg-background">
      {/* Left Panel - Value Proposition (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-forest-50 via-background to-peach-50 dark:from-forest-950 dark:via-background dark:to-peach-950 p-8 lg:p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-peach-200 dark:bg-peach-800 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-forest-200 dark:bg-forest-800 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-16">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-500">
              <Icon icon={KnightShieldIcon} size={20} color="white" />
            </div>
            <span className="text-xl font-bold tracking-tight">NoReply</span>
          </Link>

          {/* Main headline */}
          <div className="max-w-lg">
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-foreground mb-4 font-hero">
              Welcome back.
              <br />
              <span className="text-forest-500">Ready to fight back?</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your cases and complaint history are waiting for you.
            </p>

            {/* Benefits list */}
            <ul className="space-y-3 mb-10">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 rounded-full bg-forest-100 dark:bg-forest-900 flex items-center justify-center flex-shrink-0">
                    <Icon icon={Tick02Icon} size={12} className="text-forest-600 dark:text-forest-400" />
                  </div>
                  <span className="text-sm text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4 max-w-md">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/60 dark:bg-card/60 backdrop-blur-sm border border-forest-100 dark:border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-forest-600 dark:text-forest-400">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          
          {/* Trust indicators */}
          <div className="flex items-center gap-4 mt-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Icon icon={ShieldKeyIcon} size={14} className="text-forest-500" />
              <span>Secure login</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon icon={CheckmarkCircle02Icon} size={14} className="text-forest-500" />
              <span>Your data is protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            {/* Mobile Logo (hidden on desktop) */}
            <div className="flex justify-center lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-500">
                  <Icon icon={KnightShieldIcon} size={20} color="white" />
                </div>
                <span className="text-xl font-bold tracking-tight">NoReply</span>
              </Link>
            </div>

            <Card className="border-border shadow-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">Sign in</CardTitle>
                <CardDescription>Access your cases and history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google Sign In - First for fastest conversion */}
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 text-base"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isGoogleLoading ? (
                      "Connecting..."
                    ) : (
                      <>
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
                  </Button>
                  {lastAuthMethod === "google" && (
                    <Badge variant="secondary" className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 bg-forest-100 text-forest-700 border-0">
                      Last used
                    </Badge>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or with email</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm">Password</Label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-muted-foreground hover:text-peach-500 underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <div className="relative pt-2">
                    <Button type="submit" variant="coral" className="w-full h-11 text-base" disabled={isLoading || isGoogleLoading}>
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                    {lastAuthMethod === "email" && (
                      <Badge variant="secondary" className="absolute -top-0 -right-2 text-[10px] px-1.5 py-0.5 bg-forest-100 text-forest-700 border-0">
                        Last used
                      </Badge>
                    )}
                  </div>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/sign-up" className="text-peach-500 underline underline-offset-4 hover:text-peach-600 font-medium">
                    Sign up free
                  </Link>
                </p>
              </CardContent>
            </Card>

            {/* Trust footer */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Icon icon={ShieldKeyIcon} size={12} className="text-forest-500" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon icon={CheckmarkCircle02Icon} size={12} className="text-forest-500" />
                  <span>Secure</span>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
                  Terms of Service
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-sm text-center">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
