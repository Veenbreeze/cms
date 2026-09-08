import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '../../components/ui'
import { ROUTES } from '../../routes/routePaths'

export default function CTASection() {
  const { t } = useTranslation()

  return (
    <section className="bg-primary-700 dark:bg-primary-900">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-6">
        <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">{t('landing.ctaTitle')}</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-100">{t('landing.ctaSubtitle')}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button as={Link} to={ROUTES.SERVICES} variant="secondary" size="lg">
            {t('landing.ctaPrimary')}
          </Button>
          <Button
            as={Link}
            to={`${ROUTES.HOME}#contact`}
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white/10 dark:border-white dark:text-white"
          >
            {t('landing.ctaSecondary')}
          </Button>
        </div>
      </div>
    </section>
  )
}
