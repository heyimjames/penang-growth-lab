import Link from "next/link"
import { Icon } from "@/lib/icons"
import { ArrowRightIcon } from "@hugeicons-pro/core-stroke-rounded"

interface AnnouncementPillProps {
  label?: string
  message: string
  href?: string
}

export function AnnouncementPill({
  label = "NEW",
  message,
  href
}: AnnouncementPillProps) {
  const content = (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-50 border border-forest-100 text-sm text-forest-600 transition-colors hover:bg-forest-100">
      <span className="font-medium text-peach-500">{label}</span>
      <span>{message}</span>
      {href && <Icon icon={ArrowRightIcon} size={12} />}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
