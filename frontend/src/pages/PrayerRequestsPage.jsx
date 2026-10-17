import { useEffect, useState } from 'react'
import { HandHeart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge, Button, Card, CardBody, EmptyState, FormField, Modal, ResponsiveTable, Select, Spinner } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { getErrorDetail } from '../services/api/apiError'
import { listPrayerRequests, updatePrayerRequest } from '../services/api/prayerRequestService'
import { formatDateTime } from '../utils/formatDate'

const STATUSES = ['NEW', 'PRAYING', 'ANSWERED', 'CLOSED']

function ReviewPrayerRequestModal({ request, onClose, onSaved }) {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [status, setStatus] = useState(request.status)
  const [internalNotes, setInternalNotes] = useState(request.internal_notes || '')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSaving(true)
    try {
      const updated = await updatePrayerRequest(request.id, { status, internal_notes: internalNotes })
      showToast({ type: 'success', message: t('common.success') })
      onSaved(updated)
    } catch (saveError) {
      setError(getErrorDetail(saveError, t('common.error')))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal open onClose={onClose} title={t('prayerRequest.reviewTitle')} size="lg">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-medium text-neutral-900 dark:text-neutral-100">{request.name}</p>
            {request.email && <p className="text-sm text-neutral-500 dark:text-neutral-400">{request.email}</p>}
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{formatDateTime(request.created_at)}</p>
          </div>
          {request.is_confidential && <Badge variant="warning">{t('prayerRequest.confidential')}</Badge>}
        </div>
        <Card>
          <CardBody>
            <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700 dark:text-neutral-200">{request.message}</p>
          </CardBody>
        </Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label={t('prayerRequest.status')} htmlFor="prayer-status">
            <Select id="prayer-status" value={status} onChange={(event) => setStatus(event.target.value)}>
              {STATUSES.map((value) => <option key={value} value={value}>{t(`prayerRequest.statuses.${value}`)}</option>)}
            </Select>
          </FormField>
          <FormField label={t('prayerRequest.internalNotes')} htmlFor="prayer-internal-notes">
            <textarea
              id="prayer-internal-notes"
              rows={4}
              value={internalNotes}
              onChange={(event) => setInternalNotes(event.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-2 focus:outline-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </FormField>
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? t('common.loading') : t('common.save')}</Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default function PrayerRequestsPage() {
  const { t } = useTranslation()
  const [requests, setRequests] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setRequests(null)
    setError('')
    listPrayerRequests(statusFilter ? { status: statusFilter } : undefined)
      .then((data) => { if (active) setRequests(data.results) })
      .catch((loadError) => {
        if (active) {
          setError(getErrorDetail(loadError, t('common.error')))
          setRequests([])
        }
      })
    return () => { active = false }
  }, [statusFilter, t])

  const columns = [
    {
      key: 'name',
      header: t('prayerRequest.requester'),
      render: (item) => <div><p className="font-medium">{item.name}</p><p className="text-xs text-neutral-500">{item.email || '—'}</p></div>,
    },
    {
      key: 'message',
      header: t('prayerRequest.requestLabel'),
      render: (item) => <p className="line-clamp-2 max-w-sm">{item.message}</p>,
    },
    { key: 'created_at', header: t('common.date'), render: (item) => formatDateTime(item.created_at) },
    {
      key: 'status',
      header: t('prayerRequest.status'),
      render: (item) => (
        <Badge variant={item.status === 'ANSWERED' ? 'success' : item.status === 'CLOSED' ? 'neutral' : item.status === 'NEW' ? 'warning' : 'primary'}>
          {t(`prayerRequest.statuses.${item.status}`)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: t('common.actions'),
      render: (item) => <Button variant="outline" size="sm" onClick={() => setSelectedRequest(item)}>{t('common.review')}</Button>,
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">{t('prayerRequest.adminEyebrow')}</p>
          <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('prayerRequest.inboxTitle')}</h1>
        </div>
        <FormField label={t('prayerRequest.filterStatus')} htmlFor="prayer-filter" className="w-full sm:w-56">
          <Select id="prayer-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">{t('common.all')}</option>
            {STATUSES.map((value) => <option key={value} value={value}>{t(`prayerRequest.statuses.${value}`)}</option>)}
          </Select>
        </FormField>
      </div>

      {requests === null ? (
        <div className="flex justify-center py-16"><Spinner size={28} /></div>
      ) : error ? (
        <Card><CardBody><p role="alert" className="text-sm text-danger">{error}</p></CardBody></Card>
      ) : (
        <ResponsiveTable
          columns={columns}
          rows={requests}
          emptyState={<EmptyState icon={HandHeart} title={t('prayerRequest.noInboxRequests')} />}
        />
      )}

      {selectedRequest && (
        <ReviewPrayerRequestModal
          key={selectedRequest.id}
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSaved={(updated) => {
            setRequests((current) => current.map((item) => item.id === updated.id ? updated : item))
            setSelectedRequest(null)
          }}
        />
      )}
    </div>
  )
}