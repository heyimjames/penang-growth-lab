"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icon } from "@/lib/icons"
import {
  User02Icon,
  Mail01Icon,
  Logout01Icon,
  Download01Icon,
  Delete01Icon,
  LockPasswordIcon,
  AlertCircleIcon,
} from "@hugeicons-pro/core-stroke-rounded"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { CreditsBillingSection } from "@/components/credits-billing-section"
import { UserAvatar } from "@/components/user-avatar"
import { signOut } from "@/lib/actions/auth"
import { changePassword, exportUserData, deleteUserAccount } from "@/lib/actions/account"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

function AccountPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<{ id: string; email: string | null; created_at: string; fullName: string | null } | null>(null)
  const [loading, setLoading] = useState(true)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isChangingPassword, startPasswordChange] = useTransition()

  // Export state
  const [isExporting, startExport] = useTransition()

  // Delete account state
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeleting, startDelete] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Get profile for full name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single()

      setUser({
        id: user.id,
        email: user.email || null,
        created_at: user.created_at,
        fullName: profile?.full_name || null,
      })
      setLoading(false)

      // Track account page view
      trackEvent(AnalyticsEvents.ACCOUNT.PAGE_VIEWED)
    }

    loadUser()
  }, [router])

  // Handle payment success/cancelled
  useEffect(() => {
    const payment = searchParams.get("payment")
    if (payment === "success") {
      toast.success("Payment successful! Credits have been added to your account.")
      router.replace("/account", { scroll: false })
    } else if (payment === "cancelled") {
      toast.info("Payment was cancelled.")
      router.replace("/account", { scroll: false })
    }
  }, [searchParams, router])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return
    }

    startPasswordChange(async () => {
      const result = await changePassword(currentPassword, newPassword)

      if (result.error) {
        setPasswordError(result.error)
        toast.error(result.error)
      } else {
        trackEvent(AnalyticsEvents.ACCOUNT.PASSWORD_CHANGED)
        toast.success("Password changed successfully")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    })
  }

  const handleExportData = () => {
    startExport(async () => {
      const result = await exportUserData()

      if (result.error) {
        toast.error(result.error)
      } else if (result.data) {
        // Create and download JSON file
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `noreply-data-export-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        trackEvent(AnalyticsEvents.ACCOUNT.DATA_EXPORTED, {
          format: "json",
        })
        toast.success("Your data has been exported")
      }
    })
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "DELETE MY ACCOUNT") {
      toast.error("Please type the confirmation text exactly")
      return
    }

    startDelete(async () => {
      const result = await deleteUserAccount()

      if (result.error) {
        toast.error(result.error)
      } else {
        trackEvent(AnalyticsEvents.ACCOUNT.ACCOUNT_DELETED)
        toast.success("Your account and all data has been deleted")
        router.push("/")
      }
    })
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-8 max-w-3xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-48 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and settings.</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={User02Icon} size={20} />
            Profile Information
          </CardTitle>
          <CardDescription>Your account details and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <UserAvatar name={user.fullName} email={user.email} size="xl" />
            <div>
              <p className="text-lg font-medium">{user.fullName || user.email?.split("@")[0] || "User"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center gap-2">
              <Icon icon={Mail01Icon} size={16} color="currentColor" className="text-muted-foreground" />
              <Input id="email" value={user.email || ""} disabled className="bg-muted" />
            </div>
            <p className="text-xs text-muted-foreground">Your email is managed through your authentication provider.</p>
          </div>

          <div className="space-y-2">
            <Label>Account ID</Label>
            <Input value={user.id} disabled className="bg-muted font-mono text-xs" />
          </div>

          <div className="space-y-2">
            <Label>Member Since</Label>
            <Input
              value={new Date(user.created_at).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              disabled
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      {/* Credits & Billing Section */}
      <CreditsBillingSection />

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={KnightShieldIcon} size={20} />
            Security
          </CardTitle>
          <CardDescription>Manage your security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password Change Form */}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon={LockPasswordIcon} size={18} color="currentColor" className="text-muted-foreground" />
              <Label className="text-base font-medium">Change Password</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <Icon icon={AlertCircleIcon} size={16} />
                {passwordError}
              </div>
            )}

            <Button type="submit" disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}>
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </form>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy Section (GDPR) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={Download01Icon} size={20} />
            Data & Privacy
          </CardTitle>
          <CardDescription>Manage your data in compliance with GDPR.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Export Your Data</p>
              <p className="text-sm text-muted-foreground">Download all your cases, evidence metadata, and messages as JSON.</p>
            </div>
            <Button variant="outline" onClick={handleExportData} disabled={isExporting}>
              <Icon icon={Download01Icon} size={16} className="mr-2" />
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
            </div>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Icon icon={Delete01Icon} size={16} className="mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                  <DialogDescription>
                    This action is permanent and cannot be undone. All your data including cases, evidence, and messages will be permanently deleted.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Icon icon={AlertCircleIcon} size={20} className="text-destructive mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-destructive">Warning</p>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          <li>All your cases will be deleted</li>
                          <li>All uploaded evidence will be removed</li>
                          <li>All chat history will be erased</li>
                          <li>This cannot be reversed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Type "DELETE MY ACCOUNT" to confirm</Label>
                    <Input
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="DELETE MY ACCOUNT"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmation !== "DELETE MY ACCOUNT"}
                  >
                    {isDeleting ? "Deleting..." : "Delete My Account"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out Section */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Icon icon={Logout01Icon} size={20} />
            Sign Out
          </CardTitle>
          <CardDescription>Sign out of your account on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signOut}>
            <Button variant="destructive" type="submit" className="flex items-center">
              <Icon icon={Logout01Icon} size={16} className="mr-2" />
              Sign Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="p-6 lg:p-8 space-y-8 max-w-3xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-48 bg-muted rounded"></div>
        </div>
      </div>
    }>
      <AccountPageContent />
    </Suspense>
  )
}
