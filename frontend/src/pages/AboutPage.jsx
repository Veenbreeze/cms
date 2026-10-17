import { useTranslation } from 'react-i18next'
import { Link, useOutletContext } from 'react-router-dom'

import { Card, CardBody } from '../components/ui'
import { ROUTES } from '../routes/routePaths'

export default function AboutPage() {
  const { t } = useTranslation()
  const { church } = useOutletContext()

  const beliefs = [
    t('about.beliefsItem1'),
    t('about.beliefsItem2'),
    t('about.beliefsItem3'),
    t('about.beliefsItem4'),
    t('about.beliefsItem5'),
  ]

  return (
    <div>
      <section id="who-we-are" className="mx-auto max-w-3xl px-4 py-14 md:px-6">
        <h1 className="mb-4 font-display text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{t('about.heroTitle')}</h1>
        <h2 className="mb-3 font-display text-xl font-semibold text-neutral-900 dark:text-neutral-100">{t('about.whoWeAreTitle')}</h2>
        <p className="text-neutral-600 dark:text-neutral-300">{church?.description || t('about.whoWeAreFallback')}</p>
      </section>

      <section id="beliefs" className="bg-neutral-50 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-3xl px-4 py-14 md:px-6">
          <h2 className="mb-2 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('about.beliefsTitle')}</h2>
          <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">{t('about.beliefsIntro')}</p>
          <Card>
            <CardBody>
              <ul className="space-y-3">
                {beliefs.map((belief) => (
                  <li key={belief} className="flex gap-3 text-neutral-700 dark:text-neutral-200">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-600" />
                    <span>{belief}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </section>

      <section id="history" className="mx-auto max-w-3xl px-4 py-14 md:px-6">
        <h2 className="mb-4 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('about.historyTitle')}</h2>
        <p className="text-neutral-600 dark:text-neutral-300">{t('about.historyNotProvided')}</p>
      </section>

      <section className="bg-neutral-50 dark:bg-neutral-900/40">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-14 text-center md:px-6">
          <h2 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('about.leadershipTeaserTitle')}</h2>
          <p className="text-neutral-600 dark:text-neutral-300">{t('about.leadershipTeaserBody')}</p>
          <Link to={ROUTES.LEADERSHIP} className="text-sm font-medium text-primary-700 dark:text-primary-300">
            {t('about.leadershipTeaserAction')}
          </Link>
        </div>
      </section>
    </div>
  )
}
