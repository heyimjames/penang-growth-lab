import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icon } from "@/lib/icons"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { AlertCircleIcon } from "@hugeicons-pro/core-stroke-rounded"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams
  const errorMessage = params?.message || params?.error

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
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <Icon icon={AlertCircleIcon} size={24} color="currentColor" className="text-destructive" />
              </div>
              <CardTitle className="text-2xl">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-6">
                {errorMessage || "An unexpected error occurred during authentication."}
              </p>
              {errorMessage?.toLowerCase().includes("expired") && (
                <p className="text-sm text-muted-foreground mb-6">
                  Email confirmation links expire after a short time. Please sign up again to receive a new link.
                </p>
              )}
              <div className="flex flex-col gap-2">
                <Button asChild variant="coral" className="w-full">
                  <Link href="/auth/sign-up">Sign up again</Link>
                </Button>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/">Go home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
