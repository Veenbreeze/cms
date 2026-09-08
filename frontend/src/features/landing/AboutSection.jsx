import { HeartHandshake } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ROUTES } from '../../routes/routePaths'

export default function AboutSection({ church, imageUrl }) {
  const { t } = useTranslation()

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <h2 className="mb-4 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('nav.about')}</h2>
          <p className="text-neutral-600 dark:text-neutral-300">{church?.description || t('landing.footerDescription')}</p>
          <Link to={ROUTES.ABOUT} className="mt-4 inline-block text-sm font-medium text-primary-700 dark:text-primary-300">
            {t('landing.learnMore')}
          </Link>
        </div>
        <div className="order-1 md:order-2">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[var(--shadow-warm-md)]" />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/40 dark:to-accent-900/30">
              <HeartHandshake className="h-16 w-16 text-primary-400 dark:text-primary-300" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
