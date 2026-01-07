"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendingUp, ExternalLink, ChevronRight, RotateCcw, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Question {
  id: string
  question: string
  options: { label: string; value: number; feedback: string }[]
}

const questions: Question[] = [
  {
    id: "product-market-fit",
    question: "How would you describe your product-market fit?",
    options: [
      { label: "Still testing - low repeat rate, unclear messaging", value: 0, feedback: "Focus on product and positioning before scaling" },
      { label: "Getting there - some repeat customers, refining messaging", value: 1, feedback: "Continue validating before major investment" },
      { label: "Strong - high repeat rate, clear value proposition", value: 2, feedback: "Great foundation for scaling" },
      { label: "Exceptional - organic referrals, strong LTV", value: 3, feedback: "Excellent - you're ready to pour fuel on the fire" },
    ],
  },
  {
    id: "unit-economics",
    question: "What are your current unit economics?",
    options: [
      { label: "Negative or break-even contribution margin", value: 0, feedback: "Fix unit economics before scaling" },
      { label: "10-20% contribution margin", value: 1, feedback: "Thin margins - scale carefully" },
      { label: "20-40% contribution margin", value: 2, feedback: "Healthy margins for controlled scaling" },
      { label: "40%+ contribution margin", value: 3, feedback: "Strong margins - aggressive scaling is viable" },
    ],
  },
  {
    id: "ltv-cac",
    question: "What's your LTV:CAC ratio?",
    options: [
      { label: "Below 2:1 or unknown", value: 0, feedback: "Calculate and improve before scaling" },
      { label: "2:1 to 3:1", value: 1, feedback: "Acceptable but limited room for error" },
      { label: "3:1 to 4:1", value: 2, feedback: "Healthy ratio for sustainable growth" },
      { label: "Above 4:1", value: 3, feedback: "Excellent - you have room to be aggressive" },
    ],
  },
  {
    id: "creative-velocity",
    question: "How quickly can you produce new ad creatives?",
    options: [
      { label: "Struggle to make 1-2 new creatives per month", value: 0, feedback: "Creative bottleneck will limit scaling" },
      { label: "Can produce 4-8 new creatives per month", value: 1, feedback: "Adequate for moderate scaling" },
      { label: "10-20 new creatives per month", value: 2, feedback: "Good creative velocity" },
      { label: "20+ creatives with systematic testing process", value: 3, feedback: "Excellent creative machine" },
    ],
  },
  {
    id: "cash-flow",
    question: "How's your cash flow situation?",
    options: [
      { label: "Can only invest profits back into ads", value: 0, feedback: "Limited ability to scale quickly" },
      { label: "Have 1-2 months of ad spend runway", value: 1, feedback: "Some flexibility but constrained" },
      { label: "Have 3-6 months of ad spend runway", value: 2, feedback: "Good runway for testing and scaling" },
      { label: "Well-capitalized with flexible credit lines", value: 3, feedback: "No cash constraints on growth" },
    ],
  },
  {
    id: "operations",
    question: "Can your operations handle 2x current volume?",
    options: [
      { label: "No - would break fulfillment/support", value: 0, feedback: "Scale operations before ads" },
      { label: "Maybe - would be stressed but possible", value: 1, feedback: "Shore up operations as you scale" },
      { label: "Yes - systems are ready", value: 2, feedback: "Good operational foundation" },
      { label: "Yes - could handle 5x with current setup", value: 3, feedback: "Operations are not a bottleneck" },
    ],
  },
  {
    id: "data-tracking",
    question: "How confident are you in your tracking and attribution?",
    options: [
      { label: "Basic pixel setup, unclear attribution", value: 0, feedback: "Fix tracking before scaling" },
      { label: "Platform pixels + basic UTMs", value: 1, feedback: "Improve tracking for better decisions" },
      { label: "Server-side tracking + clear attribution model", value: 2, feedback: "Solid data foundation" },
      { label: "Advanced setup with multiple attribution views", value: 3, feedback: "Excellent data for optimization" },
    ],
  },
  {
    id: "testing-culture",
    question: "How systematic is your testing process?",
    options: [
      { label: "Ad hoc - test when something breaks", value: 0, feedback: "Build testing into your process" },
      { label: "Some structure but inconsistent", value: 1, feedback: "More discipline will improve results" },
      { label: "Regular testing cadence with documented learnings", value: 2, feedback: "Good testing foundation" },
      { label: "Rigorous A/B testing with statistical significance", value: 3, feedback: "Testing machine - keep it up" },
    ],
  },
]

