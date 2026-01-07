import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface EvidenceFile {
  name: string
  type: string
  base64: string
}

interface EvidenceAnalysis {
  type: "receipt" | "communication" | "damage" | "contract" | "screenshot" | "photo" | "video" | "document" | "other"
  description: string
  relevantDetails: string[]
  extractedText?: string
  suggestedUse: string
  strength: "strong" | "moderate" | "weak"
}

// Map MIME types to Gemini-supported formats
function getGeminiMimeType(fileType: string): string {
  const mimeMap: Record<string, string> = {
    // Images
    "image/jpeg": "image/jpeg",
    "image/jpg": "image/jpeg",
    "image/png": "image/png",
    "image/gif": "image/gif",
    "image/webp": "image/webp",
    "image/heic": "image/heic",
    "image/heif": "image/heif",
    // Videos
    "video/mp4": "video/mp4",
    "video/mpeg": "video/mpeg",
    "video/mov": "video/mov",
    "video/quicktime": "video/quicktime",
    "video/avi": "video/avi",
    "video/x-msvideo": "video/x-msvideo",
    "video/webm": "video/webm",
    // Documents
    "application/pdf": "application/pdf",
  }
  return mimeMap[fileType] || fileType
}

// Check if file type is supported by Gemini
function isSupportedFileType(fileType: string): boolean {
  const supportedTypes = [
    // Images
    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/heic", "image/heif",
    // Videos
    "video/mp4", "video/mpeg", "video/mov", "video/quicktime", "video/avi", "video/x-msvideo", "video/webm",
    // Documents
    "application/pdf",
  ]
  return supportedTypes.includes(fileType)
}

export async function POST(request: NextRequest) {
  try {
    const { files, complaint, companyName } = await request.json()

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY

    if (!GOOGLE_AI_API_KEY) {
      // Return mock analysis if no API key
      return NextResponse.json({
        analyses: files.map((file: EvidenceFile) => ({
          fileName: file.name,
          type: "other" as const,
          description: "Evidence file uploaded",
          relevantDetails: ["File uploaded as supporting evidence"],
          suggestedUse: "Include as supporting documentation in your complaint",
          strength: "moderate" as const,
        })),
        summary: "Evidence files have been collected. They will be referenced in your complaint letter.",
        mock: true,
      })
    }

    const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Analyze each file with Gemini
    const analyses: (EvidenceAnalysis & { fileName: string })[] = []

    for (const file of files as EvidenceFile[]) {
      const isSupported = isSupportedFileType(file.type)

      if (!isSupported) {
        // Handle unsupported file types
        analyses.push({
          fileName: file.name,
          type: "other",
          description: "Document uploaded",
          relevantDetails: ["Document uploaded as supporting evidence"],
          suggestedUse: "Reference this file in your complaint as supporting evidence",
          strength: "moderate",
        })
        continue
      }

      const isVideo = file.type.startsWith("video/")
      const isPdf = file.type === "application/pdf"
      const isImage = file.type.startsWith("image/")

      try {
        const mimeType = getGeminiMimeType(file.type)

        const prompt = `You are analyzing evidence for a consumer complaint case.

Context:
- Company involved: ${companyName || "Unknown"}
- Complaint summary: ${complaint || "Not provided"}
- File type: ${isVideo ? "Video" : isPdf ? "PDF Document" : "Image"}

Analyze this ${isVideo ? "video" : isPdf ? "document" : "image"} and provide:
1. What type of evidence this is (receipt, communication/email/chat, damage photo/video, contract/terms, screenshot, general photo, video recording, document, or other)
2. A brief description of what the ${isVideo ? "video" : isPdf ? "document" : "image"} shows
3. Key relevant details that could support the consumer's case (dates, amounts, names, damage visible, promises made, etc.)
4. Any text you can extract from the ${isVideo ? "video" : isPdf ? "document" : "image"} (if applicable)
5. How this evidence could be used in the complaint
6. How strong this evidence is for supporting the case

${isVideo ? "For videos: Focus on key moments, any visible damage, dates/timestamps shown, and any dialogue or text visible." : ""}
${isPdf ? "For documents: Extract key terms, dates, amounts, and any clauses relevant to consumer rights." : ""}

Respond ONLY with valid JSON in this exact format:
{
  "type": "receipt|communication|damage|contract|screenshot|photo|video|document|other",
  "description": "Brief description",
  "relevantDetails": ["Detail 1", "Detail 2"],
  "extractedText": "Any text visible (optional, can be empty string)",
  "suggestedUse": "How to use this evidence in the complaint",
  "strength": "strong|moderate|weak"
}`

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: mimeType,
              data: file.base64,
            },
          },
          { text: prompt },
        ])

        const response = await result.response
        const text = response.text()

        // Parse Gemini's response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]) as EvidenceAnalysis
          analyses.push({
            ...analysis,
            fileName: file.name,
          })
        } else {
          // Fallback if JSON parsing fails
          analyses.push({
            fileName: file.name,
            type: isVideo ? "video" : isPdf ? "document" : "photo",
            description: text.slice(0, 200),
            relevantDetails: ["Evidence analyzed"],
            suggestedUse: "Include as supporting evidence",
            strength: "moderate",
          })
        }
      } catch (analysisError) {
        const errorMessage = analysisError instanceof Error ? analysisError.message : String(analysisError)
        console.error(`Error analyzing file ${file.name}:`, {
          error: errorMessage,
          fileType: file.type,
          fileSize: file.base64?.length || 0,
        })
        analyses.push({
          fileName: file.name,
          type: "other",
          description: "Unable to analyze this file",
          relevantDetails: ["File uploaded as evidence"],
          suggestedUse: "Include as supporting documentation",
          strength: "weak",
        })
      }
    }

    // Generate overall summary
    const strongEvidence = analyses.filter((a) => a.strength === "strong")
    const hasReceipt = analyses.some((a) => a.type === "receipt")
    const hasCommunication = analyses.some((a) => a.type === "communication")
    const hasDamage = analyses.some((a) => a.type === "damage")
    const hasVideo = analyses.some((a) => a.type === "video")
    const hasDocument = analyses.some((a) => a.type === "document" || a.type === "contract")

    let summary = ""
    if (strongEvidence.length > 0) {
      summary = `You have ${strongEvidence.length} piece(s) of strong evidence. `
    }
    if (hasReceipt) {
      summary += "Receipt/payment evidence establishes the transaction. "
    }
    if (hasCommunication) {
      summary += "Communication evidence documents your interactions with the company. "
    }
    if (hasDamage) {
      summary += "Visual damage evidence supports your claims about the issue. "
    }
    if (hasVideo) {
      summary += "Video evidence provides compelling visual documentation. "
    }
    if (hasDocument) {
      summary += "Document evidence supports your legal position. "
    }
    if (!summary) {
      summary = "Your evidence has been analyzed and will be referenced in your complaint letter."
    }

    return NextResponse.json({
      analyses,
      summary: summary.trim(),
      evidenceStrength: strongEvidence.length >= 2 ? "strong" : strongEvidence.length === 1 ? "moderate" : "basic",
      mock: false,
    })
  } catch (error) {
    console.error("Evidence analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze evidence",
        analyses: [],
        summary: "Evidence files have been collected but could not be analyzed.",
        mock: true,
      },
      { status: 500 }
    )
  }
}
