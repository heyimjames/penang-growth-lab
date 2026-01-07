"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserAvatar } from "@/components/user-avatar"
import { Icon } from "@/lib/icons"
import {
  Search01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Mail01Icon,
  CreditCardIcon,
  FolderOpenIcon,
  Delete02Icon,
  PlusSignIcon,
  Loading03Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  LinkSquare01Icon,
  Alert02Icon,
  Wifi01Icon,
  FileAttachmentIcon,
  Edit02Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { toast } from "sonner"
import {
  getAdminUsers,
  getAdminUserDetails,
  adminAddCredits,
  adminSendPasswordReset,
  adminDeleteUser,
  adminBanUser,
  adminUnbanUser,
  adminBlockIp,
  adminUnblockIp,
  analyzeUserForSpam,
  getAdminUserPayments,
  type AdminUser,
  type UserTransaction,
  type UserCase,
} from "@/lib/actions/admin"
import { formatDistanceToNow, format } from "date-fns"

type SortField = "createdAt" | "email" | "credits" | "totalCases" | "lastSignIn" | "status" | "provider"
type SortDirection = "asc" | "desc"

export function UsersManagement() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Selected user state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [userTransactions, setUserTransactions] = useState<UserTransaction[]>([])
  const [userCases, setUserCases] = useState<UserCase[]>([])
  const [userPayments, setUserPayments] = useState<Array<{
    id: string
    amount: number
    currency: string
    status: string
    createdAt: string
    description: string | null
  }>>([])
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Action states
  const [addCreditsAmount, setAddCreditsAmount] = useState("")
  const [addCreditsReason, setAddCreditsReason] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Load users
  useEffect(() => {
    async function loadUsers() {
      setLoading(true)
      try {
        const data = await getAdminUsers()
        setUsers(data)
      } catch (error) {
        console.error("Error loading users:", error)
        toast.error("Failed to load users")
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  // Load selected user details
  useEffect(() => {
    async function loadUserDetails() {
      if (!selectedUserId) {
        setSelectedUser(null)
        return
      }

      setLoadingDetails(true)
      try {
        const result = await getAdminUserDetails(selectedUserId)
        console.log("getAdminUserDetails result:", result)
        const { user, transactions, cases } = result
        setSelectedUser(user)
        setUserTransactions(transactions)
        setUserCases(cases)

        // Load payments if user has stripe customer id
        if (user?.stripeCustomerId) {
          const { payments } = await getAdminUserPayments(user.stripeCustomerId)
          setUserPayments(payments)
        } else {
          setUserPayments([])
        }
      } catch (error) {
        console.error("Error loading user details:", error)
        toast.error("Failed to load user details")
      } finally {
        setLoadingDetails(false)
      }
    }
    loadUserDetails()
  }, [selectedUserId])

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = [...users]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        user =>
          user.email.toLowerCase().includes(query) ||
          user.fullName?.toLowerCase().includes(query) ||
          user.city?.toLowerCase().includes(query) ||
          user.country?.toLowerCase().includes(query)
      )
    }

    // Sort
    result.sort((a, b) => {
      let aVal: string | number | null = null
      let bVal: string | number | null = null

      switch (sortField) {
        case "email":
          aVal = a.email
          bVal = b.email
          break
        case "credits":
          aVal = a.credits
          bVal = b.credits
          break
        case "totalCases":
          aVal = a.totalCases
          bVal = b.totalCases
          break
        case "lastSignIn":
          aVal = a.lastSignIn || ""
          bVal = b.lastSignIn || ""
          break
        case "status":
          // Sort by: banned (2) > ip blocked (1) > active (0)
          aVal = a.isBanned ? 2 : a.isIpBlocked ? 1 : 0
          bVal = b.isBanned ? 2 : b.isIpBlocked ? 1 : 0
          break
        case "provider":
          aVal = a.provider || "email"
          bVal = b.provider || "email"
          break
        case "createdAt":
        default:
          aVal = a.createdAt
          bVal = b.createdAt
          break
      }

      if (aVal === null || aVal === "") return 1
      if (bVal === null || bVal === "") return -1

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      }

      const comparison = String(aVal).localeCompare(String(bVal))
      return sortDirection === "asc" ? comparison : -comparison
    })

    return result
  }, [users, searchQuery, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleAddCredits = async () => {
    if (!selectedUserId || !addCreditsAmount) return

    setActionLoading("addCredits")
    try {
      const result = await adminAddCredits(
        selectedUserId,
        parseInt(addCreditsAmount),
        addCreditsReason || "Admin adjustment"
      )

      if (result.success) {
        toast.success(`Added ${addCreditsAmount} credits. New balance: ${result.newBalance}`)
        setAddCreditsAmount("")
        setAddCreditsReason("")

        // Refresh user data
        const { user, transactions } = await getAdminUserDetails(selectedUserId)
        setSelectedUser(user)
        setUserTransactions(transactions)

        // Update in list
        setUsers(prev =>
          prev.map(u =>
            u.id === selectedUserId ? { ...u, credits: result.newBalance || u.credits } : u
          )
        )
      } else {
        toast.error(result.error || "Failed to add credits")
      }
    } catch (error) {
      toast.error("Failed to add credits")
    } finally {
      setActionLoading(null)
    }
  }

  const handleSendPasswordReset = async () => {
    if (!selectedUser?.email) return

    setActionLoading("passwordReset")
    try {
      const result = await adminSendPasswordReset(selectedUser.email)

      if (result.success) {
        toast.success(`Password reset email sent to ${selectedUser.email}`)
      } else {
        toast.error(result.error || "Failed to send password reset")
      }
    } catch (error) {
      toast.error("Failed to send password reset")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUserId) return

    setActionLoading("delete")
    try {
      const result = await adminDeleteUser(selectedUserId)

      if (result.success) {
        toast.success("User deleted successfully")
        setDeleteDialogOpen(false)
        setSelectedUserId(null)
        setUsers(prev => prev.filter(u => u.id !== selectedUserId))
      } else {
        toast.error(result.error || "Failed to delete user")
      }
    } catch (error) {
      toast.error("Failed to delete user")
    } finally {
      setActionLoading(null)
    }
  }

  const handleBanUser = async (userId: string, currentlyBanned: boolean) => {
    setActionLoading(`ban-${userId}`)
    try {
      const result = currentlyBanned
        ? await adminUnbanUser(userId)
        : await adminBanUser(userId)

      if (result.success) {
        toast.success(currentlyBanned ? "User unbanned successfully" : "User banned successfully")
        // Update user in list
        setUsers(prev =>
          prev.map(u =>
            u.id === userId ? { ...u, isBanned: !currentlyBanned } : u
          )
        )
        // Update selected user if it's the same
        if (selectedUser?.id === userId) {
          setSelectedUser(prev => prev ? { ...prev, isBanned: !currentlyBanned } : null)
        }
      } else {
        toast.error(result.error || `Failed to ${currentlyBanned ? "unban" : "ban"} user`)
      }
    } catch (error) {
      toast.error(`Failed to ${currentlyBanned ? "unban" : "ban"} user`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBlockIp = async (userId: string, ip: string, currentlyBlocked: boolean) => {
    setActionLoading(`ip-${userId}`)
    try {
      const result = currentlyBlocked
        ? await adminUnblockIp(ip)
        : await adminBlockIp(ip, userId)

      if (result.success) {
        toast.success(currentlyBlocked ? "IP unblocked successfully" : "IP blocked successfully")
        // Update user in list
        setUsers(prev =>
          prev.map(u =>
            u.id === userId ? { ...u, isIpBlocked: !currentlyBlocked } : u
          )
        )
        // Update selected user if it's the same
        if (selectedUser?.id === userId) {
          setSelectedUser(prev => prev ? { ...prev, isIpBlocked: !currentlyBlocked } : null)
        }
      } else {
        toast.error(result.error || `Failed to ${currentlyBlocked ? "unblock" : "block"} IP`)
      }
    } catch (error) {
      toast.error(`Failed to ${currentlyBlocked ? "unblock" : "block"} IP`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleAnalyzeSpam = async (userId: string) => {
    setActionLoading(`spam-${userId}`)
    try {
      const result = await analyzeUserForSpam(userId)

      if (result.success) {
        toast.success(result.reasoning || "Analysis complete")
        // Refresh user data
        const { user } = await getAdminUserDetails(userId)
        setSelectedUser(user)
        // Update in list
        setUsers(prev =>
          prev.map(u =>
            u.id === userId ? { ...u, spamScore: result.spamScore || 0, spamFlags: result.flags || [] } : u
          )
        )
      } else {
        toast.error(result.error || "Failed to analyze user")
      }
    } catch (error) {
      toast.error("Failed to analyze user")
    } finally {
      setActionLoading(null)
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return (
      <Icon
        icon={sortDirection === "asc" ? ArrowUp01Icon : ArrowDown01Icon}
        size={14}
        className="ml-1"
      />
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "analyzed":
      case "ready":
        return "bg-forest-100 text-forest-700"
      case "analyzing":
        return "bg-amber-100 text-amber-700"
      case "draft":
        return "bg-stone-100 text-stone-600"
      case "sent":
      case "resolved":
        return "bg-lavender-100 text-lavender-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 flex-1 max-w-sm" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">User</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead className="w-[80px]">Provider</TableHead>
                <TableHead className="w-[80px] text-right">Credits</TableHead>
                <TableHead className="w-[70px] text-right">Cases</TableHead>
                <TableHead className="w-[110px]">Joined</TableHead>
                <TableHead className="w-[110px]">Last Active</TableHead>
                <TableHead className="w-[90px] pr-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(8)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-8 rounded-full shrink-0" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-36" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-14" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-8 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-6 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="pr-4">
                    <Skeleton className="h-7 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Icon
              icon={Search01Icon}
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search by email, name, or location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={sortField}
            onValueChange={(v: SortField) => setSortField(v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Sign up date</SelectItem>
              <SelectItem value="lastSignIn">Last active</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="credits">Credits</SelectItem>
              <SelectItem value="totalCases">Cases</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSortDirection(d => (d === "asc" ? "desc" : "asc"))}
          >
            <Icon
              icon={sortDirection === "asc" ? ArrowUp01Icon : ArrowDown01Icon}
              size={18}
            />
          </Button>
          <Badge variant="outline" className="shrink-0">
            {filteredUsers.length} users
          </Badge>
        </div>

        {/* Users table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">
                  <button
                    onClick={() => handleSort("email")}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    User
                    <SortIcon field="email" />
                  </button>
                </TableHead>
                <TableHead className="w-[80px]">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Status
                    <SortIcon field="status" />
                  </button>
                </TableHead>
                <TableHead className="w-[80px]">
                  <button
                    onClick={() => handleSort("provider")}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Provider
                    <SortIcon field="provider" />
                  </button>
                </TableHead>
                <TableHead className="w-[80px] text-right">
                  <button
                    onClick={() => handleSort("credits")}
                    className="flex items-center justify-end hover:text-foreground transition-colors w-full"
                  >
                    Credits
                    <SortIcon field="credits" />
                  </button>
                </TableHead>
                <TableHead className="w-[70px] text-right">
                  <button
                    onClick={() => handleSort("totalCases")}
                    className="flex items-center justify-end hover:text-foreground transition-colors w-full"
                  >
                    Cases
                    <SortIcon field="totalCases" />
                  </button>
                </TableHead>
                <TableHead className="w-[110px]">
                  <button
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Joined
                    <SortIcon field="createdAt" />
                  </button>
                </TableHead>
                <TableHead className="w-[110px]">
                  <button
                    onClick={() => handleSort("lastSignIn")}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Last Active
                    <SortIcon field="lastSignIn" />
                  </button>
                </TableHead>
                <TableHead className="w-[90px] pr-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    {searchQuery ? "No users match your search" : "No users found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={`
                      ${user.isBanned ? "bg-destructive/5" : index % 2 === 0 ? "bg-background" : "bg-muted/30"}
                      cursor-pointer hover:bg-muted/50 transition-colors
                    `}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={user.fullName}
                          email={user.email}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium truncate text-sm">
                              {user.fullName || user.email.split("@")[0]}
                            </p>
                            {user.spamScore >= 50 && (
                              <Icon icon={Alert02Icon} size={12} className="text-amber-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.isBanned ? (
                        <Badge variant="destructive" className="text-[10px] px-1.5">Banned</Badge>
                      ) : user.isIpBlocked ? (
                        <Badge variant="secondary" className="text-[10px] px-1.5 bg-amber-100 text-amber-700">IP Blocked</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] px-1.5 bg-emerald-100 text-emerald-700">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground capitalize">
                        {user.provider || "email"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`text-sm ${user.credits > 0 ? "text-forest-600 font-medium" : "text-muted-foreground"}`}>
                        {user.credits}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm">{user.totalCases}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {user.lastSignIn
                        ? formatDistanceToNow(new Date(user.lastSignIn), { addSuffix: true })
                        : "Never"
                      }
                    </TableCell>
                    <TableCell className="pr-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-3 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedUserId(user.id)
                        }}
                      >
                        Overview
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* User details sheet */}
      <Sheet open={!!selectedUserId} onOpenChange={open => !open && setSelectedUserId(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-4">
          <VisuallyHidden>
            <SheetTitle>User Details</SheetTitle>
          </VisuallyHidden>
          {loadingDetails ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : !selectedUser ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon icon={Alert02Icon} size={40} className="text-muted-foreground mb-4" />
              <h3 className="font-medium mb-1">Unable to load user</h3>
              <p className="text-sm text-muted-foreground mb-4">User details could not be retrieved</p>
              <Button variant="outline" size="sm" onClick={() => setSelectedUserId(null)}>
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={selectedUser.fullName}
                  email={selectedUser.email}
                  size="lg"
                  className="ring-1 ring-foreground/12"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold truncate">
                      {selectedUser.fullName || selectedUser.email.split("@")[0]}
                    </h3>
                    {selectedUser.isBanned && (
                      <Badge variant="destructive" className="text-[10px] px-1.5">Banned</Badge>
                    )}
                    {selectedUser.isIpBlocked && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 bg-amber-100 text-amber-700">IP Blocked</Badge>
                    )}
                    {selectedUser.spamScore >= 50 && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 bg-coral-100 text-coral-700">
                        Spam Risk: {selectedUser.spamScore}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {selectedUser.email}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <Badge variant={selectedUser.credits > 0 ? "default" : "secondary"} className="text-xs">
                      {selectedUser.credits} credits
                    </Badge>
                    <Badge variant="outline" className="text-xs">{selectedUser.totalCases} cases</Badge>
                    <Badge variant="outline" className="text-xs capitalize">{selectedUser.provider || "email"}</Badge>
                  </div>
                </div>
              </div>

              {/* Quick info grid */}
              <div className="grid grid-cols-2 gap-2 text-sm bg-muted/50 rounded-lg p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="font-medium">{format(new Date(selectedUser.createdAt), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Active</p>
                  <p className="font-medium">
                    {selectedUser.lastSignIn
                      ? formatDistanceToNow(new Date(selectedUser.lastSignIn), { addSuffix: true })
                      : "Never"
                    }
                  </p>
                </div>
                {(selectedUser.city || selectedUser.country) && (
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{[selectedUser.city, selectedUser.country].filter(Boolean).join(", ")}</p>
                  </div>
                )}
                {selectedUser.lastIp && (
                  <div>
                    <p className="text-xs text-muted-foreground">Last IP</p>
                    <p className="font-medium font-mono text-xs">{selectedUser.lastIp}</p>
                  </div>
                )}
              </div>

              {/* Spam flags */}
              {selectedUser.spamFlags && selectedUser.spamFlags.length > 0 && (
                <div className="bg-coral-50 border border-coral-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon={Alert02Icon} size={14} className="text-coral-600" />
                    <span className="text-xs font-medium text-coral-700">Spam Flags Detected</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedUser.spamFlags.map(flag => (
                      <Badge key={flag} variant="outline" className="text-[10px] bg-white">
                        {flag.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Stripe link */}
              {selectedUser.stripeCustomerId && (
                <a
                  href={`https://dashboard.stripe.com/customers/${selectedUser.stripeCustomerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-acrylic hover:underline"
                >
                  <Icon icon={CreditCardIcon} size={14} />
                  View in Stripe
                  <Icon icon={LinkSquare01Icon} size={12} />
                </a>
              )}

              <Separator />

              {/* Cases section - enhanced */}
              {userCases.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Cases ({userCases.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {userCases.map(c => (
                      <a
                        key={c.id}
                        href={`/cases/${c.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2.5 bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm truncate">
                                {c.companyName || "Unnamed case"}
                              </span>
                              <Badge className={`text-[10px] px-1.5 py-0 ${getStatusColor(c.status)}`}>
                                {c.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span>{format(new Date(c.createdAt), "MMM d, yyyy")}</span>
                              {c.amount && (
                                <span>{c.currency} {c.amount.toLocaleString()}</span>
                              )}
                              {c.confidenceScore !== null && (
                                <span className={c.confidenceScore >= 70 ? "text-forest-600" : c.confidenceScore >= 40 ? "text-amber-600" : "text-coral-600"}>
                                  {c.confidenceScore}% confidence
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Icon icon={FileAttachmentIcon} size={10} />
                                {c.evidenceCount} evidence
                              </span>
                              {c.hasLetter && (
                                <span className="flex items-center gap-1 text-forest-600">
                                  <Icon icon={Edit02Icon} size={10} />
                                  Letter generated
                                </span>
                              )}
                            </div>
                          </div>
                          <Icon icon={ArrowRight01Icon} size={14} className="text-muted-foreground shrink-0 mt-1" />
                        </div>
                      </a>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </div>
              )}

              {/* Add credits */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Add Credits
                </h4>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={addCreditsAmount}
                    onChange={e => setAddCreditsAmount(e.target.value)}
                    className="w-20 h-9"
                    min="1"
                  />
                  <Input
                    placeholder="Reason (optional)"
                    value={addCreditsReason}
                    onChange={e => setAddCreditsReason(e.target.value)}
                    className="flex-1 h-9"
                  />
                  <Button
                    onClick={handleAddCredits}
                    disabled={!addCreditsAmount || actionLoading === "addCredits"}
                    size="sm"
                    className="h-9 w-9 p-0"
                  >
                    {actionLoading === "addCredits" ? (
                      <Icon icon={Loading03Icon} size={14} className="animate-spin" />
                    ) : (
                      <Icon icon={PlusSignIcon} size={14} />
                    )}
                  </Button>
                </div>
              </div>

              {/* Credit History */}
              {userTransactions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Credit History
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {userTransactions.slice(0, 5).map(tx => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between text-sm py-1"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon
                            icon={tx.amount > 0 ? CheckmarkCircle02Icon : Cancel01Icon}
                            size={12}
                            className={tx.amount > 0 ? "text-forest-500 shrink-0" : "text-muted-foreground shrink-0"}
                          />
                          <span className="truncate text-xs">
                            {tx.description || tx.type.replace(/_/g, " ")}
                          </span>
                        </div>
                        <span className={`text-xs shrink-0 ${tx.amount > 0 ? "text-forest-600 font-medium" : "text-muted-foreground"}`}>
                          {tx.amount > 0 ? "+" : ""}{tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments */}
              {userPayments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Payments
                  </h4>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {userPayments.slice(0, 3).map(payment => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between text-xs py-1"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={payment.status === "succeeded" ? "default" : "secondary"}
                            className="text-[10px] px-1.5 py-0"
                          >
                            {payment.status}
                          </Badge>
                          <span className="text-muted-foreground">
                            {format(new Date(payment.createdAt), "MMM d")}
                          </span>
                        </div>
                        <span className="font-medium">
                          {payment.currency} {payment.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Actions
                </h4>

                {/* First row: Password Reset + Spam Analysis */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendPasswordReset}
                    disabled={actionLoading === "passwordReset"}
                    className="flex-1 h-8 text-xs"
                  >
                    {actionLoading === "passwordReset" ? (
                      <Icon icon={Loading03Icon} size={12} className="mr-1 animate-spin" />
                    ) : (
                      <Icon icon={Mail01Icon} size={12} className="mr-1" />
                    )}
                    Password Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAnalyzeSpam(selectedUser.id)}
                    disabled={actionLoading === `spam-${selectedUser.id}`}
                    className="flex-1 h-8 text-xs"
                  >
                    {actionLoading === `spam-${selectedUser.id}` ? (
                      <Icon icon={Loading03Icon} size={12} className="mr-1 animate-spin" />
                    ) : (
                      <Icon icon={Alert02Icon} size={12} className="mr-1" />
                    )}
                    Analyze for Spam
                  </Button>
                </div>

                {/* Second row: Ban User + Block IP */}
                <div className="flex gap-2">
                  <Button
                    variant={selectedUser.isBanned ? "outline" : "secondary"}
                    size="sm"
                    onClick={() => handleBanUser(selectedUser.id, selectedUser.isBanned)}
                    disabled={actionLoading === `ban-${selectedUser.id}`}
                    className="flex-1 h-8 text-xs"
                  >
                    {actionLoading === `ban-${selectedUser.id}` ? (
                      <Icon icon={Loading03Icon} size={12} className="mr-1 animate-spin" />
                    ) : selectedUser.isBanned ? (
                      <>
                        <Icon icon={CheckmarkCircle02Icon} size={12} className="mr-1" />
                        Unban User
                      </>
                    ) : (
                      <>
                        <Icon icon={Cancel01Icon} size={12} className="mr-1" />
                        Ban User
                      </>
                    )}
                  </Button>
                  {selectedUser.lastIp && (
                    <Button
                      variant={selectedUser.isIpBlocked ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => handleBlockIp(selectedUser.id, selectedUser.lastIp!, selectedUser.isIpBlocked)}
                      disabled={actionLoading === `ip-${selectedUser.id}`}
                      className="flex-1 h-8 text-xs"
                    >
                      {actionLoading === `ip-${selectedUser.id}` ? (
                        <Icon icon={Loading03Icon} size={12} className="mr-1 animate-spin" />
                      ) : selectedUser.isIpBlocked ? (
                        <>
                          <Icon icon={Wifi01Icon} size={12} className="mr-1" />
                          Unblock IP
                        </>
                      ) : (
                        <>
                          <Icon icon={Wifi01Icon} size={12} className="mr-1" />
                          Block IP
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Delete button */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="w-full h-8 text-xs"
                >
                  <Icon icon={Delete02Icon} size={12} className="mr-1" />
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for{" "}
              <strong>{selectedUser?.email}</strong>, including all their cases,
              evidence, credits, and transaction history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={actionLoading === "delete"}
            >
              {actionLoading === "delete" ? (
                <>
                  <Icon icon={Loading03Icon} size={14} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Icon icon={Delete02Icon} size={14} className="mr-2" />
                  Delete Account
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
