"use client"

import { getRandomEarthAsset } from "@/lib/earth"
import { useState, useEffect } from "react"
import Image from "next/image"

interface EarthStickerProps {
  size?: number
  className?: string
  animate?: boolean
}

export function EarthSticker({ size = 80, className = "", animate = true }: EarthStickerProps) {
  const [src, setSrc] = useState<string>(() => getRandomEarthAsset())
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setSrc(getRandomEarthAsset())
    setImgError(false)
  }, [])

  // Fallback emoji if image fails to load
  if (imgError) {
    return (
      <div className={`flex items-center justify-center text-4xl ${className}`} style={{ width: size, height: size }}>
        🌍
      </div>
    )
  }

  return (
    <div className={`${animate ? "animate-float" : ""} ${className}`}>
      <Image
        src={src}
        alt="Eco character"
        width={size}
        height={size}
        className="object-contain"
        onError={() => setImgError(true)}
        unoptimized
      />
    </div>
  )
}
