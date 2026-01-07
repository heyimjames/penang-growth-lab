"use client"

import * as React from "react"
import { Icon } from "@/lib/icons"
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Building06Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

// Testimonial data structure
interface TrustedByTestimonial {
  companyName: string
  companyLogo?: React.ReactNode
  quote: string
  authorName: string
  authorTitle: string
  authorImage?: string
}

// Placeholder testimonials data
const testimonials: TrustedByTestimonial[] = [
  {
    companyName: "TechFlow",
    quote:
      "NoReply's AI-powered approach helped us resolve a complex supplier dispute in just 5 days. The letters were incredibly professional.",
    authorName: "Sarah Mitchell",
    authorTitle: "Operations Director, TechFlow",
  },
  {
    companyName: "CloudNine",
    quote:
      "We recovered over £2,400 from a cancelled subscription that the company refused to refund. The legal research was spot-on.",
    authorName: "James Parker",
    authorTitle: "CEO, CloudNine",
  },
  {
    companyName: "StartupHub",
    quote:
      "Finally, a tool that levels the playing field against big corporations. The AI found regulations we didn't even know existed.",
    authorName: "Emma Rodriguez",
    authorTitle: "Founder, StartupHub",
  },
  {
    companyName: "DesignStudio",
    quote:
      "Got a full refund on a faulty product after the company initially refused. NoReply made the process simple and effective.",
    authorName: "Michael Chen",
    authorTitle: "Creative Director, DesignStudio",
  },
  {
    companyName: "DataDriven",
    quote:
      "The GDPR analysis feature helped us understand our rights. We successfully requested data deletion from 3 companies.",
    authorName: "Olivia Brown",
    authorTitle: "Privacy Lead, DataDriven",
  },
]

// Individual testimonial card component
function TestimonialSlide({ testimonial }: { testimonial: TrustedByTestimonial }) {
  return (
    <div className="flex flex-col h-full p-6 lg:p-8 bg-white border border-forest-100 rounded-xl">
      {/* Company logo/name */}
      <div className="flex items-center gap-2 mb-6">
        {testimonial.companyLogo || (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-forest-100 flex items-center justify-center">
              <Icon icon={Building06Icon} size={18} className="text-forest-600" />
            </div>
            <span className="font-semibold text-foreground font-display">
              {testimonial.companyName}
            </span>
          </div>
        )}
      </div>

      {/* Quote */}
      <blockquote className="flex-1 text-foreground text-base lg:text-lg leading-relaxed mb-6">
        {testimonial.quote}
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-forest-50">
        {testimonial.authorImage ? (
          <img
            src={testimonial.authorImage}
            alt={testimonial.authorName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-forest-100 flex items-center justify-center text-forest-600 font-medium">
            {testimonial.authorName.charAt(0)}
          </div>
        )}
        <div>
          <div className="font-medium text-foreground">{testimonial.authorName}</div>
          <div className="text-sm text-muted-foreground">{testimonial.authorTitle}</div>
        </div>
      </div>
    </div>
  )
}

// Carousel navigation controls with dots
function CarouselControls({
  current,
  count,
  onPrevious,
  onNext,
  onDotClick,
  canScrollPrev,
  canScrollNext,
}: {
  current: number
  count: number
  onPrevious: () => void
  onNext: () => void
  onDotClick: (index: number) => void
  canScrollPrev: boolean
  canScrollNext: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full border-forest-200 hover:bg-forest-50 disabled:opacity-40"
        onClick={onPrevious}
        disabled={!canScrollPrev}
        aria-label="Previous testimonial"
      >
        <Icon icon={ArrowLeft02Icon} size={18} className="text-foreground" />
      </Button>

      {/* Dot indicators */}
      <div className="flex items-center gap-1.5 px-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-200",
              i === current
                ? "w-6 bg-forest-500"
                : "w-2 bg-forest-200 hover:bg-forest-300"
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current ? "true" : undefined}
          />
        ))}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full border-forest-200 hover:bg-forest-50 disabled:opacity-40"
        onClick={onNext}
        disabled={!canScrollNext}
        aria-label="Next testimonial"
      >
        <Icon icon={ArrowRight02Icon} size={18} className="text-foreground" />
      </Button>
    </div>
  )
}

// Main carousel component
export function TrustedByCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    if (!api) return

    const updateState = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap())
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    updateState()
    api.on("select", updateState)
    api.on("reInit", updateState)

    return () => {
      api.off("select", updateState)
      api.off("reInit", updateState)
    }
  }, [api])

  // Auto-play functionality - advance every 5 seconds
  React.useEffect(() => {
    if (!api || isPaused) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 5000) // 5 seconds

    return () => clearInterval(interval)
  }, [api, isPaused])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )

  return (
    <section className="py-16 md:py-24 border-b border-forest-100 bg-cream-50/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-foreground font-display">
              Trusted by world-class teams
            </h2>
            <p className="text-sm text-muted-foreground">
              See customer stories
            </p>
          </div>

          {/* Desktop controls */}
          <div className="hidden sm:block">
            <CarouselControls
              current={current}
              count={count}
              onPrevious={scrollPrev}
              onNext={scrollNext}
              onDotClick={scrollTo}
              canScrollPrev={canScrollPrev}
              canScrollNext={canScrollNext}
            />
          </div>
        </div>

        {/* Carousel */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3"
                >
                  <TestimonialSlide testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Mobile controls */}
        <div className="flex justify-center mt-6 sm:hidden">
          <CarouselControls
            current={current}
            count={count}
            onPrevious={scrollPrev}
            onNext={scrollNext}
            onDotClick={scrollTo}
            canScrollPrev={canScrollPrev}
            canScrollNext={canScrollNext}
          />
        </div>
      </div>
    </section>
  )
}
