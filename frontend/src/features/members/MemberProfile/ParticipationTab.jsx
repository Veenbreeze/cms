import { useState } from 'react'
import { HeartHandshake, Pencil, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge, Button, Card, CardBody, EmptyState } from '../../../components/ui'
import { useToast } from '../../../context/ToastContext'
import { getErrorDetail } from '../../../services/api/apiError'
import { deleteParticipationRecord } from '../../../services/api/memberService'
import { formatDate } from '../../../utils/formatDate'
import ParticipationRecordFormModal from './ParticipationRecordFormModal'

export default function ParticipationTab({ member, onRefresh }) {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [modalRecord, setModalRecord] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const records = member.participation_records || []

  const openForm = (record = null) => {
    setModalRecord(record)
    setIsModalOpen(true)
  }

  const handleDelete = async (record) => {
    if (!window.confirm(t('members.participation.deleteConfirm'))) return
    try {
      await deleteParticipationRecord(record.id)
      showToast({ type: 'success', message: t('common.success') })
      onRefresh()
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => openForm()}>
          <Plus className="h-4 w-4" />
          {t('members.participation.addRecord')}
        </Button>
      </div>

      {records.length === 0 ? (
        <EmptyState icon={HeartHandshake} title={t('members.participation.noRecords')} />
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <Card key={record.id}>
              <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{record.activity_name}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {t(`members.participation.categories.${record.category}`)} · {formatDate(record.date)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={record.status === 'ATTENDED' ? 'success' : record.status === 'ABSENT' ? 'warning' : 'neutral'}>
                    {t(`members.participation.statuses.${record.status}`)}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => openForm(record)} aria-label={t('common.edit')}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(record)} aria-label={t('common.delete')}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ParticipationRecordFormModal
          memberId={member.id}
          record={modalRecord}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false)
            onRefresh()
          }}
        />
      )}
    </div>
  )
}
