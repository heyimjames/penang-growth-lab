import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")
  const next = searchParams.get("next") ?? "/dashboard"

  // Handle errors from Supabase
  if (error) {
    const errorMessage = errorDescription || error
    return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(errorMessage)}`)
  }

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      // Check if user has completed onboarding
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("user_id", user.id)
          .single()

        // Redirect new users to onboarding (unless they have a specific destination)
        if (!profile?.onboarding_completed && next === "/dashboard") {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }

    // If there was an error exchanging the code, redirect to error page
    return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(exchangeError.message)}`)
  }

  // No code provided, redirect to login
  return NextResponse.redirect(`${origin}/auth/login`)
}
