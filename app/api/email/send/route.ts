import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Email sending via Resend (or mock for development)
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  replyTo?: string
): Promise<{ id: string; success: boolean; error?: string }> {
  // Check if Resend API key is configured
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    // Mock send for development
    console.log("📧 Mock email sent:", { to, subject })
    return { id: `mock-${Date.now()}`, success: true }
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "NoReply <complaints@noreply.app>",
        to: [to],
        subject,
        html,
        reply_to: replyTo,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { id: "", success: false, error: error.message || "Failed to send email" }
    }

    const data = await response.json()
    return { id: data.id, success: true }
  } catch (error) {
    console.error("Email send error:", error)
    return { id: "", success: false, error: "Network error sending email" }
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { caseId, letterId, recipientEmail, recipientName, subject, letterBody, userEmail } = body

    if (!caseId || !recipientEmail || !subject || !letterBody) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify case belongs to user
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select("id, company_name")
      .eq("id", caseId)
      .eq("user_id", user.id)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 })
    }

    // Create tracking record first
    const { data: emailRecord, error: insertError } = await supabase
      .from("sent_emails")
      .insert({
        case_id: caseId,
        user_id: user.id,
        letter_id: letterId || null,
        recipient_email: recipientEmail,
        recipient_name: recipientName || null,
        subject,
        body_preview: letterBody.slice(0, 200),
        status: "pending",
      })
      .select()
      .single()

    if (insertError || !emailRecord) {
      console.error("Error creating email record:", insertError)
      return NextResponse.json({ error: "Failed to create email record" }, { status: 500 })
    }

    // Build tracking pixel URL
    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/email/track/${emailRecord.tracking_id}`

    // Build HTML email with tracking pixel
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .letter-body { white-space: pre-wrap; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="letter-body">${letterBody.replace(/\n/g, "<br>")}</div>
        <div class="footer">
          <p>This complaint was generated with the assistance of <a href="https://noreply.app">NoReply</a>, an AI-powered consumer rights platform.</p>
        </div>
        <img src="${trackingUrl}" width="1" height="1" style="display:none" alt="" />
      </body>
      </html>
    `

    // Send the email
    const sendResult = await sendEmail(
      recipientEmail,
      subject,
      htmlBody,
      userEmail || user.email || undefined
    )

    // Update email record with send status
    const updateData: {
      status: string
      provider_message_id?: string
      error_message?: string
      sent_at?: string
    } = {
      status: sendResult.success ? "sent" : "failed",
      provider_message_id: sendResult.id || null,
      error_message: sendResult.error || null,
    }

    if (sendResult.success) {
      updateData.sent_at = new Date().toISOString()
    }

    await supabase
      .from("sent_emails")
      .update(updateData)
      .eq("id", emailRecord.id)

    // Update case to track letter was sent
    await supabase
      .from("cases")
      .update({
        status: "sent",
        letter_sent_at: new Date().toISOString(),
        emails_sent_count: (await supabase
          .from("cases")
          .select("emails_sent_count")
          .eq("id", caseId)
          .single()
          .then(r => (r.data?.emails_sent_count || 0) + 1)),
      })
      .eq("id", caseId)

    if (!sendResult.success) {
      return NextResponse.json(
        { error: sendResult.error || "Failed to send email", emailId: emailRecord.id },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      emailId: emailRecord.id,
      trackingId: emailRecord.tracking_id,
      messageId: sendResult.id,
    })
  } catch (error) {
    console.error("Email send endpoint error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
