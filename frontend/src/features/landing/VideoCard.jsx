import { useState } from 'react'
import { Play } from 'lucide-react'

export default function VideoCard({ embedUrl, thumbnailUrl, title, className = 'aspect-video w-full', fit = 'cover' }) {
  const [playing, setPlaying] = useState(false)
  const objectFitClass = fit === 'contain' ? 'object-contain' : 'object-cover'

  if (playing) {
    return (
      <div className={className}>
        <iframe
          src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} className={`group relative block overflow-hidden ${className}`} aria-label={title}>
      {thumbnailUrl && (
        <img src={thumbnailUrl} alt="" className={`h-full w-full ${objectFitClass} transition-transform duration-300 group-hover:scale-105`} />
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-neutral-950/25 transition-colors group-hover:bg-neutral-950/35">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-[var(--shadow-warm-md)] transition-transform group-hover:scale-110">
          <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
        </span>
      </span>
    </button>
  )
}
