import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge, Card, CardBody, EmptyState } from '../../components/ui'
import { formatDate } from '../../utils/formatDate'
import Slideshow from './Slideshow'

const PRIORITY_VARIANTS = {
  LOW: 'neutral',
  NORMAL: 'primary',
  HIGH: 'warning',
  URGENT: 'danger',
}

export default function NewsSection({ announcements }) {
  const { t } = useTranslation()

  return (
    <section id="news" className="bg-neutral-50 dark:bg-neutral-900/40">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h2 className="mb-6 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('landing.newsTitle')}</h2>
        {announcements && announcements.length > 0 ? (
          <Slideshow
            items={announcements}
            renderItem={(announcement) => (
              <div>
                {announcement.image && (
                  <div className="h-[60vh] max-h-[560px] min-h-[280px] w-full bg-neutral-900">
                    <img src={announcement.image} alt="" className="h-full w-full object-contain" />
                  </div>
                )}
                <div className="bg-white p-5 dark:bg-neutral-900 sm:p-6">
                  <div className="flex items-center gap-2">
                    <Badge variant={PRIORITY_VARIANTS[announcement.priority] || 'neutral'}>
                      {t(`announcements.categories.${announcement.category}`, announcement.category)}
                    </Badge>
                    {announcement.published_at && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{formatDate(announcement.published_at)}</span>
                    )}
                  </div>
                  <p className="mt-2 font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100">{announcement.title}</p>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{announcement.body}</p>
                </div>
              </div>
            )}
          />
        ) : (
          <Card>
            <CardBody>
              <EmptyState icon={Bell} title={t('landing.noAnnouncementsYet')} />
            </CardBody>
          </Card>
        )}
      </div>
    </section>
  )
}
