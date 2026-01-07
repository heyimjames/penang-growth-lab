"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Search, Check, FileText, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

// Scenario data
const scenarios = [
  {
    id: "flight",
    query: "My flight was cancelled and the airline won't refund me...",
    searches: [
      "UK flight delay compensation",
      "EC261 passenger rights",
      "Airline refund rules",
    ],
    sources: [
      { name: "Civil Aviation Authority", domain: "caa.co.uk", color: "bg-blue-500" },
      { name: "Which? Consumer Rights", domain: "which.co.uk", color: "bg-red-500" },
      { name: "MoneySavingExpert", domain: "moneysavingexpert.com", color: "bg-green-500" },
      { name: "EU Regulation EC 261", domain: "europa.eu", color: "bg-blue-600" },
    ],
    response: "Under EC 261/2004, you're entitled to up to £520 compensation for cancelled flights.",
    letterType: "Compensation Claim Letter",
  },
  {
    id: "product",
    query: "I bought a laptop that stopped working after 2 months...",
    searches: [
      "Consumer Rights Act faulty goods",
      "UK retailer refund law",
      "Statutory vs warranty rights",
    ],
    sources: [
      { name: "Citizens Advice", domain: "citizensadvice.org.uk", color: "bg-orange-500" },
      { name: "Gov.uk Consumer Rights", domain: "gov.uk", color: "bg-black" },
      { name: "Which? Faulty Goods", domain: "which.co.uk", color: "bg-red-500" },
      { name: "Trading Standards", domain: "tradingstandards.uk", color: "bg-purple-500" },
    ],
    response: "Under the Consumer Rights Act 2015, goods must be of satisfactory quality. You have the right to a refund.",
    letterType: "Refund Request Letter",
  },
  {
    id: "subscription",
    query: "I've been trying to cancel my gym membership for months...",
    searches: [
      "UK gym cancellation rights",
      "Direct debit recall consumer",
      "Unfair contract terms",
    ],
    sources: [
      { name: "Financial Ombudsman", domain: "financial-ombudsman.org.uk", color: "bg-teal-500" },
      { name: "Citizens Advice", domain: "citizensadvice.org.uk", color: "bg-orange-500" },
      { name: "Gov.uk Direct Debits", domain: "gov.uk", color: "bg-black" },
      { name: "Which? Cancel Gym", domain: "which.co.uk", color: "bg-red-500" },
    ],
    response: "You can cancel a Direct Debit at any time through your bank. Request a refund for charges after cancellation.",
    letterType: "Cancellation Letter",
  },
]

