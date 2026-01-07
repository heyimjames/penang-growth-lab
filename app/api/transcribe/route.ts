import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: NextRequest) {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured", text: "" },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided", text: "" },
        { status: 400 }
      )
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    })

    // Convert File to the format OpenAI expects
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en", // Can be made dynamic based on user preference
      response_format: "text",
    })

    return NextResponse.json({
      text: transcription,
      success: true,
    })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to transcribe audio",
        text: "" 
      },
      { status: 500 }
    )
  }
}