export default function ScalingReadinessQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (value: number) => {
    const question = questions[currentQuestion]
    setAnswers({ ...answers, [question.id]: value })

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  const calculateScore = () => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
    const maxScore = questions.length * 3
    const percentage = (totalScore / maxScore) * 100
    return { totalScore, maxScore, percentage }
  }

  const getScoreCategory = (percentage: number) => {
    if (percentage >= 80) return { label: "Ready to Scale", color: "text-[#cff128]", icon: CheckCircle, description: "You have strong fundamentals. Time to accelerate growth." }
    if (percentage >= 60) return { label: "Almost Ready", color: "text-green-400", icon: CheckCircle, description: "A few areas need attention, but you're close." }
    if (percentage >= 40) return { label: "Proceed with Caution", color: "text-yellow-400", icon: AlertTriangle, description: "Several areas need improvement before aggressive scaling." }
    return { label: "Not Ready Yet", color: "text-red-400", icon: XCircle, description: "Focus on fundamentals before investing heavily in paid ads." }
  }

  const { totalScore, maxScore, percentage } = calculateScore()
  const category = getScoreCategory(percentage)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">PENANG</span>
              <span className="text-xl font-bold text-[#cff128]">GROWTH LAB</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/tools" className="text-sm text-white transition-colors">Tools</Link>
              <Link href="/guides" className="text-sm text-white/70 hover:text-white transition-colors">Guides</Link>
              <Link href="/blog" className="text-sm text-white/70 hover:text-white transition-colors">Blog</Link>
            </div>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button className="bg-[#cff128] text-black hover:bg-[#e5f875] font-semibold">Work With Us</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-white">Scaling Readiness Quiz</span>
          </div>

          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex p-3 rounded-xl bg-[#cff128]/10 mb-4">
              <TrendingUp className="h-8 w-8 text-[#cff128]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Scaling Readiness Quiz</h1>
            <p className="text-lg text-white/60">
              Assess if your brand is ready to scale paid advertising
            </p>
          </div>

          {!showResults ? (
            /* Quiz */
            <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Question {currentQuestion + 1} of {questions.length}</span>
                  <span className="text-[#cff128]">{Math.round(((currentQuestion) / questions.length) * 100)}% complete</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#cff128] rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                {questions[currentQuestion].question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full p-4 text-left rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white group-hover:text-[#cff128] transition-colors">{option.label}</span>
                      <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-[#cff128] transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Results */
            <div className="space-y-6">
              {/* Score Card */}
              <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20 text-center">
                <category.icon className={`h-16 w-16 ${category.color} mx-auto mb-4`} />
                <h2 className={`text-3xl font-bold ${category.color} mb-2`}>{category.label}</h2>
                <p className="text-white/60 mb-4">{category.description}</p>
                <div className="text-5xl font-bold text-white mb-2">
                  {totalScore}/{maxScore}
                </div>
                <p className="text-white/50">Scaling Readiness Score</p>

                {/* Score Bar */}
                <div className="mt-6 h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage >= 80 ? "bg-[#cff128]" :
                      percentage >= 60 ? "bg-green-400" :
                      percentage >= 40 ? "bg-yellow-400" : "bg-red-400"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Your Results Breakdown</h3>
                <div className="space-y-4">
                  {questions.map((q) => {
                    const answer = answers[q.id]
                    const option = q.options.find(o => o.value === answer)
                    return (
                      <div key={q.id} className="p-4 rounded-xl bg-black/20">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-white/60 text-sm mb-1">{q.question}</p>
                            <p className="font-medium">{option?.label}</p>
                          </div>
                          <div className={`px-2 py-1 rounded text-sm font-medium ${
                            answer === 3 ? "bg-[#cff128]/20 text-[#cff128]" :
                            answer === 2 ? "bg-green-400/20 text-green-400" :
                            answer === 1 ? "bg-yellow-400/20 text-yellow-400" : "bg-red-400/20 text-red-400"
                          }`}>
                            {answer}/3
                          </div>
                        </div>
                        <p className="text-sm text-white/50 mt-2">{option?.feedback}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Recommended Next Steps</h3>
                <div className="space-y-3">
                  {percentage < 40 && (
                    <>
                      <p className="text-white/60">Based on your score, focus on these fundamentals first:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-[#cff128]">1.</span>
                          Validate product-market fit with organic channels
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#cff128]">2.</span>
                          Calculate and improve your unit economics
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#cff128]">3.</span>
                          Set up proper tracking and attribution
                        </li>
                      </ul>
                    </>
                  )}
                  {percentage >= 40 && percentage < 60 && (
                    <>
                      <p className="text-white/60">You're making progress. Focus on these areas:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-[#cff128]">1.</span>
                          Improve your creative production workflow
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#cff128]">2.</span>
                          Build a testing framework for continuous learning
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#cff128]">3.</span>
                          Scale slowly while monitoring unit economics
                        </li>
                      </ul>
                    </>
                  )}
                  {percentage >= 60 && percentage < 80 && (
                    <>
                      <p className="text-white/60">You're almost ready. Fine-tune these areas:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-[#cff128]">1.</span>
                          Shore up any weak points in your assessment
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#cff128]">2.</span>
                          Start with controlled scaling tests
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#cff128]">3.</span>
                          Build relationships with creative partners
                        </li>
                      </ul>
                    </>
                  )}
                  {percentage >= 80 && (
                    <>
                      <p className="text-white/60">You have strong fundamentals. Time to accelerate:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-[#cff128]">1.</span>
                          Develop a systematic scaling playbook
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#cff128]">2.</span>
                          Consider working with an experienced agency
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#cff128]">3.</span>
                          Invest in creative testing at scale
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Retake Quiz
                </Button>
                <Link href="https://www.penangmedia.com" target="_blank" className="flex-1">
                  <Button className="w-full bg-[#cff128] text-black hover:bg-[#e5f875] font-semibold">
                    Get Expert Help <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Related tools */}
          {!showResults && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/tools/ltv-calculator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                  <h3 className="font-medium group-hover:text-[#cff128] transition-colors">LTV Calculator</h3>
                  <p className="text-sm text-white/50 mt-1">Calculate customer lifetime value</p>
                </Link>
                <Link href="/tools/break-even-roas" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                  <h3 className="font-medium group-hover:text-[#cff128] transition-colors">Break-Even ROAS</h3>
                  <p className="text-sm text-white/50 mt-1">Find your target ROAS</p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold">PENANG</span>
              <span className="font-bold text-[#cff128]">GROWTH LAB</span>
            </Link>
            <p className="text-sm text-white/40">© {new Date().getFullYear()} Penang Media</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