// Animation phases
type Phase = "idle" | "typing" | "searching" | "sources" | "analyzing" | "response" | "letter" | "complete"

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export function HowItWorksDemo() {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("idle")
  const [isInView, setIsInView] = useState(false)
  const [typedChars, setTypedChars] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const scenario = scenarios[scenarioIndex]

  // Intersection observer to start animation when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
          setPhase("typing")
        }
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [isInView])

  // Typing animation
  useEffect(() => {
    if (phase !== "typing") return

    const text = scenario.query
    if (typedChars >= text.length) {
      const timer = setTimeout(() => setPhase("searching"), 400)
      return () => clearTimeout(timer)
    }

    const speed = prefersReducedMotion ? 5 : 25
    const timer = setTimeout(() => {
      setTypedChars((prev) => prev + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [phase, typedChars, scenario.query, prefersReducedMotion])

  // Phase progression
  useEffect(() => {
    if (!isInView) return

    const timings = prefersReducedMotion
      ? { searching: 400, sources: 400, analyzing: 300, response: 400, letter: 600, complete: 1200 }
      : { searching: 1000, sources: 1200, analyzing: 800, response: 1200, letter: 1500, complete: 2000 }

    const transitions: Record<Phase, Phase | null> = {
      idle: null,
      typing: null, // handled by typing effect
      searching: "sources",
      sources: "analyzing",
      analyzing: "response",
      response: "letter",
      letter: "complete",
      complete: null,
    }

    const nextPhase = transitions[phase]
    if (nextPhase) {
      const timer = setTimeout(() => setPhase(nextPhase), timings[phase as keyof typeof timings])
      return () => clearTimeout(timer)
    }

    if (phase === "complete") {
      const timer = setTimeout(() => {
        setScenarioIndex((prev) => (prev + 1) % scenarios.length)
        setTypedChars(0)
        setPhase("typing")
      }, timings.complete)
      return () => clearTimeout(timer)
    }
  }, [phase, isInView, prefersReducedMotion])

  // Manual scenario navigation
  const goToScenario = useCallback((index: number) => {
    setScenarioIndex(index)
    setTypedChars(0)
    setPhase("typing")
  }, [])

  const displayedQuery = scenario.query.slice(0, typedChars)
  const phaseOrder = ["idle", "typing", "searching", "sources", "analyzing", "response", "letter", "complete"]
  const currentPhaseIndex = phaseOrder.indexOf(phase)

  const showSearching = currentPhaseIndex >= 2
  const showSources = currentPhaseIndex >= 3
  const showAnalyzing = currentPhaseIndex >= 4
  const showResponse = currentPhaseIndex >= 5
  const showLetter = currentPhaseIndex >= 6
  const isFinished = phase === "complete"

  return (
    <section className="py-12 md:py-16 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-2">
              See How NoReply Works
            </h2>
            <p className="text-muted-foreground">
              Watch how we research your rights and generate your letter
            </p>
          </motion.div>

          {/* Demo container */}
          <motion.div
            ref={containerRef}
            className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Status header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 dark:border-stone-800">
              <span className="text-sm text-muted-foreground flex items-center gap-2.5">
                {isFinished ? (
                  <motion.span
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Check className="w-4 h-4 text-forest-500" />
                    Reviewed {scenario.sources.length} sources
                  </motion.span>
                ) : (
                  <>
                    {/* Pulsing dot */}
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-peach-400 animate-ping opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-peach-500" />
                    </span>
                    {/* Shimmer text */}
                    <span className="text-muted-foreground animate-pulse">
                      Researching...
                    </span>
                  </>
                )}
              </span>
            </div>

            {/* Content area - FIXED height, content sized to fit without clipping */}
            <div className="p-3 md:p-4 h-[480px] md:h-[420px]">
              <div className="space-y-3">
                    {/* Query with typing cursor */}
                    <div className="flex items-start gap-2">
                      <motion.span
                        className={cn(
                          "mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0",
                          isFinished ? "bg-forest-500" : "bg-peach-500"
                        )}
                        animate={!isFinished ? { opacity: [1, 0.5, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                      <p className="text-xs text-foreground leading-relaxed">
                        {phase === "typing" ? displayedQuery : scenario.query}
                        {phase === "typing" && (
                          <motion.span
                            className="inline-block w-0.5 h-3.5 bg-forest-500 ml-0.5 align-middle"
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                          />
                        )}
                      </p>
                    </div>

                    {/* Searching pills */}
                    <AnimatePresence mode="wait">
                      {showSearching && (
                        <motion.div
                          {...fadeIn}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-xs text-muted-foreground mb-1.5">Searching</p>
                          <div className="flex flex-wrap gap-1.5">
                            {scenario.searches.map((search, idx) => (
                              <motion.div
                                key={search}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: idx * 0.1,
                                  duration: 0.2
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-xs border border-stone-200 dark:border-stone-700"
                              >
                                <Search className="w-3 h-3 text-muted-foreground" />
                                <span className="text-foreground text-[11px]">{search}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Sources list */}
                    <AnimatePresence mode="wait">
                      {showSources && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-xs text-muted-foreground mb-1.5">
                            Reviewing sources · {scenario.sources.length}
                          </p>
                          <div className="rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
                            {scenario.sources.map((source, idx) => (
                              <motion.div
                                key={source.name}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                  delay: idx * 0.08,
                                  duration: 0.2
                                }}
                                className={cn(
                                  "flex items-center justify-between px-2.5 py-2 bg-white dark:bg-stone-900",
                                  idx !== scenario.sources.length - 1 && "border-b border-stone-100 dark:border-stone-800"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold text-white",
                                    source.color
                                  )}>
                                    {source.name.charAt(0)}
                                  </div>
                                  <span className="text-xs text-foreground">
                                    {source.name}
                                  </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground hidden sm:block">
                                  {source.domain}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Analyzing indicator */}
                    <AnimatePresence>
                      {showAnalyzing && !showResponse && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <motion.div
                            className="w-3.5 h-3.5 border-2 border-peach-500 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          />
                          <span>Analyzing your rights...</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* AI Response */}
                    <AnimatePresence mode="wait">
                      {showResponse && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.25 }}
                          className="p-2.5 bg-forest-50 dark:bg-forest-900/20 rounded-lg border border-forest-200 dark:border-forest-800"
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-forest-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-xs text-foreground leading-relaxed">
                              {scenario.response}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Letter Generated */}
                    <AnimatePresence mode="wait">
                      {showLetter && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.25 }}
                          className="flex items-center justify-between p-2.5 bg-peach-50 dark:bg-peach-900/20 rounded-lg border border-peach-200 dark:border-peach-800"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-peach-500 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-xs">{scenario.letterType}</p>
                              <p className="text-[10px] text-muted-foreground">Ready to send</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-peach-600 dark:text-peach-400">
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">Generated</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Finished indicator */}
                    <AnimatePresence mode="wait">
                      {isFinished && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-1.5 text-xs text-forest-600 dark:text-forest-400"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Finished</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
              </div>
            </div>

          </motion.div>

          {/* Scenario dots */}
          <div className="flex justify-center gap-2 mt-4">
            {scenarios.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToScenario(idx)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  idx === scenarioIndex
                    ? "bg-forest-500 w-6"
                    : "bg-stone-300 dark:bg-stone-700 hover:bg-stone-400 w-2"
                )}
                aria-label={`Go to scenario ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
