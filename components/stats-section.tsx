"use client"

import { useEffect, useRef, useState } from "react"
import { Icon } from "@/lib/icons"
import {
  CheckmarkCircle02Icon,
  Time02Icon,
  MoneyReceiveSquareIcon,
  BookOpen01Icon,
} from "@hugeicons-pro/core-stroke-rounded"

interface StatItem {
  value: number
  suffix: string
  label: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
}

const stats: StatItem[] = [
  {
    value: 89,
    suffix: "%",
    label: "Success Rate",
    description: "of users report getting a response",
    icon: CheckmarkCircle02Icon,
    color: "forest",
  },
  {
    value: 3,
    suffix: " min",
    label: "Average Time",
    description: "to create a professional complaint",
    icon: Time02Icon,
    color: "lavender",
  },
  {
    value: 47,
    suffix: "%",
    label: "Get Refunds",
    description: "receive compensation or refund",
    icon: MoneyReceiveSquareIcon,
    color: "peach",
  },
  {
    value: 200,
    suffix: "+",
    label: "Laws Covered",
    description: "consumer protection regulations",
    icon: BookOpen01Icon,
    color: "coral",
  },
]

function AnimatedNumber({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const colorClasses: Record<string, string> = {
    forest: "text-forest-500",
    lavender: "text-lavender-500",
    peach: "text-peach-500",
    coral: "text-coral-500",
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 2000
          const startTime = performance.now()

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3)
            const current = Math.floor(easeOut * value)
            setCount(current)

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <div ref={ref} className={`text-4xl md:text-5xl font-bold font-display tracking-tight ${colorClasses[color]}`}>
      {count}
      <span className="text-3xl md:text-4xl">{suffix}</span>
    </div>
  )
}

export function StatsSection() {
  const iconBgClasses: Record<string, string> = {
    forest: "bg-forest-100 text-forest-600 dark:bg-forest-900/50 dark:text-forest-400",
    lavender: "bg-lavender-100 text-lavender-600 dark:bg-lavender-900/50 dark:text-lavender-400",
    peach: "bg-peach-100 text-peach-600 dark:bg-peach-900/50 dark:text-peach-400",
    coral: "bg-coral-100 text-coral-600 dark:bg-coral-900/50 dark:text-coral-400",
  }

  return (
    <section className="py-16 md:py-24 border-t border-b border-forest-100 dark:border-stone-800 bg-forest-50/30 dark:bg-stone-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs text-forest-400 font-mono tracking-widest mb-4">
            [ THE RESULTS ]
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-display">
            Real People Getting Real Results
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Join thousands who have successfully fought back against unfair treatment
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${iconBgClasses[stat.color]} mx-auto mb-4 flex items-center justify-center`}>
                <Icon icon={stat.icon} size={24} />
              </div>
              <AnimatedNumber value={stat.value} suffix={stat.suffix} color={stat.color} />
              <div className="mt-3 text-base font-semibold text-foreground font-display">
                {stat.label}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
