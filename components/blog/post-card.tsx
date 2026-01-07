"use client"

import Link from "next/link"
import Image from "next/image"
import { BlogPost, getCategoryMeta } from "@/lib/blog"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

interface PostCardProps {
  post: BlogPost
  variant?: "default" | "featured" | "compact"
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  const categoryMeta = getCategoryMeta(post.category)
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  if (variant === "featured") {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="grid md:grid-cols-2 gap-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden hover:shadow-lg transition-shadow">
          {post.heroImage && (
            <div className="relative aspect-[16/9] md:aspect-auto md:h-full overflow-hidden">
              <Image
                src={post.heroImage.src}
                alt={post.heroImage.alt}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full", categoryMeta.color)}>
                {categoryMeta.name}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTimeMinutes} min read
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight mb-3 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
              {post.title}
            </h2>
            <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formattedDate}</span>
              <span>·</span>
              <span>{post.author.name}</span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  if (variant === "compact") {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="flex gap-4 py-4 border-b border-stone-100 dark:border-stone-800 last:border-0">
          <div className="flex-1 min-w-0">
            <span className={cn("inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2", categoryMeta.color)}>
              {categoryMeta.name}
            </span>
            <h3 className="font-semibold text-foreground group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors line-clamp-2 mb-1">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formattedDate}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTimeMinutes} min
              </span>
            </div>
          </div>
          {post.heroImage && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={post.heroImage.src}
                alt={post.heroImage.alt}
                fill
                className="object-cover"
              />
            </div>
          )}
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        {post.heroImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.heroImage.src}
              alt={post.heroImage.alt}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", categoryMeta.color)}>
              {categoryMeta.name}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTimeMinutes} min
            </span>
          </div>
          <h3 className="text-lg font-semibold font-display tracking-tight mb-2 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
          <div className="text-xs text-muted-foreground">{formattedDate}</div>
        </div>
      </article>
    </Link>
  )
}
