import { useEffect, useState } from 'react'
import { Calendar, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, EmptyState, Modal, ResponsiveTable, Spinner } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getErrorDetail } from '../../services/api/apiError'
import { deactivateEvent, listEvents } from '../../services/api/eventService'
import { formatDateTime } from '../../utils/formatDate'
import { isStaffRole } from '../../utils/roles'
import EventForm from './EventForm'

export default function EventList() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { showToast } = useToast()
  const canManage = isStaffRole(user?.role)

  const [events, setEvents] = useState(null)
  const [modalState, setModalState] = useState(null)

  const loadEvents = () => {
    listEvents().then((data) => setEvents(data.results))
  }

  useEffect(loadEvents, [])

  const handleSaved = () => {
    setModalState(null)
    loadEvents()
  }

  const handleDeactivate = async (event) => {
    if (!window.confirm(t('events.deactivateConfirm'))) return
    try {
      await deactivateEvent(event.id)
      showToast({ type: 'success', message: t('common.success') })
      loadEvents()
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    }
  }

  if (!events) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    )
  }

  const columns = [
    { key: 'title', header: t('events.title'), render: (row) => <span className="font-medium">{row.title}</span> },
    { key: 'start_datetime', header: t('events.startDatetime'), render: (row) => formatDateTime(row.start_datetime) },
    { key: 'location', header: t('events.location'), render: (row) => row.location || '—' },
    { key: 'category', header: t('events.category'), render: (row) => row.category || '—' },
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
        <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('events.title')}</h1>
        {canManage && (
          <Button onClick={() => setModalState('create')}>
            <Plus className="h-4 w-4" />
            {t('events.addEvent')}
          </Button>
        )}
      </div>

      <ResponsiveTable columns={columns} rows={events} emptyState={<EmptyState icon={Calendar} title={t('events.noEvents')} />} />

      <Modal
        open={!!modalState}
        onClose={() => setModalState(null)}
        title={modalState === 'create' ? t('events.addEvent') : t('common.edit')}
        size="lg"
      >
        <EventForm event={modalState && modalState !== 'create' ? modalState : null} onSaved={handleSaved} onCancel={() => setModalState(null)} />
      </Modal>
    </div>
  )
}
