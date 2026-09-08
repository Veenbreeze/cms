import { Bell, Calendar, Image, Music, QrCode, ScrollText, UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../routes/routePaths'
import { isAdminRole } from '../../utils/roles'

export default function QuickActions() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const actions = [
    { key: 'addMember', labelKey: 'members.addMember', icon: UserPlus, to: ROUTES.MEMBER_NEW, enabled: true },
    { key: 'addAnnouncement', labelKey: 'nav.announcements', icon: Bell, to: ROUTES.ANNOUNCEMENTS, enabled: true },
    { key: 'uploadLesson', labelKey: 'nav.weeklyLessons', icon: ScrollText, to: ROUTES.WEEKLY_LESSONS, enabled: true },
    { key: 'addSongs', labelKey: 'nav.songs', icon: Music, to: ROUTES.SONGS, enabled: true },
    { key: 'generateQr', labelKey: 'songs.collections.generateQr', icon: QrCode, to: ROUTES.SONGS, enabled: true },
    { key: 'addEvent', labelKey: 'nav.events', icon: Calendar, to: ROUTES.EVENTS, enabled: true },
    { key: 'uploadPhoto', labelKey: 'nav.gallery', icon: Image, to: ROUTES.GALLERY, enabled: true },
  ].filter((action) => action.enabled || isAdminRole(user?.role))

  return (
    <div>
      <h2 className="mb-3 font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {t('dashboard.quickActions')}
      </h2>
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => {
          const content = (
            <>
              <action.icon className="h-4 w-4" />
              {t(action.labelKey)}
            </>
          )
          const className =
            'flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-[var(--shadow-warm-sm)] transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200' +
            (action.enabled
              ? ' hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-300'
              : ' cursor-not-allowed opacity-50')

          return action.enabled ? (
            <Link key={action.key} to={action.to} className={className}>
              {content}
            </Link>
          ) : (
            <span key={action.key} className={className} title={t('common.comingSoon')}>
              {content}
            </span>
          )
        })}
      </div>
    </div>
  )
}
