import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, EmptyState, Spinner } from '../../components/ui'
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '../../services/api/notificationService'
import { formatDateTime } from '../../utils/formatDate'

export default function NotificationList() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState(null)

  const load = () => {
    listNotifications().then((data) => setNotifications(data.results))
  }

  useEffect(load, [])

  const handleMarkRead = async (notification) => {
    if (notification.is_read) return
    const updated = await markNotificationRead(notification.id)
    setNotifications((current) => current.map((item) => (item.id === updated.id ? updated : item)))
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead()
    load()
  }

  if (!notifications) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    )
  }

  const hasUnread = notifications.some((notification) => !notification.is_read)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('notifications.title')}</h1>
        {hasUnread && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            {t('notifications.markAllRead')}
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title={t('notifications.noNotifications')} />
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <button
                onClick={() => handleMarkRead(notification)}
                className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
              >
                <div>
                  <p className={notification.is_read ? 'text-sm text-neutral-700 dark:text-neutral-300' : 'text-sm font-medium text-neutral-900 dark:text-neutral-100'}>
                    {notification.title}
                  </p>
                  {notification.body && <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{notification.body}</p>}
                  <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">{formatDateTime(notification.created_at)}</p>
                </div>
                {!notification.is_read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
