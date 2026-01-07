"use client"

import { useState, useEffect } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0
      setProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-stone-200 dark:bg-stone-800">
      <div
        className="h-full bg-gradient-to-r from-forest-500 to-peach-500 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
