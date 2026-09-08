import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Card } from '../components/ui'
import { cn } from '../utils/cn'

const FAQ_KEYS = ['1', '2', '3', '4', '5', '6']

export default function FaqPage() {
  const { t } = useTranslation()
  const [openKey, setOpenKey] = useState(null)

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-6">
      <h1 className="mb-2 font-display text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{t('faq.heroTitle')}</h1>
      <p className="mb-8 text-neutral-600 dark:text-neutral-300">{t('faq.intro')}</p>

      <Card>
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {FAQ_KEYS.map((key) => {
            const open = openKey === key
            return (
              <div key={key}>
                <button
                  type="button"
                  onClick={() => setOpenKey(open ? null : key)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">{t(`faq.q${key}`)}</span>
                  <ChevronDown className={cn('h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform', open && 'rotate-180')} />
                </button>
                {open && <div className="px-5 pb-4 text-sm text-neutral-600 dark:text-neutral-300">{t(`faq.a${key}`)}</div>}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
