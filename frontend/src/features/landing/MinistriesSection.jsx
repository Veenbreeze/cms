import { useTranslation } from 'react-i18next'

import { Card } from '../../components/ui'
import { MINISTRIES } from './data/ministries'

export default function MinistriesSection({ titleId, showIntro = false }) {
  const { t } = useTranslation()

  return (
    <section id={titleId} className="bg-neutral-50 dark:bg-neutral-900/40">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h2 className="mb-2 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('nav.ministries')}</h2>
        {showIntro && <p className="mb-6 max-w-2xl text-neutral-600 dark:text-neutral-300">{t('ministries.intro')}</p>}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MINISTRIES.map((ministry) => (
            <Card key={ministry.key} id={ministry.key} className="flex scroll-mt-24 flex-col items-start gap-3 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200">
                <ministry.icon className="h-5 w-5" />
              </span>
              <p className="font-display text-base font-semibold text-neutral-900 dark:text-neutral-100">{t(ministry.nameKey)}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{t(ministry.descriptionKey)}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
