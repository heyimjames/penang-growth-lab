import { createServerClient } from "@supabase/ssr"
import { cookies, headers } from "next/headers"

/**
 * Creates a Supabase client for API routes that supports both cookie-based
 * and token-based (Authorization header) authentication.
 *
 * This is needed for the Chrome extension which uses token-based auth.
 */
export async function createApiClient() {
  const cookieStore = await cookies()
  const headersList = await headers()
  const authHeader = headersList.get("authorization")

  // Check for Bearer token in Authorization header
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)

    // Create client with the access token
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {},
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    return supabase
  }

  // Fall back to cookie-based auth
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore - Server Component context
          }
        },
      },
    }
  )
}
