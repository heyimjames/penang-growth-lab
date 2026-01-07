"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { Icon } from "@/lib/icons"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { ArrowLeft01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { resetPassword } from "@/lib/actions/auth"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await resetPassword(email)
      if (result.error) {
        setError(result.error)
      } else {
        setIsSuccess(true)
        trackEvent(AnalyticsEvents.AUTH.PASSWORD_RESET_REQUESTED, { success: true })
      }
    } catch {
      setError("An unexpected error occurred")
      trackEvent(AnalyticsEvents.AUTH.PASSWORD_RESET_REQUESTED, { success: false })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <div className="flex justify-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-500">
                  <Icon icon={KnightShieldIcon} size={20} color="white" />
                </div>
                <span className="text-xl font-bold tracking-tight">NoReply</span>
              </Link>
            </div>

            <Card className="border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Check your email</CardTitle>
                <CardDescription>
                  We&apos;ve sent a password reset link to <strong>{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Click the link in the email to reset your password. If you don&apos;t see it, check your spam folder.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/login">
                    <Icon icon={ArrowLeft01Icon} size={16} className="mr-2" />
                    Back to sign in
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-500">
                <Icon icon={KnightShieldIcon} size={20} color="white" />
              </div>
              <span className="text-xl font-bold tracking-tight">NoReply</span>
            </Link>
          </div>

          <Card className="border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Reset your password</CardTitle>
              <CardDescription>Enter your email and we&apos;ll send you a reset link</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" variant="coral" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send reset link"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Remember your password?{" "}
                  <Link href="/auth/login" className="text-peach-500 underline underline-offset-4 hover:text-peach-600">
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
