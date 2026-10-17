import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmptyState } from '../../components/ui'
import { formatDate } from '../../utils/formatDate'

const TILE_LAYOUTS = [
  'col-span-2 row-span-2 md:col-span-2 md:row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1 md:col-span-1',
]

export default function GallerySection({ photos }) {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(null)
  const items = (photos || []).slice(0, 6)
  const activePhoto = activeIndex === null ? null : items[activeIndex]

  useEffect(() => {
    if (!activePhoto) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setActiveIndex(null)
      if (event.key === 'ArrowLeft') setActiveIndex((index) => (index - 1 + items.length) % items.length)
      if (event.key === 'ArrowRight') setActiveIndex((index) => (index + 1) % items.length)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [activePhoto, items.length])

  return (
    <section id="gallery" className="bg-neutral-50 dark:bg-neutral-900/40">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-primary-700 dark:text-primary-300">{t('landing.galleryEyebrow')}</p>
            <h2 className="font-display text-3xl font-semibold text-neutral-900 dark:text-neutral-100 sm:text-4xl">
              {t('landing.galleryTitle')}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-300">{t('landing.galleryIntro')}</p>
        </div>

        {items.length > 0 ? (
          <div className="grid auto-rows-[8rem] grid-cols-2 gap-2 sm:auto-rows-[10rem] sm:gap-3 md:auto-rows-[13rem] md:grid-cols-3">
            {items.map((photo, index) => (
              <button
                key={photo.id || photo.image}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${t('gallery.openPhoto')} ${index + 1}`}
                className={`group relative min-h-0 overflow-hidden rounded-md bg-neutral-200 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:bg-neutral-800 ${TILE_LAYOUTS[index] || 'col-span-1 row-span-1'}`}
              >
                <img
                  src={photo.image}
                  alt={photo.caption || t('gallery.photoAlt', { number: index + 1 })}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-neutral-950/75 via-transparent to-neutral-950/10 opacity-80 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 text-white sm:p-4">
                  <span className="min-w-0">
                    {photo.caption && <span className="block truncate font-medium">{photo.caption}</span>}
                    {photo.taken_on && <span className="mt-1 block text-xs text-white/75">{formatDate(photo.taken_on)}</span>}
                  </span>
                  <span className="shrink-0 text-xs text-white/75">{String(index + 1).padStart(2, '0')}</span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="border-y border-neutral-200 py-8 dark:border-neutral-800">
            <EmptyState icon={ImageIcon} title={t('landing.noPhotosYet')} />
          </div>
        )}
      </div>

      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={t('gallery.photoViewer')}>
          <button
            type="button"
            aria-label={t('gallery.closePhoto')}
            onClick={() => setActiveIndex(null)}
            className="absolute inset-0 cursor-default"
          />
          <div className="relative z-10 flex max-h-full w-full max-w-6xl flex-col" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between text-sm text-white/75">
              <span>{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
              <button
                type="button"
                aria-label={t('gallery.closePhoto')}
                onClick={() => setActiveIndex(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <figure className="relative flex min-h-0 flex-1 items-center justify-center">
              <img src={activePhoto.image} alt={activePhoto.caption || t('gallery.photoAlt', { number: activeIndex + 1 })} className="max-h-[72vh] max-w-full object-contain" />
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label={t('gallery.previousPhoto')}
                    onClick={() => setActiveIndex((index) => (index - 1 + items.length) % items.length)}
                    className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950/55 text-white transition hover:bg-neutral-950/80 focus-visible:outline-2 focus-visible:outline-white sm:left-3"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    aria-label={t('gallery.nextPhoto')}
                    onClick={() => setActiveIndex((index) => (index + 1) % items.length)}
                    className="absolute right-0 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950/55 text-white transition hover:bg-neutral-950/80 focus-visible:outline-2 focus-visible:outline-white sm:right-3"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/80 to-transparent px-4 pb-4 pt-12 text-center text-white">
                {activePhoto.caption && <p className="font-display text-lg font-semibold">{activePhoto.caption}</p>}
                {activePhoto.taken_on && <p className="mt-1 text-sm text-white/75">{formatDate(activePhoto.taken_on)}</p>}
              </figcaption>
            </figure>
          </div>
        </div>
      )}
    </section>
  )
}
