import { useEffect, useState } from 'react'
import { Baby, Bell, Calendar, Church, HeartHandshake, Image, Music, ScrollText, UserCheck, Users, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge, Card, CardBody, Spinner } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import PlaceholderFeedCard from '../features/dashboard/PlaceholderFeedCard'
import QuickActions from '../features/dashboard/QuickActions'
import StatsCard from '../features/dashboard/StatsCard'
import MemberSearchBar from '../features/members/MemberSearchBar'
import { listAnnouncements } from '../services/api/announcementService'
import { getDashboardStats } from '../services/api/dashboardService'
import { listEvents } from '../services/api/eventService'
import { listGalleryImages } from '../services/api/galleryService'
import { listSongCollections } from '../services/api/songService'
import { listWeeklyLessons } from '../services/api/weeklyLessonService'
import { getMyMember } from '../services/api/memberService'
import { getErrorDetail } from '../services/api/apiError'
import { formatDate, formatDateTime } from '../utils/formatDate'
import { ROLES } from '../utils/roles'

const EMPTY_LIST = { results: [] }

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [feed, setFeed] = useState({ announcements: [], lesson: null, collectionItems: [], events: [], photos: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [memberResult, setMemberResult] = useState(null)

  useEffect(() => {
    if (user?.role === ROLES.MEMBER) {
      let isCurrent = true
      getMyMember()
        .then((member) => {
          if (isCurrent) setMemberResult({ userId: user.id, member, error: null })
        })
        .catch((error) => {
          if (isCurrent) setMemberResult({ userId: user.id, member: null, error })
        })
      return () => {
        isCurrent = false
      }
    }
    const today = new Date().toISOString().slice(0, 10)
    Promise.all([
      getDashboardStats(),
      listAnnouncements({ page_size: 5 }).catch(() => EMPTY_LIST),
      listWeeklyLessons({ page_size: 1 }).catch(() => EMPTY_LIST),
      listSongCollections({ date: today }).catch(() => EMPTY_LIST),
      listEvents({ date_from: today, page_size: 5 }).catch(() => EMPTY_LIST),
      listGalleryImages({ page_size: 6 }).catch(() => EMPTY_LIST),
    ])
      .then(([statsData, announcementsData, lessonsData, collectionsData, eventsData, photosData]) => {
        setStats(statsData)
        setFeed({
          announcements: announcementsData.results,
          lesson: lessonsData.results[0] || null,
          collectionItems: collectionsData.results[0]?.items || [],
          events: eventsData.results,
          photos: photosData.results,
        })
      })
      .finally(() => setIsLoading(false))
  }, [user?.id, user?.role])

  if (user?.role === ROLES.MEMBER) {
    const result = memberResult?.userId === user.id ? memberResult : null
    if (!result) {
      return (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      )
    }

    if (result.error) {
      const message = result.error?.response?.status === 404
        ? t('dashboard.memberNotLinked')
        : getErrorDetail(result.error, t('common.error'))
      return <p className="py-12 text-center text-sm text-neutral-600 dark:text-neutral-300">{message}</p>
    }

    const member = result.member
    const spiritualRecords = member.spiritual_records || []
    const participationRecords = member.participation_records || []

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Church className="h-9 w-9 shrink-0 text-primary-600 dark:text-primary-300" />
          <div>
            <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t('dashboard.memberWelcome')}, {member.full_name}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{member.member_no} · {member.jumuia_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardBody className="flex items-center justify-between gap-3">
              <span className="text-sm text-neutral-600 dark:text-neutral-300">{t('dashboard.memberSpiritualJourney')}</span>
              <span className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{spiritualRecords.length}</span>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex items-center justify-between gap-3">
              <span className="text-sm text-neutral-600 dark:text-neutral-300">{t('dashboard.memberParticipation')}</span>
              <span className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{participationRecords.length}</span>
            </CardBody>
          </Card>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100">{t('dashboard.memberSpiritualJourney')}</h2>
          {spiritualRecords.length === 0 ? (
            <Card><CardBody className="text-sm text-neutral-500 dark:text-neutral-400">{t('dashboard.memberNoSpiritualRecords')}</CardBody></Card>
          ) : spiritualRecords.map((record) => (
            <Card key={record.id}>
              <CardBody className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{record.custom_label || record.milestone_type_display}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatDate(record.date)}</p>
                </div>
                <Badge variant={record.status === 'COMPLETED' ? 'success' : 'warning'}>
                  {t(`members.spiritual.${record.status === 'COMPLETED' ? 'completed' : 'scheduled'}`)}
                </Badge>
              </CardBody>
            </Card>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100">{t('dashboard.memberParticipation')}</h2>
          {participationRecords.length === 0 ? (
            <Card><CardBody className="text-sm text-neutral-500 dark:text-neutral-400">{t('dashboard.memberNoParticipationRecords')}</CardBody></Card>
          ) : participationRecords.map((record) => (
            <Card key={record.id}>
              <CardBody className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{record.activity_name}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {t(`members.participation.categories.${record.category}`)} · {formatDate(record.date)}
                  </p>
                </div>
                <Badge variant={record.status === 'ATTENDED' ? 'success' : record.status === 'ABSENT' ? 'warning' : 'neutral'}>
                  {t(`members.participation.statuses.${record.status}`)}
                </Badge>
              </CardBody>
            </Card>
          ))}
        </section>
      </div>
    )
  }

  const statCards = stats
    ? [
        { label: t('dashboard.totalMembers'), value: stats.total_members, icon: Users, accent: 'primary' },
        { label: t('dashboard.totalJumuia'), value: stats.total_jumuia, icon: UsersRound, accent: 'accent' },
        { label: t('dashboard.maleMembers'), value: stats.male_members, icon: UserCheck, accent: 'neutral' },
        { label: t('dashboard.femaleMembers'), value: stats.female_members, icon: UserCheck, accent: 'neutral' },
        { label: t('dashboard.newMembers'), value: stats.new_members_this_month, icon: Users, accent: 'primary' },
        { label: t('dashboard.baptizedMembers'), value: stats.baptized_members, icon: Baby, accent: 'accent' },
        { label: t('dashboard.confirmedMembers'), value: stats.confirmed_members, icon: HeartHandshake, accent: 'accent' },
        { label: t('dashboard.marriedMembers'), value: stats.married_members, icon: HeartHandshake, accent: 'accent' },
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('dashboard.welcome', { name: user?.first_name })}
        </h1>
        <MemberSearchBar />
      </div>

      <QuickActions />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size={28} />
        </div>
      ) : (
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {t('dashboard.quickStats')}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {statCards.map((card) => (
              <StatsCard key={card.label} {...card} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PlaceholderFeedCard
          title={t('dashboard.latestAnnouncements')}
          icon={Bell}
          emptyTitle={t('landing.noAnnouncementsYet')}
          items={feed.announcements}
          renderItem={(announcement) => (
            <div>
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{announcement.title}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDate(announcement.published_at)}</p>
            </div>
          )}
        />
        <PlaceholderFeedCard
          title={t('dashboard.thisWeekLesson')}
          icon={ScrollText}
          emptyTitle={t('landing.noLessonYet')}
          items={feed.lesson ? [feed.lesson] : []}
          renderItem={(lesson) => (
            <div>
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{lesson.title}</p>
              {lesson.scripture_reference && <p className="text-xs text-neutral-500 dark:text-neutral-400">{lesson.scripture_reference}</p>}
            </div>
          )}
        />
        <PlaceholderFeedCard
          title={t('dashboard.todaySongs')}
          icon={Music}
          emptyTitle={t('landing.noSongsYet')}
          items={feed.collectionItems}
          renderItem={(item) => <p className="text-sm text-neutral-800 dark:text-neutral-100">{item.song_title}</p>}
        />
        <PlaceholderFeedCard
          title={t('dashboard.upcomingEvents')}
          icon={Calendar}
          emptyTitle={t('landing.noEventsYet')}
          items={feed.events}
          renderItem={(event) => (
            <div>
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{event.title}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDateTime(event.start_datetime)}</p>
            </div>
          )}
        />
        <PlaceholderFeedCard
          title={t('dashboard.recentPhotos')}
          icon={Image}
          emptyTitle={t('landing.noPhotosYet')}
          items={feed.photos}
          renderItem={(photo) => (
            <div className="flex items-center gap-2">
              <img src={photo.image} alt={photo.caption || ''} className="h-10 w-10 rounded object-cover" />
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{photo.caption || '—'}</p>
            </div>
          )}
        />
      </div>
    </div>
  )
}
