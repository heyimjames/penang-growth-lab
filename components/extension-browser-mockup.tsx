"use client"

import { useState, useEffect } from "react"
import { Icon } from "@/lib/icons"
import {
  JusticeScale01Icon,
  MessageMultiple01Icon,
  FolderOpenIcon,
  Copy01Icon,
  SparklesIcon,
  Tick01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { motion, AnimatePresence } from "motion/react"

type DemoPhase = "legal" | "empty" | "typing" | "typed" | "thinking" | "result" | "copied"

const COMPANY_MESSAGE = "We can't process refunds after 14 days..."

export function ExtensionBrowserMockup() {
  const [phase, setPhase] = useState<DemoPhase>("legal")
  const [typedText, setTypedText] = useState("")

  // Animation sequence - 12 second loop
  useEffect(() => {
    const runSequence = async () => {
      setPhase("legal")
      setTypedText("")
      await delay(2500)

      // Switch to suggest tab with empty input
      setPhase("empty")
      await delay(800)

      // Start typing animation
      setPhase("typing")
      for (let i = 0; i <= COMPANY_MESSAGE.length; i++) {
        setTypedText(COMPANY_MESSAGE.slice(0, i))
        await delay(40) // Typing speed
      }

      setPhase("typed")
      await delay(800)

      setPhase("thinking")
      await delay(1500)

      setPhase("result")
      await delay(2000)

      setPhase("copied")
      await delay(2000)
    }

    runSequence()
    const interval = setInterval(runSequence, 12000)
    return () => clearInterval(interval)
  }, [])

  const activeTab = phase === "legal" ? "legal" : "suggest"

  return (
    <div className="relative w-full flex justify-center">
      {/* Mobile: Just the extension panel */}
      <div className="md:hidden w-[280px] h-[420px] flex-shrink-0">
        <ExtensionPanel phase={phase} activeTab={activeTab} typedText={typedText} />
      </div>

      {/* Desktop: Browser window with extension sidebar */}
      <div className="hidden md:block">
        <div className="w-[700px] h-[560px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
          {/* Browser Chrome */}
          <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-3">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            {/* URL bar */}
            <div className="flex-1 h-6 bg-white rounded-md border border-gray-200 flex items-center px-3">
              <span className="text-[11px] text-gray-400">🔒</span>
              <span className="text-[11px] text-gray-600 ml-1.5">support.retailer.com/chat</span>
            </div>
            {/* Extension icon */}
            <div className="w-7 h-7 rounded-lg bg-forest-500 flex items-center justify-center cursor-pointer hover:bg-forest-600 transition-colors">
              <Icon icon={KnightShieldIcon} size={14} color="white" />
            </div>
          </div>

          {/* Browser Content */}
          <div className="flex-1 flex">
            {/* Main page content (fake chat) */}
            <div className="flex-1 bg-gray-50 p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">CS</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Customer Support</p>
                  <p className="text-[10px] text-green-600">Online</p>
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-1 space-y-3 overflow-hidden">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">CS</div>
                  <div className="bg-white rounded-lg rounded-tl-none p-2.5 text-xs text-gray-700 max-w-[200px] shadow-sm">
                    Hi! How can I help you today?
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="bg-forest-500 rounded-lg rounded-tr-none p-2.5 text-xs text-white max-w-[200px]">
                    My laptop screen is flickering after 2 weeks
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">CS</div>
                  <div className="bg-white rounded-lg rounded-tl-none p-2.5 text-xs text-gray-700 max-w-[200px] shadow-sm">
                    I'm sorry, but we can't process refunds after 14 days per our store policy.
                  </div>
                </div>
              </div>

              {/* Chat input */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg"
                  readOnly
                />
                <button className="h-9 px-4 bg-blue-500 text-white text-xs font-medium rounded-lg">Send</button>
              </div>
            </div>

            {/* Extension Sidebar */}
            <div className="w-[280px] border-l border-gray-200 flex flex-col bg-white">
              <ExtensionPanel phase={phase} activeTab={activeTab} typedText={typedText} />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative glow */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-forest-200/40 via-transparent to-coral-200/40 rounded-full blur-3xl" />
    </div>
  )
}

interface PanelProps {
  phase: DemoPhase
  activeTab: "legal" | "suggest"
  typedText: string
}

function ExtensionPanel({ phase, activeTab, typedText }: PanelProps) {
  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-forest-500 to-forest-600 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <Icon icon={KnightShieldIcon} size={18} color="white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">NoReply</p>
          <p className="text-forest-100 text-[10px]">Consumer Advocate</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-3 pt-3">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          <TabButton
            active={activeTab === "legal"}
            icon={JusticeScale01Icon}
            label="Rights"
          />
          <TabButton
            active={activeTab === "suggest"}
            icon={MessageMultiple01Icon}
            label="Suggest"
          />
          <TabButton
            active={false}
            icon={FolderOpenIcon}
            label="Case"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "legal" && (
            <motion.div
              key="legal"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="h-full flex flex-col gap-2"
            >
              <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
                Relevant Rights
              </p>

              <div className="p-3 bg-coral-50 rounded-xl border border-coral-200">
                <p className="text-xs font-semibold text-coral-700">Consumer Rights Act 2015</p>
                <p className="text-[11px] text-gray-600 mt-1">
                  Right to refund within 30 days for faulty goods
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200">
                <p className="text-xs font-semibold text-gray-700">Satisfactory Quality</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Products must be free from defects
                </p>
              </div>

              <div className="p-3 bg-forest-50 rounded-xl border border-forest-200">
                <div className="flex items-center gap-1.5">
                  <Icon icon={SparklesIcon} size={12} className="text-forest-600" />
                  <p className="text-xs font-semibold text-forest-700">Pro Tip</p>
                </div>
                <p className="text-[11px] text-gray-600 mt-1">
                  Store policy cannot override your statutory rights
                </p>
              </div>

              <div className="mt-auto p-2 bg-gray-50 rounded-lg flex items-center gap-2">
                <Icon icon={Tick01Icon} size={14} className="text-forest-500" />
                <p className="text-[10px] text-gray-600">3 rights apply to your situation</p>
              </div>
            </motion.div>
          )}

          {activeTab === "suggest" && (
            <motion.div
              key="suggest"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="h-full flex flex-col gap-2"
            >
              <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
                Response Assistant
              </p>

              {/* Input area - where user types/pastes what company said */}
              <div className={`p-2.5 rounded-xl border transition-colors ${
                phase === "typing" || phase === "typed"
                  ? "bg-white border-coral-300 ring-2 ring-coral-100"
                  : "bg-gray-50 border-gray-200"
              }`}>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Paste what they said:</p>
                <div className="min-h-[36px] text-[11px] text-gray-600">
                  {typedText ? (
                    <span className="italic">"{typedText}"</span>
                  ) : (
                    <span className="text-gray-400">Click to paste message...</span>
                  )}
                  {phase === "typing" && (
                    <span className="inline-block w-0.5 h-3 bg-coral-500 ml-0.5 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Result area */}
              <div className="flex-1 relative min-h-[120px]">
                <AnimatePresence mode="wait">
                  {(phase === "empty" || phase === "typing") && (
                    <motion.div
                      key="generate-disabled"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-x-0 top-0"
                    >
                      <button className="w-full py-3 bg-gray-200 text-gray-400 text-xs font-medium rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                        <Icon icon={SparklesIcon} size={14} />
                        Generate Response
                      </button>
                    </motion.div>
                  )}

                  {phase === "typed" && (
                    <motion.div
                      key="generate-btn"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-x-0 top-0"
                    >
                      <button className="w-full py-3 bg-coral-500 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-2 shadow-md">
                        <Icon icon={SparklesIcon} size={14} />
                        Generate Response
                      </button>
                    </motion.div>
                  )}

                  {phase === "thinking" && (
                    <motion.div
                      key="thinking"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-forest-50 rounded-xl border border-forest-200 flex flex-col items-center justify-center"
                    >
                      <div className="w-6 h-6 border-2 border-forest-200 border-t-forest-500 rounded-full animate-spin" />
                      <p className="text-xs text-forest-600 mt-3">Crafting response...</p>
                    </motion.div>
                  )}

                  {(phase === "result" || phase === "copied") && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute inset-0 p-3 bg-forest-50 rounded-xl border border-forest-200 flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-forest-700">Suggested Reply</p>
                        <button className="flex items-center gap-1 text-[10px] text-forest-600 font-medium">
                          {phase === "copied" ? (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-green-600 flex items-center gap-1"
                            >
                              <Icon icon={Tick01Icon} size={10} />
                              Copied!
                            </motion.span>
                          ) : (
                            <>
                              <Icon icon={Copy01Icon} size={10} />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-700 leading-relaxed">
                        "Under the Consumer Rights Act 2015, I'm entitled to a full refund within 30 days. Please process my refund."
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-3 pb-3">
        <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <p className="text-[11px] text-gray-700 font-medium">Active complaint</p>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 bg-forest-100 text-forest-700 rounded font-medium">
              2 credits
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, icon, label }: { active: boolean; icon: typeof KnightShieldIcon; label: string }) {
  return (
    <button
      className={`flex-1 py-2 px-2 text-[10px] font-medium rounded-md transition-all ${
        active
          ? "bg-white shadow-sm text-gray-900"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      <Icon icon={icon} size={14} className="mx-auto mb-0.5" />
      {label}
    </button>
  )
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
