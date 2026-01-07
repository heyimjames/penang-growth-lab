"use client"

import { useState, useEffect, useCallback } from "react"

interface ComplaintData {
  company: string
  subject: string
  bodyFirst: string
  bodySecond: string
  legalBasis: string
}

const complaints: ComplaintData[] = [
  {
    company: "Online Retailer - Customer Service",
    subject: "Order #123-456-789 - Defective Product",
    bodyFirst:
      "I bought a laptop charger that stopped working after just 3 days. I need a full refund for this faulty product.",
    bodySecond:
      "The Consumer Rights Act 2015 says products must be of satisfactory quality. This one clearly wasn't...",
    legalBasis: "Consumer Rights Act 2015",
  },
  {
    company: "Energy Provider - Complaints Dept",
    subject: "Account #EP-789012 - Wrong Bill",
    bodyFirst:
      "You've charged me £847 for energy I never used. My property was empty during that period.",
    bodySecond:
      "Ofgem rules say you have to bill accurately. My smart meter data shows zero usage during this time...",
    legalBasis: "Ofgem Consumer Standards",
  },
  {
    company: "Airline - Customer Support",
    subject: "Booking REF-XY789 - Cancelled Flight",
    bodyFirst:
      "My flight was cancelled with less than 14 days notice. I'm owed €600 compensation.",
    bodySecond:
      "EU Regulation 261/2004 entitles me to compensation for this cancellation. There were no extraordinary circumstances...",
    legalBasis: "EU Regulation 261/2004",
  },
  {
    company: "Mobile Provider - Complaints",
    subject: "Contract #MP-456123 - No Signal",
    bodyFirst:
      "I've had virtually no mobile signal for 6 weeks but you're still charging me full price every month.",
    bodySecond:
      "The Communications Act 2003 requires you to provide services properly. Your coverage map said I'd have full signal...",
    legalBasis: "Communications Act 2003",
  },
  {
    company: "Fashion Retailer - Customer Care",
    subject: "Order #FR-321654 - Never Arrived",
    bodyFirst:
      "My order was marked as delivered but I never received it. I need a full refund of £156.99.",
    bodySecond:
      "Under the Consumer Contracts Regulations 2013, you have to actually deliver goods to me. The courier left it at the wrong address...",
    legalBasis: "Consumer Contracts Regulations 2013",
  },
]

