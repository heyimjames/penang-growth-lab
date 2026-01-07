import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icon } from "@/lib/icons"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { MailIcon } from "@hugeicons-pro/core-stroke-rounded"

export default function SignUpSuccessPage() {
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
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-lavender-100">
                <Icon icon={MailIcon} size={24} color="currentColor" className="text-lavender-600" />
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>We&apos;ve sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-6">
                Click the link in your email to verify your account and start building your first case. The link will
                expire in 24 hours.
              </p>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/auth/login">Back to sign in</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
