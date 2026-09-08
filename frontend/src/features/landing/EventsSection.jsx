import { Calendar, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Card, CardBody, EmptyState } from '../../components/ui'
import { formatDateTime } from '../../utils/formatDate'
import { getYoutubeEmbedUrl, getYoutubeThumbnailUrl } from '../../utils/youtube'
import Slideshow from './Slideshow'
import VideoCard from './VideoCard'

export default function EventsSection({ events }) {
  const { t } = useTranslation()

  return (
    <section id="events">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h2 className="mb-6 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('landing.eventsTitle')}</h2>
        {events && events.length > 0 ? (
          <Slideshow
            items={events}
            renderItem={(event) => {
              const embedUrl = getYoutubeEmbedUrl(event.video_url)
              return (
                <div>
                  {embedUrl ? (
                    <div className="h-[70vh] max-h-[640px] min-h-[320px] w-full bg-neutral-900">
                      <VideoCard
                        embedUrl={embedUrl}
                        thumbnailUrl={getYoutubeThumbnailUrl(event.video_url)}
                        title={event.title}
                        fit="contain"
                        className="h-full w-full"
                      />
                    </div>
                  ) : (
                    event.image && (
                      <div className="h-[70vh] max-h-[640px] min-h-[320px] w-full bg-neutral-900">
                        <img src={event.image} alt="" className="h-full w-full object-contain" />
                      </div>
                    )
                  )}
                  <div className="bg-white p-5 dark:bg-neutral-900 sm:p-6">
                    <p className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100">{event.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        {formatDateTime(event.start_datetime)}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          {event.location}
                        </span>
                      )}
                    </div>
                    {event.description && <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{event.description}</p>}
                  </div>
                </div>
              )
            }}
          />
        ) : (
          <Card>
            <CardBody>
              <EmptyState icon={Calendar} title={t('landing.noEventsYet')} />
            </CardBody>
          </Card>
        )}
      </div>
    </section>
  )
}
