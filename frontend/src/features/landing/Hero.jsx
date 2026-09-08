import { Calendar, MapPin, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '../../components/ui'
import { ROUTES } from '../../routes/routePaths'
import { SERVICES } from './data/services'

export default function Hero({ church, backgroundImage }) {
  const { t } = useTranslation()
  const nextService = SERVICES[0]

  const infoItems = [
    {
      key: 'service',
      content: (
        <Link to={ROUTES.SERVICES} className="flex items-center justify-center gap-2 px-4 py-4 text-sm text-primary-100 hover:text-white">
          <Calendar className="h-4 w-4 flex-shrink-0" />
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
          className="flex items-center justify-center gap-2 px-4 py-4 text-sm text-primary-100 hover:text-white"
        >
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{church.address}</span>
        </a>
      ),
    },
    church?.phone && {
      key: 'phone',
      content: (
        <a href={`tel:${church.phone}`} className="flex items-center justify-center gap-2 px-4 py-4 text-sm text-primary-100 hover:text-white">
          <Phone className="h-4 w-4 flex-shrink-0" />
          <span>{church.phone}</span>
        </a>
      ),
    },
  ].filter(Boolean)

  return (
    <section className="relative overflow-hidden">
      {backgroundImage ? (
        <>
          <img src={backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-neutral-950/70" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-primary-800 to-primary-950" />
      )}
      <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-24 text-center sm:pt-32">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-accent-300">{church?.name}</p>
        <h1 className="font-display text-4xl font-semibold text-white sm:text-6xl">{t('landing.welcomeMessage')}</h1>
        <p className="mx-auto mt-4 max-w-xl text-primary-100">{t('landing.heroSubtitle')}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button as={Link} to={ROUTES.SERVICES} variant="secondary" size="lg">
            {t('landing.heroPrimaryCta')}
          </Button>
          <Button as={Link} to={ROUTES.ABOUT} variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
            {t('landing.learnMore')}
          </Button>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl flex-col divide-y divide-white/10 sm:flex-row sm:justify-center sm:divide-x sm:divide-y-0">
          {infoItems.map((item) => (
            <div key={item.key} className="flex-1">
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
