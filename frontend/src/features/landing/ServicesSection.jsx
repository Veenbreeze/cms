import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Card, CardBody } from '../../components/ui'
import { ROUTES } from '../../routes/routePaths'
import { SERVICES } from './data/services'

export default function ServicesSection({ variant = 'full' }) {
  const { t } = useTranslation()

  if (variant === 'compact') {
    const next = SERVICES[0]
    return (
      <section>
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <h2 className="mb-6 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('nav.services')}</h2>
          <Card>
            <CardBody className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200">
                  <next.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    {t('services.nextService')}
                  </p>
                  <p className="font-display text-base font-semibold text-neutral-900 dark:text-neutral-100">{t(next.nameKey)}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {t(next.dayKey)} · {t(next.timeKey)}
                  </p>
                </div>
              </div>
              <Link
                to={ROUTES.SERVICES}
                className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-medium text-primary-700 dark:text-primary-300"
              >
                {t('services.viewFullSchedule')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardBody>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="mx-auto max-w-4xl px-4 py-14 md:px-6">
        <h2 className="mb-2 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('services.heroTitle')}</h2>
        <p className="mb-6 text-neutral-600 dark:text-neutral-300">{t('services.intro')}</p>
        <Card>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {SERVICES.map((service) => (
              <div key={service.key} id={service.key} className="flex scroll-mt-24 items-center gap-4 p-5">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200">
                  <service.icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="font-display text-base font-semibold text-neutral-900 dark:text-neutral-100">{t(service.nameKey)}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{t(service.dayKey)}</p>
                </div>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{t(service.timeKey)}</p>
              </div>
            ))}
          </div>
          <p className="border-t border-neutral-100 px-5 py-4 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            {t('services.specialSundayServiceNote')}
          </p>
        </Card>
      </div>
    </section>
  )
}
