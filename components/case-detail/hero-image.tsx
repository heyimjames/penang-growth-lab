"use client"

import { useState } from "react"
import Image from "next/image"

interface HeroImageProps {
  ogImageUrl: string | null
  fallbackImageUrl: string
  companyName: string
  domain: string | null
}

export function HeroImage({ ogImageUrl, fallbackImageUrl, companyName, domain }: HeroImageProps) {
  const [imageError, setImageError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(ogImageUrl || fallbackImageUrl)

  const handleError = () => {
    if (!imageError && currentSrc !== fallbackImageUrl) {
      setImageError(true)
      setCurrentSrc(fallbackImageUrl)
    }
  }

  return (
    <Image
      src={currentSrc}
      alt={`${companyName} website preview`}
      fill
      className="object-cover"
      unoptimized
      onError={handleError}
    />
  )
}




