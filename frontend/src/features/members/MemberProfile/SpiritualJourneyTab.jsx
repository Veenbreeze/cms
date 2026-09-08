import { useState } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, EmptyState } from '../../../components/ui'
import SpiritualRecordCard from '../../spiritualRecords/SpiritualRecordCard'
import SpiritualRecordFormModal from '../../spiritualRecords/SpiritualRecordFormModal'

export default function SpiritualJourneyTab({ member, onRefresh }) {
  const { t } = useTranslation()
  const [modalRecord, setModalRecord] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const records = member.spiritual_records || []

  const openCreate = () => {
    setModalRecord(null)
    setIsModalOpen(true)
  }

  const openEdit = (record) => {
    setModalRecord(record)
    setIsModalOpen(true)
  }

  const handleSaved = () => {
    setIsModalOpen(false)
    onRefresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          {t('members.spiritual.addRecord')}
        </Button>
      </div>

      {records.length === 0 ? (
        <EmptyState icon={Sparkles} title={t('members.spiritual.noRecords')} />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {records.map((record) => (
            <SpiritualRecordCard key={record.id} record={record} onEdit={openEdit} />
          ))}
        </div>
      )}

      <SpiritualRecordFormModal
        open={isModalOpen}
        memberId={member.id}
        record={modalRecord}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  )
}
