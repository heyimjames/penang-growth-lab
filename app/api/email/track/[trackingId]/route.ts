import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// 1x1 transparent GIF
const TRACKING_PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  const { trackingId } = await params

  // Create client inside function to avoid build-time initialization
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Update email record with open tracking
    const { data: emailRecord } = await supabase
      .from("sent_emails")
      .select("id, open_count, opened_at")
      .eq("tracking_id", trackingId)
      .single()

    if (emailRecord) {
      const updates: {
        open_count: number
        status: string
        opened_at?: string
      } = {
        open_count: (emailRecord.open_count || 0) + 1,
        status: "opened",
      }

      // Only set opened_at on first open
      if (!emailRecord.opened_at) {
        updates.opened_at = new Date().toISOString()
      }

      await supabase
        .from("sent_emails")
        .update(updates)
        .eq("id", emailRecord.id)
    }
  } catch (error) {
    // Don't fail the request if tracking fails
    console.error("Tracking error:", error)
  }

  // Always return the pixel, even if tracking fails
  return new NextResponse(TRACKING_PIXEL, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  })
}
