import { NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"
import {
  approveFeatureRequest,
  rejectFeatureRequest,
  getFeatureRequest,
} from "@/lib/actions/feature-requests"

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET

/**
 * Verify Slack request signature
 */
function verifySlackSignature(
  signature: string,
  timestamp: string,
  body: string
): boolean {
  if (!SLACK_SIGNING_SECRET) {
    console.warn("Slack signing secret not configured")
    return false
  }

  // Verify timestamp is within 5 minutes
  const currentTime = Math.floor(Date.now() / 1000)
  if (Math.abs(currentTime - parseInt(timestamp)) > 60 * 5) {
    console.warn("Slack request timestamp too old")
    return false
  }

  // Create signature
  const sigBasestring = `v0:${timestamp}:${body}`
  const mySignature =
    "v0=" +
    createHmac("sha256", SLACK_SIGNING_SECRET)
      .update(sigBasestring)
      .digest("hex")

  // Compare signatures
  try {
    return timingSafeEqual(
      Buffer.from(mySignature),
      Buffer.from(signature)
    )
  } catch {
    return false
  }
}

/**
 * Send a message update to Slack
 */
async function updateSlackMessage(
  responseUrl: string,
  text: string,
  blocks?: unknown[]
): Promise<void> {
  await fetch(responseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      replace_original: true,
      text,
      blocks,
    }),
  })
}

/**
 * Handle Slack interactive components (button clicks)
 */
export async function POST(request: Request) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text()

    // Get signature headers
    const signature = request.headers.get("x-slack-signature") || ""
    const timestamp = request.headers.get("x-slack-request-timestamp") || ""

    // Verify signature (skip in development if not configured)
    if (SLACK_SIGNING_SECRET) {
      if (!verifySlackSignature(signature, timestamp, rawBody)) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        )
      }
    }

    // Parse the payload
    const params = new URLSearchParams(rawBody)
    const payloadStr = params.get("payload")

    if (!payloadStr) {
      return NextResponse.json(
        { error: "Missing payload" },
        { status: 400 }
      )
    }

    const payload = JSON.parse(payloadStr)
    const action = payload.actions?.[0]

    if (!action) {
      return NextResponse.json(
        { error: "No action found" },
        { status: 400 }
      )
    }

    const featureRequestId = action.value
    const actionId = action.action_id
    const responseUrl = payload.response_url
    const userName = payload.user?.name || "Someone"

    // Handle approve action
    if (actionId === "approve_feature") {
      const success = await approveFeatureRequest(
        featureRequestId,
        payload.message?.ts
      )

      if (success) {
        const request = await getFeatureRequest(featureRequestId)

        // Update the Slack message
        await updateSlackMessage(
          responseUrl,
          `✅ *Approved* by ${userName}`,
          [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `✅ *${request?.title || "Feature Request"}* was approved by ${userName}\n\n🚀 Building with Claude...`,
              },
            },
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: `<${process.env.NEXT_PUBLIC_SITE_URL}/roadmap?highlight=${featureRequestId}|View in Roadmap>`,
                },
              ],
            },
          ]
        )

        return NextResponse.json({ ok: true })
      } else {
        await updateSlackMessage(
          responseUrl,
          "❌ Failed to approve feature request"
        )
        return NextResponse.json({ error: "Failed to approve" }, { status: 500 })
      }
    }

    // Handle reject action
    if (actionId === "reject_feature") {
      // For now, use a default rejection reason
      // In the future, this could open a modal for custom reasons
      const reason = "Not aligned with current product direction"
      const success = await rejectFeatureRequest(featureRequestId, reason)

      if (success) {
        const request = await getFeatureRequest(featureRequestId)

        // Update the Slack message
        await updateSlackMessage(
          responseUrl,
          `❌ *Rejected* by ${userName}`,
          [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `❌ *${request?.title || "Feature Request"}* was rejected by ${userName}\n\n_Reason: ${reason}_`,
              },
            },
          ]
        )

        return NextResponse.json({ ok: true })
      } else {
        await updateSlackMessage(
          responseUrl,
          "❌ Failed to reject feature request"
        )
        return NextResponse.json({ error: "Failed to reject" }, { status: 500 })
      }
    }

    // Unknown action
    return NextResponse.json(
      { error: "Unknown action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Slack webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Handle Slack URL verification (for initial setup)
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const challenge = url.searchParams.get("challenge")

  if (challenge) {
    return NextResponse.json({ challenge })
  }

  return NextResponse.json({ status: "ok" })
}
