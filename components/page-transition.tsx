"use client"

import { ReactNode, useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, type Variants } from "motion/react"

// Define animation variants
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1], // Custom easing for smooth feel
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// Sliding variants based on navigation direction
const slideVariants: Variants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction * 30,
    scale: 0.98,
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -20,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

// Define route order for directional navigation
const routeOrder = ["/dashboard", "/cases", "/new", "/account"]

function getRouteIndex(pathname: string): number {
  // Check for exact matches first
  const exactIndex = routeOrder.indexOf(pathname)
  if (exactIndex !== -1) return exactIndex

  // Check for prefix matches (e.g., /cases/123)
  for (let i = 0; i < routeOrder.length; i++) {
    if (pathname.startsWith(routeOrder[i] + "/")) {
      return i
    }
  }

  return -1
}

interface PageTransitionProps {
  children: ReactNode
  mode?: "fade" | "slide"
}

export function PageTransition({ children, mode = "slide" }: PageTransitionProps) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [isAnimating, setIsAnimating] = useState(false)
  const previousPath = useRef(pathname)
  const direction = useRef(0)

  useEffect(() => {
    if (pathname !== previousPath.current) {
      // Calculate direction based on route order
      const prevIndex = getRouteIndex(previousPath.current)
      const nextIndex = getRouteIndex(pathname)

      if (prevIndex !== -1 && nextIndex !== -1) {
        direction.current = nextIndex > prevIndex ? 1 : -1
      } else {
        // Default direction for routes not in the main nav
        direction.current = 1
      }

      previousPath.current = pathname
      setIsAnimating(true)
    }
  }, [pathname])

  useEffect(() => {
    setDisplayChildren(children)
  }, [children])

  const variants = mode === "slide" ? slideVariants : pageVariants

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => setIsAnimating(false)}
    >
      <motion.div
        key={pathname}
        custom={direction.current}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1"
      >
        {displayChildren}
      </motion.div>
    </AnimatePresence>
  )
}

// Simpler fade transition for nested content
export function FadeTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Stagger children animation for lists
export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
