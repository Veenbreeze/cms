import { ArrowRight, ScrollText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Card, CardBody, EmptyState } from '../../components/ui'
import { ROUTES } from '../../routes/routePaths'

export default function MediaTeachingSection({ lesson }) {
  const { t } = useTranslation()

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h2 className="mb-6 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('landing.mediaTeaserTitle')}</h2>
        <Card>
          <CardBody>
            {lesson ? (
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                {lesson.image && (
                  <img src={lesson.image} alt="" className="h-16 w-24 flex-shrink-0 rounded-full object-cover" />
                )}
                <div className="flex-1">
                  <p className="font-display text-base font-semibold text-neutral-900 dark:text-neutral-100">{lesson.title}</p>
                  {lesson.scripture_reference && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{lesson.scripture_reference}</p>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">{lesson.content}</p>
                </div>
                <Link
                  to={ROUTES.MEDIA}
                  className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-medium text-primary-700 dark:text-primary-300"
                >
                  {t('landing.viewMediaTeaching')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <EmptyState icon={ScrollText} title={t('landing.noLessonYet')} />
            )}
          </CardBody>
        </Card>
      </div>
    </section>
  )
}
