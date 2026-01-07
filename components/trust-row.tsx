import { Icon } from "@/lib/icons"
import { JusticeScale01Icon, LockIcon, CheckmarkCircle01Icon } from "@hugeicons-pro/core-stroke-rounded"

const trustItems = [
  {
    icon: JusticeScale01Icon,
    text: "UK Consumer Law",
  },
  {
    icon: LockIcon,
    text: "Data encrypted",
  },
  {
    icon: CheckmarkCircle01Icon,
    text: "No legal expertise needed",
  },
]

export function TrustRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 py-8 border-b border-forest-100">
      {trustItems.map((item) => (
        <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon icon={item.icon} size={16} color="currentColor" className="text-forest-400" />
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  )
}
