import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '../../utils/cn'

export default function Slideshow({ items, renderItem, autoplayMs = 5000, className }) {
  const [index, setIndex] = useState(0)
  const count = items?.length || 0

  useEffect(() => {
    setIndex(0)
  }, [items])

  useEffect(() => {
    if (count < 2 || !autoplayMs) return
    const timer = setInterval(() => setIndex((current) => (current + 1) % count), autoplayMs)
    return () => clearInterval(timer)
  }, [count, autoplayMs])

  if (count === 0) return null

  const goTo = (next) => setIndex((next + count) % count)

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-neutral-200 shadow-[var(--shadow-warm-md)] dark:border-neutral-800', className)}>
      <div className="relative">
        <div key={index} style={{ animation: 'fadeIn 0.4s ease' }}>
          {renderItem(items[index], index)}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-[var(--shadow-warm-sm)] transition hover:bg-white dark:bg-neutral-900/80 dark:text-neutral-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-[var(--shadow-warm-sm)] transition hover:bg-white dark:bg-neutral-900/80 dark:text-neutral-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex items-center justify-center gap-2 bg-white py-3 dark:bg-neutral-900">
          {items.map((item, i) => (
            <button
              key={item.id ?? i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn('h-2 rounded-full transition-all', i === index ? 'w-6 bg-primary-600' : 'w-2 bg-neutral-300 dark:bg-neutral-700')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
