import { cn } from "@/lib/utils"

interface CompensationDisplayProps {
  original: number
  recommended: number
  minimum: number
  currency?: string
  className?: string
}

export function CompensationDisplay({
  original,
  recommended,
  minimum,
  currency = "£",
  className,
}: CompensationDisplayProps) {
  return (
    <div className={cn("bg-muted/50 rounded-lg p-4 space-y-3", className)}>
      <h4 className="font-semibold flex items-center gap-2">
        <span className="text-xl">💰</span>
        Compensation Analysis
      </h4>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Original</p>
          <p className="text-lg font-mono font-bold">
            {currency}
            {original.toFixed(2)}
          </p>
        </div>
        <div className="border-x border-border">
          <p className="text-sm text-muted-foreground">Recommended</p>
          <p className="text-lg font-mono font-bold text-success">
            {currency}
            {recommended.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Minimum</p>
          <p className="text-lg font-mono font-bold text-muted-foreground">
            {currency}
            {minimum.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
