"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfidenceScore } from "@/components/confidence-score"
import { CompanyLogo } from "@/components/company-logo"
import { Icon } from "@/lib/icons"
import {
  JusticeScale01Icon,
  File01Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  Copy01Icon,
  Mail01Icon,
  Download01Icon,
  Edit02Icon,
  Loading03Icon,
  Building01Icon,
  AnalyticsUpIcon,
  BulbIcon,
  Image01Icon,
  CreditCardIcon,
  Globe02Icon,
  LinkSquare01Icon,
  Briefcase01Icon,
  Comment01Icon,
  UserMultiple02Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { cn } from "@/lib/utils"
import type { CaseFormData, AnalysisResult } from "@/app/(dashboard)/new/page"
import { updateCase } from "@/lib/actions/cases"
import { getProfileForLetter } from "@/lib/actions/profile"
import { format } from "date-fns"
import { toast } from "sonner"
import { motion } from "motion/react"

interface StepFourProps {
  formData: CaseFormData
  analysisResult: AnalysisResult | null
  caseId: string | null
}

const tones = [
  { value: "formal", label: "Formal", description: "Professional and business-like", icon: Briefcase01Icon },
  { value: "assertive", label: "Assertive", description: "Firm but respectful", icon: KnightShieldIcon },
  { value: "friendly", label: "Friendly", description: "Warm but clear about issues", icon: Comment01Icon },
]

// Helper function to format outcome labels, preserving "AI" in all caps
function formatOutcomeLabel(value: string): string {
  if (value === "ai-suggested") {
    return "AI Suggested"
  }
  // Replace hyphens with spaces and capitalize, but preserve "AI"
  return value
    .replace(/-/g, " ")
    .replace(/\bai\b/gi, "AI")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function StepFour({ formData, analysisResult, caseId }: StepFourProps) {
  const currency = formData.currency === "GBP" ? "£" : formData.currency === "EUR" ? "€" : "$"
  // Always use assertive (firm & direct) tone
  const selectedTone: "assertive" = "assertive"
  const [generatedLetter, setGeneratedLetter] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("analysis")

  const analysis = analysisResult || {
    confidenceScore: 75,
    issues: ["Issue details pending analysis"],
    legalBasis: [
      {
        law: "Consumer Rights Act 2015",
        section: "Various sections",
        summary: "Consumers have rights when purchasing goods and services.",
      },
    ],
  }

  const companyEmail = formData.companyResearch?.contacts?.customerServiceEmails?.[0]
    || formData.companyResearch?.contacts?.emails?.[0]

  const handleGenerate = async () => {
    setIsGenerating(true)
    toast.loading("Generating your professional letter...", { id: "generate" })

    try {
      // Fetch user profile for letter personalization
      const userProfile = await getProfileForLetter()

      const response = await fetch("/api/generate/letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint: formData.complaint,
          companyName: formData.companyName,
          incidentDate: formData.incidentDate ? format(formData.incidentDate, "PPP") : null,
          purchaseAmount: formData.purchaseAmount,
          currency: formData.currency,
          desiredOutcome: formData.desiredOutcome === "other" ? formData.customOutcome : formatOutcomeLabel(formData.desiredOutcome || ""),
          tone: selectedTone,
          issues: analysis.issues,
          legalBasis: analysis.legalBasis,
          evidenceAnalysis: analysis.evidenceAnalysis,
          evidenceFiles: formData.evidence.map(f => f.name),
          companyEmail,
          incidentCountry: formData.incidentCountry,
          userCountry: formData.userCountry,
          paymentMethod: formData.paymentMethod,
          userProfile,
        }),
      })

      const data = await response.json()

      if (data.letter) {
        setGeneratedLetter(data.letter)
        setActiveTab("letter")
        toast.success("Letter generated!", {
          id: "generate",
          description: "Review, edit if needed, then copy or send.",
        })

        if (caseId) {
          await updateCase(caseId, {
            generated_letter: data.letter,
            confidence_score: analysis.confidenceScore,
            status: "ready",
          })
        }
      } else {
        throw new Error("No letter returned")
      }
    } catch (error) {
      console.error("Letter generation error:", error)
      toast.error("Failed to generate letter", { id: "generate" })
    }

    setIsGenerating(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedLetter)
    setCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEmailClick = () => {
    const subject = encodeURIComponent(
      `Formal Complaint - ${formData.incidentDate ? format(formData.incidentDate, "PPP") : "Recent Incident"}`,
    )
    const body = encodeURIComponent(generatedLetter)
    const mailto = companyEmail
      ? `mailto:${companyEmail}?subject=${subject}&body=${body}`
      : `mailto:?subject=${subject}&body=${body}`
    window.location.href = mailto
    toast.info(companyEmail ? `Opening email to ${companyEmail}...` : "Opening your email client...")
  }

  const handleDownload = (format: "txt" | "docx") => {
    if (format === "txt") {
      const blob = new Blob([generatedLetter], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `complaint-${formData.companyName.toLowerCase().replace(/\s+/g, "-")}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Letter downloaded!")
    } else {
      // For Word format, create a simple HTML-based document
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Complaint Letter - ${formData.companyName}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.6; max-width: 700px; margin: 40px auto; padding: 20px; }
            h1 { font-size: 14pt; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          ${generatedLetter.replace(/\n/g, "<br>")}
        </body>
        </html>
      `
      const blob = new Blob([htmlContent], { type: "application/msword" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `complaint-${formData.companyName.toLowerCase().replace(/\s+/g, "-")}.doc`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Word document downloaded!")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <CompanyLogo
            companyName={formData.companyName}
            domain={formData.companyResearch?.company?.domain}
            size={48}
          />
          <div>
            <h3 className="font-semibold text-lg text-foreground">Case Analysis Complete</h3>
            <p className="text-sm text-muted-foreground">vs. {formData.companyName}</p>
          </div>
        </div>
        <ConfidenceScore score={analysis.confidenceScore} size="lg" />
      </div>

      {/* Recommended Action */}
      {analysis.recommendedAction && (
        <Card className="relative overflow-hidden border-2 border-peach-400 bg-gradient-to-br from-peach-50 to-peach-100/50 dark:from-peach-950/40 dark:to-peach-900/20 shadow-md">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-peach-200/20 dark:bg-peach-800/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-peach-300/20 dark:bg-peach-700/10 rounded-full blur-2xl pointer-events-none" />
          
          <CardContent className="relative p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 rounded-xl bg-peach-500 dark:bg-peach-600 shadow-sm">
                <Icon icon={BulbIcon} size={24} color="currentColor" className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h4 className="font-bold text-lg text-foreground">Recommended Action</h4>
                  <Badge className="bg-peach-500 text-white border-0 text-xs font-medium">
                    Next Step
                  </Badge>
                </div>
                <p className="text-base text-foreground leading-relaxed font-medium">{analysis.recommendedAction}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estimated Compensation */}
      {analysis.estimatedCompensation && analysis.estimatedCompensation.max > 0 && (
        <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
                <Icon icon={AnalyticsUpIcon} size={20} color="currentColor" className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Estimated Compensation</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {currency}
                  {analysis.estimatedCompensation.min.toLocaleString()} - {currency}
                  {analysis.estimatedCompensation.max.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{analysis.estimatedCompensation.basis}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Analysis / Letter */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analysis">Case Analysis</TabsTrigger>
          <TabsTrigger value="letter" disabled={!generatedLetter}>
            Your Letter {generatedLetter && "✓"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4 mt-4">
          {/* Issues Identified */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-foreground">
                  <div className="p-1.5 rounded-lg bg-peach-100 dark:bg-peach-900/30">
                    <Icon icon={AlertCircleIcon} size={18} color="currentColor" className="text-peach-600 dark:text-peach-400" />
                  </div>
                  Issues Identified
                </CardTitle>
                <Badge variant="outline" className="bg-peach-50 border-peach-200 text-peach-700 dark:bg-peach-950/30 dark:border-peach-800 dark:text-peach-300">
                  {analysis.issues.length} {analysis.issues.length === 1 ? "issue" : "issues"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {analysis.issues.map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative flex items-start gap-3 p-3 rounded-lg border border-peach-200 dark:border-peach-900 bg-peach-50/50 dark:bg-peach-950/20 hover:bg-peach-100/50 dark:hover:bg-peach-950/30 transition-colors"
                  >
                    {/* Number indicator */}
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-peach-500 dark:bg-peach-600 text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    
                    {/* Issue content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-relaxed">{issue}</p>
                    </div>
                    
                    {/* Checkmark icon */}
                    <div className="flex-shrink-0">
                      <Icon 
                        icon={CheckmarkCircle01Icon} 
                        size={18} 
                        color="currentColor" 
                        className="text-green-600 dark:text-green-400 opacity-60 group-hover:opacity-100 transition-opacity" 
                      />
                    </div>
                    
                    {/* Decorative accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-peach-400 dark:bg-peach-600 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
              
              {/* Summary message */}
              {analysis.issues.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Icon icon={AlertCircleIcon} size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      <span className="font-medium">These issues strengthen your case.</span> Each identified issue provides additional legal grounds for your complaint and increases the likelihood of a favorable resolution.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legal Basis */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-foreground">
                  <Icon icon={JusticeScale01Icon} size={20} color="currentColor" className="text-blue-600" />
                  Relevant Consumer Rights
                </CardTitle>
                {analysis.legalBasis.length > 1 && (
                  <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300">
                    {analysis.legalBasis.length} rights identified
                  </Badge>
                )}
              </div>
              {analysis.legalBasis.length > 1 && (
                <CardDescription className="text-xs mt-1.5">
                  Multiple legal rights strengthen your case. You can reference all of these in your complaint.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.legalBasis.map((law, index) => {
                const isStrong = law.strength === "strong"
                const isModerate = law.strength === "moderate"
                const isSupportive = law.strength === "supportive"
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "relative p-4 rounded-lg border transition-all",
                      isStrong && "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900",
                      isModerate && "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900",
                      isSupportive && "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900",
                      !law.strength && "bg-muted/50 border-border"
                    )}
                  >
                    {/* Number badge for multiple rights */}
                    {analysis.legalBasis.length > 1 && (
                      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-background border-2 border-current flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h4 className="font-semibold text-sm text-foreground">{law.law}</h4>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs font-mono shrink-0",
                              isStrong && "border-green-300 text-green-700 dark:border-green-700 dark:text-green-300",
                              isModerate && "border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300",
                              isSupportive && "border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300"
                            )}
                          >
                            {law.section}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{law.summary}</p>
                      </div>
                      
                      {law.strength && (
                        <Badge
                          className={cn(
                            "text-xs font-medium shrink-0",
                            isStrong && "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
                            isModerate && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
                            isSupportive && "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
                          )}
                        >
                          {law.strength === "strong" && "Strong"}
                          {law.strength === "moderate" && "Moderate"}
                          {law.strength === "supportive" && "Supportive"}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Visual indicator bar */}
                    <div className={cn(
                      "h-1 rounded-full mt-3",
                      isStrong && "bg-green-300 dark:bg-green-700",
                      isModerate && "bg-yellow-300 dark:bg-yellow-700",
                      isSupportive && "bg-blue-300 dark:bg-blue-700",
                      !law.strength && "bg-muted"
                    )} />
                  </div>
                )
              })}
              
              {analysis.legalBasis.length > 1 && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Icon icon={BulbIcon} size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Multiple Rights Strengthen Your Complaint
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Referencing multiple consumer rights in your complaint demonstrates a strong legal foundation and increases the likelihood of a favorable resolution.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evidence Analysis */}
          {analysis.evidenceAnalysis && analysis.evidenceAnalysis.analyses.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-foreground">
                  <Icon icon={Image01Icon} size={20} color="currentColor" className="text-purple-600" />
                  Evidence Analysis
                </CardTitle>
                <CardDescription>{analysis.evidenceAnalysis.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.evidenceAnalysis.analyses.map((evidence, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-foreground">{evidence.fileName}</span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {evidence.type}
                        </Badge>
                        <Badge
                          className={cn(
                            "text-xs",
                            evidence.strength === "strong" && "bg-green-100 text-green-700",
                            evidence.strength === "moderate" && "bg-yellow-100 text-yellow-700",
                            evidence.strength === "weak" && "bg-gray-100 text-gray-700",
                          )}
                        >
                          {evidence.strength}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{evidence.description}</p>
                    {evidence.relevantDetails.length > 0 && (
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {evidence.relevantDetails.map((detail, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-green-600">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Company Intelligence */}
          {(formData.companyResearch || analysis.companyIntelligence) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-foreground">
                  <Icon icon={Building01Icon} size={20} color="currentColor" className="text-blue-600" />
                  Company Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Company Info */}
                {formData.companyResearch?.company && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CompanyLogo
                        companyName={formData.companyResearch.company.name}
                        domain={formData.companyResearch.company.domain}
                        size={32}
                        showFallback={true}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground">{formData.companyResearch.company.name}</p>
                        {formData.companyResearch.company.domain && (
                          <p className="text-xs text-muted-foreground mt-0.5">{formData.companyResearch.company.domain}</p>
                        )}
                        {formData.companyResearch.company.description && (
                          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{formData.companyResearch.company.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Similar Complaints Found */}
                {formData.companyResearch?.complaints && formData.companyResearch.complaints.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Icon icon={AlertCircleIcon} size={12} />
                      Similar Complaints Found ({formData.companyResearch.complaints.length})
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {formData.companyResearch.complaints.slice(0, 5).map((complaint, i) => (
                        <div key={i} className="p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded text-xs">
                          <p className="font-medium text-foreground mb-1">{complaint.title}</p>
                          {complaint.summary && (
                            <p className="text-muted-foreground line-clamp-2">{complaint.summary}</p>
                          )}
                          {complaint.url && (
                            <a
                              href={complaint.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                            >
                              <Icon icon={LinkSquare01Icon} size={10} />
                              View source
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                    {formData.companyResearch.complaints.length > 5 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        +{formData.companyResearch.complaints.length - 5} more complaints found
                      </p>
                    )}
                  </div>
                )}

                {/* Risk Assessment */}
                {analysis.companyIntelligence && (
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Response Risk Assessment</span>
                      <Badge
                        className={cn(
                          "text-xs font-medium",
                          analysis.companyIntelligence.riskLevel === "low" && "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300",
                          analysis.companyIntelligence.riskLevel === "medium" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-300",
                          analysis.companyIntelligence.riskLevel === "high" && "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300",
                        )}
                      >
                        {analysis.companyIntelligence.riskLevel === "low" && "Low Risk"}
                        {analysis.companyIntelligence.riskLevel === "medium" && "Medium Risk"}
                        {analysis.companyIntelligence.riskLevel === "high" && "High Risk"}
                      </Badge>
                    </div>
                    {analysis.companyIntelligence.complaintPatterns && analysis.companyIntelligence.complaintPatterns.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1.5">Common patterns identified:</p>
                        <ul className="text-xs space-y-1">
                          {analysis.companyIntelligence.complaintPatterns.map((pattern, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-muted-foreground mt-0.5">•</span>
                              <span className="text-foreground">{pattern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.companyIntelligence.notes && analysis.companyIntelligence.notes !== "Unable to gather company intelligence at this time." && (
                      <p className="text-xs text-muted-foreground italic mt-2">{analysis.companyIntelligence.notes}</p>
                    )}
                  </div>
                )}

                {/* Show message if no data available */}
                {!formData.companyResearch && (!analysis.companyIntelligence || analysis.companyIntelligence.notes === "Unable to gather company intelligence at this time.") && (
                  <div className="text-center py-4">
                    <Icon icon={Building01Icon} size={24} className="text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">Company intelligence data not available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          {formData.companyResearch?.contacts && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-foreground">
                  <Icon icon={Mail01Icon} size={20} color="currentColor" className="text-green-600" />
                  Contact Information Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.companyResearch.contacts.emails && formData.companyResearch.contacts.emails.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Icon icon={Mail01Icon} size={12} />
                      Contact Emails (sorted by usefulness)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.companyResearch.contacts.emails.map((email, i) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className={cn(
                            "font-mono text-xs",
                            i === 0 && "bg-green-50 border-green-300 text-green-700 dark:bg-green-950/30 dark:border-green-700 dark:text-green-300"
                          )}
                        >
                          {email}
                          {i === 0 && <span className="ml-1.5 text-[10px] bg-green-200 dark:bg-green-800 px-1.5 py-0.5 rounded">Best</span>}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {formData.companyResearch.contacts.executiveContacts && formData.companyResearch.contacts.executiveContacts.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Icon icon={UserMultiple02Icon} size={12} />
                      Key Executives (for escalation)
                    </p>
                    <div className="space-y-2">
                      {formData.companyResearch.contacts.executiveContacts.map((exec, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">{exec.name}</p>
                            <p className="text-xs text-muted-foreground">{exec.title}</p>
                            {exec.email && (
                              <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-0.5">{exec.email}</p>
                            )}
                          </div>
                          {exec.linkedIn && (
                            <a
                              href={exec.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-300 hover:underline flex items-center gap-1 shrink-0"
                            >
                              <Icon icon={LinkSquare01Icon} size={14} />
                              <span className="text-xs">LinkedIn</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Generate Letter Section */}
          <Card className="border-2 border-peach-200 dark:border-peach-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <Icon icon={Edit02Icon} size={20} color="currentColor" className="text-peach-500" />
                Generate Your Complaint Letter
              </CardTitle>
              <CardDescription>
                Our AI will create a professional, legally-informed complaint letter tailored to your case
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                variant="coral"
                size="lg"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Icon icon={Loading03Icon} size={18} className="mr-2 animate-spin" />
                    Generating Your Letter...
                  </>
                ) : (
                  <>
                    <Icon icon={Edit02Icon} size={18} className="mr-2" />
                    Generate My Complaint Letter
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="letter" className="space-y-4 mt-4">
          {generatedLetter && (
            <>
              {/* Action Buttons */}
              <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
                <CardContent className="pt-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      className="flex-1 gap-2 bg-white hover:bg-gray-50"
                    >
                      <Icon icon={Copy01Icon} size={16} />
                      {copied ? "Copied!" : "Copy to Clipboard"}
                    </Button>
                    <Button
                      onClick={handleEmailClick}
                      variant="coral"
                      className="flex-1 gap-2"
                    >
                      <Icon icon={Mail01Icon} size={16} />
                      {companyEmail ? `Email ${formData.companyName}` : "Open in Email"}
                    </Button>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <Button
                      onClick={() => handleDownload("txt")}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 bg-white hover:bg-gray-50"
                    >
                      <Icon icon={Download01Icon} size={14} />
                      Download .txt
                    </Button>
                    <Button
                      onClick={() => handleDownload("docx")}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 bg-white hover:bg-gray-50"
                    >
                      <Icon icon={File01Icon} size={14} />
                      Download .doc
                    </Button>
                  </div>
                  {companyEmail && (
                    <p className="text-xs text-green-700 dark:text-green-300 mt-3 flex items-center gap-1">
                      <Icon icon={CheckmarkCircle01Icon} size={14} />
                      Ready to send to: <span className="font-mono">{companyEmail}</span>
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Letter Preview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-foreground">
                    <Icon icon={File01Icon} size={20} color="currentColor" className="text-foreground" />
                    Your Complaint Letter
                  </CardTitle>
                  <CardDescription>Review and edit if needed before sending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Textarea
                      value={generatedLetter}
                      onChange={(e) => setGeneratedLetter(e.target.value)}
                      className="min-h-[500px] font-mono text-sm leading-relaxed p-4 bg-white dark:bg-gray-950 border-2"
                      placeholder="Your generated letter will appear here..."
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Remember to replace [Your Full Name], [Your Address], [Your Email], and [Your Phone Number] with your actual details before sending.
                  </p>
                </CardContent>
              </Card>

              {/* Regenerate Option */}
              <div className="text-center">
                <Button
                  onClick={handleGenerate}
                  variant="ghost"
                  size="sm"
                  disabled={isGenerating}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon icon={Edit02Icon} size={14} className="mr-2" />
                  Regenerate Letter
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Case Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <Icon icon={File01Icon} size={20} color="currentColor" className="text-muted-foreground" />
            Case Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground block text-xs">Company</span>
              <span className="font-medium text-foreground">{formData.companyName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Incident Date</span>
              <span className="font-medium text-foreground">
                {formData.incidentDate ? format(formData.incidentDate, "PPP") : "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Amount</span>
              <span className="font-medium font-mono text-foreground">
                {currency}
                {Number.parseFloat(formData.purchaseAmount || "0").toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Desired Outcome</span>
              <span className="font-medium text-foreground">{formatOutcomeLabel(formData.desiredOutcome || "")}</span>
            </div>
            {formData.incidentCountry && (
              <div>
                <span className="text-muted-foreground block text-xs">Incident Location</span>
                <span className="font-medium text-foreground">{formData.incidentCountry}</span>
              </div>
            )}
            {formData.paymentMethod && (
              <div>
                <span className="text-muted-foreground block text-xs">Payment Method</span>
                <span className="font-medium capitalize text-foreground">{formData.paymentMethod.replace("-", " ")}</span>
              </div>
            )}
          </div>
          {formData.evidence.length > 0 && (
            <div className="pt-2 border-t">
              <span className="text-muted-foreground block text-xs mb-2">Evidence ({formData.evidence.length} files)</span>
              <div className="flex flex-wrap gap-2">
                {formData.evidence.map((file, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {file.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
