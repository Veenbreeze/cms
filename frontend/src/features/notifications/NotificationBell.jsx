import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Spinner } from '../../components/ui'
import {
  getUnreadNotificationCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../services/api/notificationService'
import { ROUTES } from '../../routes/routePaths'
import { formatDateTime } from '../../utils/formatDate'

const POLL_INTERVAL_MS = 60000

export default function NotificationBell() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(null)

  const refreshUnreadCount = () => {
    getUnreadNotificationCount()
      .then((data) => setUnreadCount(data.unread_count))
      .catch(() => {})
  }

  useEffect(() => {
    refreshUnreadCount()
    const interval = setInterval(refreshUnreadCount, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    listNotifications({ page_size: 5 }).then((data) => setNotifications(data.results))
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleMarkRead = async (notification) => {
    if (notification.is_read) return
    const updated = await markNotificationRead(notification.id)
    setNotifications((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    refreshUnreadCount()
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead()
    setNotifications((current) => current?.map((item) => ({ ...item, is_read: true })) || null)
    setUnreadCount(0)
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((current) => !current)}
        aria-label={t('notifications.title')}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-neutral-200 bg-white shadow-[var(--shadow-warm-lg)] dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5 dark:border-neutral-800">
            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{t('notifications.title')}</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          {!notifications ? (
            <div className="flex justify-center py-6">
              <Spinner size={20} />
            </div>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">{t('notifications.noNotifications')}</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    onClick={() => handleMarkRead(notification)}
                    className="block w-full px-4 py-2.5 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={notification.is_read ? 'text-neutral-600 dark:text-neutral-300' : 'font-medium text-neutral-900 dark:text-neutral-100'}>
                        {notification.title}
                      </span>
                      {!notification.is_read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-500" />}
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{formatDateTime(notification.created_at)}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <Link
            to={ROUTES.NOTIFICATIONS}
            onClick={() => setOpen(false)}
            className="block border-t border-neutral-200 px-4 py-2.5 text-center text-xs font-medium text-primary-600 hover:underline dark:border-neutral-800 dark:text-primary-400"
          >
            {t('notifications.viewAll')}
          </Link>
        </div>
      )}
    </div>
  )
}
