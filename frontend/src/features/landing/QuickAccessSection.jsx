import { Calendar, Gift, HandHeart, Info, MapPin, Users2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Card } from '../../components/ui'
import { ROUTES } from '../../routes/routePaths'

export default function QuickAccessSection() {
  const { t } = useTranslation()

  const items = [
    { icon: MapPin, titleKey: 'landing.quickAccessVisitTitle', descriptionKey: 'landing.quickAccessVisitDescription', to: ROUTES.SERVICES },
    { icon: Users2, titleKey: 'landing.quickAccessMinistriesTitle', descriptionKey: 'landing.quickAccessMinistriesDescription', to: ROUTES.MINISTRIES },
    { icon: Calendar, titleKey: 'landing.quickAccessEventsTitle', descriptionKey: 'landing.quickAccessEventsDescription', to: `${ROUTES.HOME}#events` },
    { icon: Info, titleKey: 'landing.quickAccessAboutTitle', descriptionKey: 'landing.quickAccessAboutDescription', to: ROUTES.ABOUT },
    {
      icon: HandHeart,
      titleKey: 'nav.prayerRequest',
      descriptionKey: 'landing.quickAccessPrayerDescription',
      to: ROUTES.PRAYER_REQUEST,
    },
    {
      icon: Gift,
      titleKey: 'landing.quickAccessGiveTitle',
      descriptionKey: 'landing.quickAccessGiveDescription',
      to: ROUTES.CONTACT,
      actionKey: 'landing.quickAccessGiveAction',
    },
  ]

  return (
    <section className="bg-neutral-50 dark:bg-neutral-900/40">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
      <h2 className="mb-6 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('landing.quickAccessTitle')}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.titleKey}
            as={Link}
            to={item.to}
            className="flex flex-col items-start gap-3 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-warm-md)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200">
              <item.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-base font-semibold text-neutral-900 dark:text-neutral-100">{t(item.titleKey)}</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{t(item.descriptionKey)}</p>
            </div>
            <span className="mt-auto text-sm font-medium text-primary-700 dark:text-primary-300">
              {t(item.actionKey || 'landing.learnMore')}
            </span>
          </Card>
        ))}
      </div>
      </div>
    </section>
  )
}
