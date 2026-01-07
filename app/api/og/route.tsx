import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const company = searchParams.get("company") || "Company"

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Mesh gradient background with peachy/orange colors */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#FF8B70",
          }}
        />
        {/* Gradient blob 1 - top left */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "60%",
            height: "80%",
            background: "radial-gradient(circle, #FF7759 0%, transparent 70%)",
            opacity: 0.8,
          }}
        />
        {/* Gradient blob 2 - center right */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "-10%",
            width: "50%",
            height: "70%",
            background: "radial-gradient(circle, #FFAA90 0%, transparent 70%)",
            opacity: 0.9,
          }}
        />
        {/* Gradient blob 3 - bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "20%",
            width: "70%",
            height: "80%",
            background: "radial-gradient(circle, #FF6B4A 0%, transparent 70%)",
            opacity: 0.7,
          }}
        />
        {/* Gradient blob 4 - top center */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "40%",
            width: "40%",
            height: "50%",
            background: "radial-gradient(circle, #FFB299 0%, transparent 70%)",
            opacity: 0.8,
          }}
        />
        {/* Subtle overlay for depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(255,119,89,0.3) 0%, rgba(255,150,120,0.2) 50%, rgba(255,100,70,0.3) 100%)",
          }}
        />

        {/* Shield logo - top right */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "60px",
            display: "flex",
          }}
        >
          <svg
            width="120"
            height="140"
            viewBox="0 0 24 28"
            fill="none"
            style={{ opacity: 0.95 }}
          >
            <path
              d="M12 1L2 5V12C2 18.075 6.275 23.675 12 25C17.725 23.675 22 18.075 22 12V5L12 1Z"
              fill="white"
              fillOpacity="0.25"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 13L11 16L16 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Main content - left aligned */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
            height: "100%",
            width: "100%",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "9999px",
              padding: "10px 20px",
              marginBottom: "32px",
              width: "fit-content",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <span style={{ fontSize: "18px", color: "white", fontWeight: "500" }}>
              UK Consumer Rights
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "52px",
              fontWeight: "bold",
              color: "white",
              margin: "0 0 12px 0",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 20px rgba(0,0,0,0.1)",
            }}
          >
            How to Complain to
          </h1>
          <h2
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "white",
              margin: "0 0 32px 0",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 20px rgba(0,0,0,0.15)",
              maxWidth: "900px",
            }}
          >
            {company}
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: "26px",
              color: "rgba(255,255,255,0.9)",
              margin: 0,
              maxWidth: "700px",
              lineHeight: 1.4,
            }}
          >
            AI-powered complaint letters with legal backing. Get results.
          </p>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "50px",
              left: "80px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <span style={{ color: "white", fontSize: "26px", fontWeight: "bold" }}>N</span>
            </div>
            <span style={{ fontSize: "28px", fontWeight: "600", color: "white" }}>
              noreply.uk
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
