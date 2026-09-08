import { useEffect, useState } from 'react'
import { Download, ScrollText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Card, CardBody, EmptyState, Spinner } from '../components/ui'
import { getLandingFeed } from '../services/api/publicContentService'

export default function MediaTeachingPage() {
  const { t } = useTranslation()
  const [lesson, setLesson] = useState(undefined)

  useEffect(() => {
    getLandingFeed()
      .then((feed) => setLesson(feed.lesson))
      .catch(() => setLesson(null))
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-6">
      <h1 className="mb-2 font-display text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{t('media.heroTitle')}</h1>
      <p className="mb-8 text-neutral-600 dark:text-neutral-300">{t('media.subtitle')}</p>

      {lesson === undefined ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : lesson ? (
        <Card>
          {lesson.image && <img src={lesson.image} alt="" className="h-56 w-full object-cover" />}
          <CardBody className="space-y-4">
            <div>
              <p className="font-display text-xl font-semibold text-neutral-900 dark:text-neutral-100">{lesson.title}</p>
              {lesson.scripture_reference && (
                <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  {t('media.scriptureReference')}: {lesson.scripture_reference}
                </p>
              )}
            </div>
            <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-200">{lesson.content}</p>
            {lesson.document && (
              <a
                href={lesson.document}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-primary-300"
              >
                <Download className="h-4 w-4" />
                {t('media.downloadDocument')}
              </a>
            )}
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody>
            <EmptyState icon={ScrollText} title={t('media.noContentYet')} description={t('media.moreComingSoon')} />
          </CardBody>
        </Card>
      )}
    </div>
  )
}
