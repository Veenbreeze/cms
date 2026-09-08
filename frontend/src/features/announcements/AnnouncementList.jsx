import { useEffect, useState } from 'react'
import { Megaphone, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge, Button, EmptyState, Modal, ResponsiveTable, Spinner } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getErrorDetail } from '../../services/api/apiError'
import { deactivateAnnouncement, listAnnouncements } from '../../services/api/announcementService'
import { formatDate } from '../../utils/formatDate'
import { isStaffRole } from '../../utils/roles'
import AnnouncementForm from './AnnouncementForm'

export default function AnnouncementList() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { showToast } = useToast()
  const canManage = isStaffRole(user?.role)

  const [announcements, setAnnouncements] = useState(null)
  const [modalState, setModalState] = useState(null) // null | 'create' | announcement to edit

  const loadAnnouncements = () => {
    listAnnouncements().then((data) => setAnnouncements(data.results))
  }

  useEffect(loadAnnouncements, [])

  const handleSaved = () => {
    setModalState(null)
    loadAnnouncements()
  }

  const handleDeactivate = async (announcement) => {
    if (!window.confirm(t('announcements.deactivateConfirm'))) return
    try {
      await deactivateAnnouncement(announcement.id)
      showToast({ type: 'success', message: t('common.success') })
      loadAnnouncements()
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    }
  }

  if (!announcements) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    )
  }

  const columns = [
    {
      key: 'title',
      header: t('announcements.title'),
      render: (row) => (
        <div>
          <span className="font-medium">{row.title}</span>
          {row.is_pinned && (
            <Badge variant="accent" className="ml-2">
              📌
            </Badge>
          )}
        </div>
      ),
    },
    { key: 'category', header: t('announcements.category'), render: (row) => t(`announcements.categories.${row.category}`) },
    { key: 'priority', header: t('announcements.priority'), render: (row) => t(`announcements.priorities.${row.priority}`) },
    { key: 'published_at', header: t('announcements.publishedAt'), render: (row) => (row.published_at ? formatDate(row.published_at) : '—') },
    ...(canManage
      ? [
          {
            key: 'actions',
            header: t('common.actions'),
            render: (row) => (
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setModalState(row)}>
                  {t('common.edit')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeactivate(row)}>
                  {t('common.delete')}
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('announcements.title')}</h1>
        {canManage && (
          <Button onClick={() => setModalState('create')}>
            <Plus className="h-4 w-4" />
            {t('announcements.addAnnouncement')}
          </Button>
        )}
      </div>

      <ResponsiveTable
        columns={columns}
        rows={announcements}
        emptyState={<EmptyState icon={Megaphone} title={t('announcements.noAnnouncements')} />}
      />

      <Modal
        open={!!modalState}
        onClose={() => setModalState(null)}
        title={modalState === 'create' ? t('announcements.addAnnouncement') : t('common.edit')}
        size="lg"
      >
        <AnnouncementForm
          announcement={modalState && modalState !== 'create' ? modalState : null}
          onSaved={handleSaved}
          onCancel={() => setModalState(null)}
        />
      </Modal>
    </div>
  )
}
