"use client"

import { useEffect, useRef, useState } from "react"
import createGlobe from "cobe"

interface LocationMarker {
  location: [number, number]
  size: number
  label: string
  delay: number
}

const locations: LocationMarker[] = [
  { location: [51.5074, -0.1278], size: 0.08, label: "UK", delay: 0 },
  { location: [48.8566, 2.3522], size: 0.06, label: "EU", delay: 800 },
  { location: [40.7128, -74.006], size: 0.07, label: "US", delay: 1600 },
  { location: [-33.8688, 151.2093], size: 0.06, label: "AU", delay: 2400 },
  { location: [35.6762, 139.6503], size: 0.05, label: "JP", delay: 3200 },
  { location: [55.7558, 37.6173], size: 0.05, label: "RU", delay: 4000 },
  { location: [-23.5505, -46.6333], size: 0.05, label: "BR", delay: 4800 },
  { location: [1.3521, 103.8198], size: 0.04, label: "SG", delay: 5600 },
  { location: [28.6139, 77.2090], size: 0.05, label: "IN", delay: 6400 },
  { location: [19.4326, -99.1332], size: 0.05, label: "MX", delay: 7200 },
  { location: [-34.6037, -58.3816], size: 0.05, label: "AR", delay: 8000 },
  { location: [-25.2744, 133.7751], size: 0.04, label: "AU2", delay: 8800 },
  { location: [43.6532, -79.3832], size: 0.05, label: "CA", delay: 9600 },
  { location: [52.5200, 13.4050], size: 0.05, label: "DE", delay: 10400 },
  { location: [45.4642, 9.1900], size: 0.05, label: "IT", delay: 11200 },
  { location: [41.9028, 12.4964], size: 0.05, label: "IT2", delay: 12000 },
  { location: [39.9042, 116.4074], size: 0.05, label: "CN", delay: 12800 },
  { location: [37.5665, 126.9780], size: 0.05, label: "KR", delay: 13600 },
  { location: [-26.2041, 28.0473], size: 0.05, label: "ZA", delay: 14400 },
  { location: [25.2048, 55.2708], size: 0.04, label: "AE", delay: 15200 },
]

export function GlobalSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const [visibleLabels, setVisibleLabels] = useState<string[]>([])
  const phiRef = useRef(0)

  useEffect(() => {
    // Animate labels appearing one by one
    const timers: NodeJS.Timeout[] = []
    locations.forEach((loc) => {
      const timer = setTimeout(() => {
        setVisibleLabels((prev) => [...prev, loc.label])
      }, loc.delay)
      timers.push(timer)
    })

    return () => timers.forEach((t) => clearTimeout(t))
  }, [])

  useEffect(() => {
    let width = 0
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }
    window.addEventListener("resize", onResize)
    onResize()

    if (!canvasRef.current) return

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 4,
      baseColor: [0.92, 0.94, 0.93], // Light forest tint
      markerColor: [0.93, 0.52, 0.41], // Peach color
      glowColor: [0.92, 0.94, 0.93], // Match base color to reduce white glow
      markers: locations.map((loc) => ({
        location: loc.location,
        size: loc.size,
      })),
      onRender: (state) => {
        // Auto-rotate when not dragging
        if (!pointerInteracting.current) {
          phiRef.current += 0.003
        }
        state.phi = phiRef.current + pointerInteractionMovement.current
        state.width = width * 2
        state.height = width * 2
      },
    })

    // Fade in
    if (canvasRef.current) {
      canvasRef.current.style.opacity = "0"
      setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.style.opacity = "1"
        }
      }, 100)
    }

    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <section className="py-16 md:py-24 border-b border-forest-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <div className="text-xs text-forest-400 font-mono tracking-widest">
              [ 04 / 06 ]
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-display">
              Global Reach,
              <br />
              <span className="text-peach-400">Local Knowledge</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Consumer rights vary by country. Our AI understands local
              regulations, from UK Consumer Rights Act to EU directives,
              Australian Consumer Law to US state protections.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-forest-500 font-display">
                  50+
                </div>
                <div className="text-sm text-muted-foreground">
                  Countries covered
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-forest-500 font-display">
                  200+
                </div>
                <div className="text-sm text-muted-foreground">
                  Consumer laws indexed
                </div>
              </div>
            </div>

            {/* Animated location tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              {locations.map((loc) => (
                <span
                  key={loc.label}
                  className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border transition-all duration-500 ${
                    visibleLabels.includes(loc.label)
                      ? "opacity-100 translate-y-0 bg-forest-50 border-forest-200 text-forest-600"
                      : "opacity-0 translate-y-2 bg-transparent border-transparent text-transparent"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-peach-400 mr-2" />
                  {loc.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Globe */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] overflow-visible">
              {/* Concentric circles behind globe */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
                {[1, 2, 3, 4, 5, 6].map((ring) => (
                  <div
                    key={ring}
                    className="absolute rounded-full border-2 border-forest-200"
                    style={{
                      width: `${50 + ring * 18}%`,
                      height: `${50 + ring * 18}%`,
                      opacity: 0.3 - ring * 0.04,
                    }}
                  />
                ))}
              </div>

              {/* Globe canvas */}
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-1000 rounded-full"
                style={{
                  maxWidth: "100%",
                }}
                onPointerDown={(e) => {
                  pointerInteracting.current = e.clientX - pointerInteractionMovement.current
                  if (canvasRef.current) {
                    canvasRef.current.style.cursor = "grabbing"
                  }
                }}
                onPointerUp={() => {
                  pointerInteracting.current = null
                  if (canvasRef.current) {
                    canvasRef.current.style.cursor = "grab"
                  }
                }}
                onPointerOut={() => {
                  pointerInteracting.current = null
                  if (canvasRef.current) {
                    canvasRef.current.style.cursor = "grab"
                  }
                }}
                onMouseMove={(e) => {
                  if (pointerInteracting.current !== null) {
                    const delta = e.clientX - pointerInteracting.current
                    pointerInteractionMovement.current = delta / 100
                  }
                }}
                onTouchMove={(e) => {
                  if (pointerInteracting.current !== null && e.touches[0]) {
                    const delta = e.touches[0].clientX - pointerInteracting.current
                    pointerInteractionMovement.current = delta / 100
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
