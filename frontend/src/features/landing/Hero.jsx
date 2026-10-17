import { Calendar, MapPin, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '../../components/ui'
import { ROUTES } from '../../routes/routePaths'
import { SERVICES } from './data/services'

const FALLBACK_HERO_IMAGE = '/WhatsApp%20Image%202026-09-08%20at%2011.10.34.jpeg'

export default function Hero({ church, backgroundImage }) {
  const { t } = useTranslation()
  const nextService = SERVICES[0]

  const infoItems = [
    {
      key: 'service',
      content: (
        <Link to={ROUTES.SERVICES} className="flex items-center gap-3 px-4 py-4 text-sm text-neutral-700 transition-colors hover:bg-accent-50 dark:text-neutral-200 dark:hover:bg-neutral-900">
          <Calendar className="h-4 w-4 flex-shrink-0 text-teal-700 dark:text-teal-300" />
          <span>
            {t(nextService.dayKey)} · {t(nextService.timeKey)}
          </span>
        </Link>
      ),
    },
    church?.address && {
      key: 'address',
      content: (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-4 py-4 text-sm text-neutral-700 transition-colors hover:bg-accent-50 dark:text-neutral-200 dark:hover:bg-neutral-900"
        >
          <MapPin className="h-4 w-4 flex-shrink-0 text-teal-700 dark:text-teal-300" />
          <span className="truncate">{church.address}</span>
        </a>
      ),
    },
    church?.phone && {
      key: 'phone',
      content: (
        <a href={`tel:${church.phone}`} className="flex items-center gap-3 px-4 py-4 text-sm text-neutral-700 transition-colors hover:bg-accent-50 dark:text-neutral-200 dark:hover:bg-neutral-900">
          <Phone className="h-4 w-4 flex-shrink-0 text-teal-700 dark:text-teal-300" />
          <span>{church.phone}</span>
        </a>
      ),
    },
  ].filter(Boolean)

  return (
    <section>
      <div className="relative isolate min-h-[430px] overflow-hidden bg-neutral-950 sm:min-h-[500px] lg:min-h-[560px]">
        <img
          src={backgroundImage || FALLBACK_HERO_IMAGE}
          alt=""
          onError={(event) => {
            if (!event.currentTarget.src.endsWith(FALLBACK_HERO_IMAGE)) event.currentTarget.src = FALLBACK_HERO_IMAGE
          }}
          className="absolute inset-0 h-full w-full object-cover object-[center_38%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-neutral-950/35 to-neutral-950/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/35 via-transparent to-neutral-950/10" />

        <div className="relative mx-auto flex min-h-[430px] max-w-7xl items-center px-4 py-12 sm:min-h-[500px] sm:px-6 sm:py-16 lg:min-h-[560px]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold text-accent-200">{church?.name || t('app.name')}</p>
            <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              {t('landing.welcomeMessage')}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">{t('landing.heroSubtitle')}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to={ROUTES.SERVICES} variant="secondary" size="lg">
                {t('landing.heroPrimaryCta')}
              </Button>
              <Button as={Link} to={ROUTES.ABOUT} variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                {t('landing.learnMore')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {infoItems.length > 0 && (
        <div className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-neutral-200 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 dark:divide-neutral-800">
            {infoItems.map((item) => <div key={item.key}>{item.content}</div>)}
          </div>
        </div>
      )}
    </section>
  )
}
