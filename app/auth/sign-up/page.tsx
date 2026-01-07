"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { Icon } from "@/lib/icons"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { CheckmarkCircle02Icon, ShieldKeyIcon, Tick02Icon } from "@hugeicons-pro/core-stroke-rounded"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

const LAST_AUTH_METHOD_KEY = "noreply_last_auth_method"

type AuthMethod = "email" | "google"

const benefits = [
  "AI-powered complaint letters that get results",
  "Reference UK consumer law automatically",
  "Track your cases and deadlines",
]

const testimonial = {
  quote: "Got a full refund from a company that ignored me for months.",
  author: "Sarah M.",
  role: "Recovered £340"
}

function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [lastAuthMethod, setLastAuthMethod] = useState<AuthMethod | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  useEffect(() => {
    const stored = localStorage.getItem(LAST_AUTH_METHOD_KEY) as AuthMethod | null
    if (stored === "email" || stored === "google") {
      setLastAuthMethod(stored)
    }
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    trackEvent(AnalyticsEvents.AUTH.SIGNUP_STARTED, { method: "email" })

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const callbackUrl = redirect
      ? `${baseUrl}/auth/callback?next=${encodeURIComponent(redirect)}`
      : `${baseUrl}/auth/callback`

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl,
          data: {
            full_name: fullName,
          }
        },
      })
      if (authError) throw authError

      if (authData.user) {
        await supabase
          .from("profiles")
          .update({ full_name: fullName || null })
          .eq("user_id", authData.user.id)
      }

      localStorage.setItem(LAST_AUTH_METHOD_KEY, "email")
      trackEvent(AnalyticsEvents.AUTH.SIGNUP_COMPLETED, { method: "email" })
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      trackEvent("signup_failed", { method: "email", error: error instanceof Error ? error.message : "unknown" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    const supabase = createClient()
    setIsGoogleLoading(true)
    setError(null)

    trackEvent(AnalyticsEvents.AUTH.SIGNUP_STARTED, { method: "google" })

    const nextUrl = redirect || "/dashboard"

    try {
      localStorage.setItem(LAST_AUTH_METHOD_KEY, "google")
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
        },
      })
      if (error) throw error
      // Note: completion tracking happens in callback after redirect
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      trackEvent("signup_failed", { method: "google", error: error instanceof Error ? error.message : "unknown" })
      setIsGoogleLoading(false)
    }
  }

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { strength: 0, label: "" }
    let strength = 0
    if (pass.length >= 6) strength++
    if (pass.length >= 8) strength++
    if (/[A-Z]/.test(pass)) strength++
    if (/[0-9]/.test(pass)) strength++
    if (/[^A-Za-z0-9]/.test(pass)) strength++
    
    if (strength <= 2) return { strength: 1, label: "Weak" }
    if (strength <= 3) return { strength: 2, label: "Fair" }
    return { strength: 3, label: "Strong" }
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <div className="flex min-h-svh w-full bg-background">
      {/* Left Panel - Value Proposition (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-forest-50 via-background to-lavender-50 dark:from-forest-950 dark:via-background dark:to-lavender-950 p-8 lg:p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-forest-200 dark:bg-forest-800 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-lavender-200 dark:bg-lavender-800 rounded-full blur-3xl" />
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
              Stop being ignored.
              <br />
              <span className="text-forest-500">Get what you&apos;re owed.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands who&apos;ve recovered money with AI-powered complaint letters.
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

        {/* Testimonial */}
        <div className="relative z-10">
          <div className="bg-white/60 dark:bg-card/60 backdrop-blur-sm border border-forest-100 dark:border-border rounded-xl p-4 max-w-md">
            <p className="text-sm text-foreground mb-3 italic">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-peach-400 to-peach-500 flex items-center justify-center text-white text-sm font-semibold">
                {testimonial.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
                <p className="text-xs text-forest-600 dark:text-forest-400">{testimonial.role}</p>
              </div>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="flex items-center gap-4 mt-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Icon icon={ShieldKeyIcon} size={14} className="text-forest-500" />
              <span>Data encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon icon={CheckmarkCircle02Icon} size={14} className="text-forest-500" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
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
              <CardContent className="pt-6 pb-6 px-6 space-y-4">
                {/* Header */}
                <div className="text-center pb-2">
                  <h2 className="text-2xl font-semibold">Create your account</h2>
                  <p className="text-sm text-muted-foreground mt-1">Start your first complaint in minutes</p>
                </div>

                {/* Google Sign Up - First for fastest conversion */}
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 text-base"
                    onClick={handleGoogleSignUp}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isGoogleLoading ? (
                      "Connecting..."
                    ) : (
                      <>
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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

                <form onSubmit={handleSignUp} className="space-y-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Smith"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-10"
                    />
                  </div>
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
                      <span className="text-xs text-muted-foreground">6+ characters</span>
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
                    {/* Password strength indicator */}
                    {password && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-1">
                          <div className={`h-1.5 w-8 rounded-full transition-colors ${passwordStrength.strength >= 1 ? (passwordStrength.strength === 1 ? 'bg-red-400' : passwordStrength.strength === 2 ? 'bg-yellow-400' : 'bg-green-400') : 'bg-muted'}`} />
                          <div className={`h-1.5 w-8 rounded-full transition-colors ${passwordStrength.strength >= 2 ? (passwordStrength.strength === 2 ? 'bg-yellow-400' : 'bg-green-400') : 'bg-muted'}`} />
                          <div className={`h-1.5 w-8 rounded-full transition-colors ${passwordStrength.strength >= 3 ? 'bg-green-400' : 'bg-muted'}`} />
                        </div>
                        <span className={`text-xs ${passwordStrength.strength === 1 ? 'text-red-500' : passwordStrength.strength === 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="confirm-password" className="text-sm">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-10"
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">Passwords don&apos;t match</p>
                    )}
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}
                  
                  <div className="relative pt-2">
                    <Button type="submit" variant="coral" className="w-full h-11 text-base" disabled={isLoading || isGoogleLoading}>
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                    {lastAuthMethod === "email" && (
                      <Badge variant="secondary" className="absolute -top-0 -right-2 text-[10px] px-1.5 py-0.5 bg-forest-100 text-forest-700 border-0">
                        Last used
                      </Badge>
                    )}
                  </div>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-peach-500 underline underline-offset-4 hover:text-peach-600 font-medium">
                    Sign in
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
                  <span>Free to start</span>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                By signing up, you agree to our{" "}
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

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="flex h-svh w-full items-center justify-center bg-background">
        <div className="text-center text-sm text-muted-foreground">Loading...</div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  )
}
