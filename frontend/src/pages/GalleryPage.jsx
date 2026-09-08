import { useTranslation } from 'react-i18next'

import GalleryImageGrid from '../features/gallery/GalleryImageGrid'

export default function GalleryPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('gallery.title')}</h1>
      <GalleryImageGrid />
    </div>
  )
}
