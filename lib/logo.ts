/**
 * Get the best available logo URL for a domain
 * Uses logo.dev if token available, falls back to Google favicons
 */
export function getLogoUrl(domain: string, size: number = 64): string {
  const logoDevToken = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN
  
  if (logoDevToken) {
    return `https://img.logo.dev/${domain}?token=${logoDevToken}&size=${Math.min(size * 2, 256)}&format=png`
  }
  
  // Fallback to Google's favicon service
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${Math.min(size * 2, 128)}`
}

/**
 * Get fallback logo URL (Google favicons) - useful when primary fails
 */
export function getFallbackLogoUrl(domain: string, size: number = 64): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${Math.min(size * 2, 128)}`
}