export function LetterMockup() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedCompany, setDisplayedCompany] = useState("")
  const [displayedSubject, setDisplayedSubject] = useState("")
  const [displayedBodyFirst, setDisplayedBodyFirst] = useState("")
  const [displayedBodySecond, setDisplayedBodySecond] = useState("")
  const [displayedLegal, setDisplayedLegal] = useState("")
  const [isFading, setIsFading] = useState(false)
  const [phase, setPhase] = useState<
    "company" | "subject" | "bodyFirst" | "bodySecond" | "legal" | "waiting" | "fading"
  >("company")

  const currentComplaint = complaints[currentIndex]

  const typeWords = useCallback(
    (
      text: string,
      setter: (val: string) => void,
      onComplete: () => void,
      wordDelay: number = 80
    ) => {
      const words = text.split(" ")
      let currentWordIndex = 0

      const typeNextWord = () => {
        if (currentWordIndex < words.length) {
          const displayText = words.slice(0, currentWordIndex + 1).join(" ")
          setter(displayText)
          currentWordIndex++
          setTimeout(typeNextWord, wordDelay)
        } else {
          onComplete()
        }
      }

      typeNextWord()
    },
    []
  )

  useEffect(() => {
    // Reset all displayed text when changing complaints
    setDisplayedCompany("")
    setDisplayedSubject("")
    setDisplayedBodyFirst("")
    setDisplayedBodySecond("")
    setDisplayedLegal("")
    setIsFading(false)
    setPhase("company")
  }, [currentIndex])

  useEffect(() => {
    if (phase === "company") {
      typeWords(currentComplaint.company, setDisplayedCompany, () => {
        setTimeout(() => setPhase("subject"), 200)
      })
    } else if (phase === "subject") {
      typeWords(currentComplaint.subject, setDisplayedSubject, () => {
        setTimeout(() => setPhase("bodyFirst"), 200)
      })
    } else if (phase === "bodyFirst") {
      typeWords(currentComplaint.bodyFirst, setDisplayedBodyFirst, () => {
        setTimeout(() => setPhase("bodySecond"), 200)
      })
    } else if (phase === "bodySecond") {
      typeWords(currentComplaint.bodySecond, setDisplayedBodySecond, () => {
        setTimeout(() => setPhase("legal"), 200)
      })
    } else if (phase === "legal") {
      typeWords(
        currentComplaint.legalBasis,
        setDisplayedLegal,
        () => {
          setTimeout(() => setPhase("waiting"), 300)
        },
        100
      )
    } else if (phase === "waiting") {
      // Wait before fading
      const timer = setTimeout(() => {
        setPhase("fading")
        setIsFading(true)
      }, 3000)
      return () => clearTimeout(timer)
    } else if (phase === "fading") {
      // Wait for fade animation, then switch to next complaint
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % complaints.length)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [phase, currentComplaint, typeWords])

  return (
    <div className="relative w-[340px] sm:w-[360px]">
      {/* Main letter card */}
      <div className="border border-forest-200 bg-cream-50 rounded-md shadow-sm overflow-hidden w-full">
        {/* Letter header */}
        <div className="bg-forest-50 px-5 py-3 border-b border-forest-100">
          <div className="text-xs text-forest-500 uppercase tracking-widest font-medium">
            Complaint Letter
          </div>
        </div>

        {/* Letter content */}
        <div
          className={`p-5 space-y-4 text-sm transition-opacity duration-700 ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Recipient */}
          <div className="space-y-1">
            <div className="text-forest-400 text-xs uppercase tracking-wide">To</div>
            <div className="text-forest-700 font-medium min-h-[1.5rem]">
              {displayedCompany}
              {phase === "company" && displayedCompany && (
                <span className="inline-block w-0.5 h-4 bg-forest-500 ml-0.5 animate-pulse" />
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <div className="text-forest-400 text-xs uppercase tracking-wide">Subject</div>
            <div className="text-forest-700 font-medium min-h-[1.5rem]">
              {displayedSubject}
              {phase === "subject" && displayedSubject && (
                <span className="inline-block w-0.5 h-4 bg-forest-500 ml-0.5 animate-pulse" />
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-forest-100" />

          {/* Body preview */}
          <div className="text-forest-600 leading-relaxed min-h-[10rem]">
            <p className="min-h-[4rem]">
              {displayedBodyFirst}
              {phase === "bodyFirst" && displayedBodyFirst && (
                <span className="inline-block w-0.5 h-4 bg-forest-500 ml-0.5 animate-pulse" />
              )}
            </p>
            <p className="mt-3 text-forest-400 min-h-[4.5rem]">
              {displayedBodySecond}
              {phase === "bodySecond" && displayedBodySecond && (
                <span className="inline-block w-0.5 h-4 bg-forest-400 ml-0.5 animate-pulse" />
              )}
            </p>
          </div>

          {/* Legal basis tag */}
          <div className="pt-2 min-h-[2rem]">
            {displayedLegal && (
              <span className="inline-flex items-center text-xs text-forest-500 bg-forest-50 px-2 py-1 rounded">
                {displayedLegal}
                {phase === "legal" && (
                  <span className="inline-block w-0.5 h-3 bg-forest-500 ml-1 animate-pulse" />
                )}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-forest-50 px-5 py-3 border-t border-forest-100 flex items-center justify-between">
          <span className="text-xs text-forest-400">Generated by NoReply</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-peach-400" />
            <span className="text-xs text-forest-500">Ready to send</span>
          </div>
        </div>
      </div>

      {/* Decorative shadow card behind */}
      <div className="absolute -z-10 top-3 left-3 right-0 bottom-0 border border-forest-100 bg-forest-50/50 rounded-md" />

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {complaints.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-forest-500 w-3"
                : "bg-forest-200 hover:bg-forest-300"
            }`}
            aria-label={`View complaint ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
