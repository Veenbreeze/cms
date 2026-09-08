import { Image as ImageIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmptyState } from '../../components/ui'
import { formatDate } from '../../utils/formatDate'
import Slideshow from './Slideshow'

export default function GallerySection({ photos }) {
  const { t } = useTranslation()

  return (
    <section id="gallery" className="bg-neutral-50 dark:bg-neutral-900/40">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h2 className="mb-6 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('nav.gallery')}</h2>
        {photos && photos.length > 0 ? (
          <Slideshow
            items={photos}
            renderItem={(photo) => (
              <div className="relative h-[70vh] max-h-[640px] min-h-[320px] w-full bg-neutral-900">
                <img src={photo.image} alt={photo.caption || ''} className="h-full w-full object-contain" />
                {(photo.caption || photo.taken_on) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/80 to-transparent p-4 pt-10 sm:p-6 sm:pt-14">
                    {photo.caption && <p className="font-display text-base font-semibold text-white sm:text-lg">{photo.caption}</p>}
                    {photo.taken_on && <p className="text-sm text-neutral-200">{formatDate(photo.taken_on)}</p>}
                  </div>
                )}
              </div>
            )}
          />
        ) : (
          <EmptyState icon={ImageIcon} title={t('landing.noPhotosYet')} />
        )}
      </div>
    </section>
  )
}
