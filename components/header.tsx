"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icons"
import { Menu01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { cn } from "@/lib/utils"
import { ToolsMegaMenu, MobileToolsMenu } from "@/components/tools-mega-menu"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-forest-100 dark:border-border bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Icon icon={KnightShieldIcon} size={24} className="text-peach-500" />
          <span className="text-xl font-bold tracking-tight text-foreground font-display">NoReply</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Free Tools Mega Menu */}
          <ToolsMegaMenu />

          {/* Glossary Link */}
          <Link
            href="/glossary"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground",
              pathname === "/glossary" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Glossary
          </Link>

          {/* Blog Link */}
          <Link
            href="/blog"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground",
              pathname?.startsWith("/blog") ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Blog
          </Link>

          {/* FAQs Link */}
          <Link
            href="/faq"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground",
              pathname === "/faq" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            FAQs
          </Link>

          {/* Pricing Link */}
          <Link
            href="/pricing"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground",
              pathname === "/pricing" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Pricing
          </Link>

          {/* About Link */}
          <Link
            href="/for-you"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground",
              pathname === "/for-you" || pathname === "/about" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            About
          </Link>

          {/* Roadmap Link */}
          <Link
            href="/roadmap"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground",
              pathname === "/roadmap" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Roadmap
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button size="sm" asChild variant="coral">
            <Link href="/new">Fight Back</Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden">
          <MobileToolsMenu />
        </div>
      </div>
    </header>
  )
}
