import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Modal, Select } from '../../components/ui'
import { getErrorDetail, getFieldErrors } from '../../services/api/apiError'
import { createSpiritualRecord, updateSpiritualRecord } from '../../services/api/memberService'

const MILESTONE_TYPES = ['BAPTISM', 'FIRST_COMMUNION', 'CONFIRMATION', 'MARRIAGE', 'OTHER']

export default function SpiritualRecordFormModal({ open, memberId, record, onClose, onSaved }) {
  const { t } = useTranslation()
  const [values, setValues] = useState(() => ({
    milestone_type: record?.milestone_type || 'BAPTISM',
    custom_label: record?.custom_label || '',
    status: record?.status || 'COMPLETED',
    date: record?.date || '',
    place: record?.place || '',
    minister_name: record?.minister_name || '',
    notes: record?.notes || '',
  }))
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setField = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrors({})
    setFormError('')
    setIsSubmitting(true)
    try {
      const payload = { ...values, member: memberId, date: values.date || null }
      const saved = record ? await updateSpiritualRecord(record.id, payload) : await createSpiritualRecord(payload)
      onSaved(saved)
    } catch (error) {
      setErrors(getFieldErrors(error))
      setFormError(getErrorDetail(error, t('common.error')))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('members.spiritual.addRecord')}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField label={t('members.tabs.spiritualJourney')} htmlFor="milestone_type" required error={errors.milestone_type}>
          <Select id="milestone_type" value={values.milestone_type} onChange={setField('milestone_type')}>
            {MILESTONE_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`members.spiritual.${type === 'FIRST_COMMUNION' ? 'firstCommunion' : type.toLowerCase()}`)}
              </option>
            ))}
          </Select>
        </FormField>

        {values.milestone_type === 'OTHER' && (
          <FormField label={t('common.name')} htmlFor="custom_label" error={errors.custom_label}>
            <Input id="custom_label" value={values.custom_label} onChange={setField('custom_label')} />
          </FormField>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField label={t('members.spiritual.status')} htmlFor="status" error={errors.status}>
            <Select id="status" value={values.status} onChange={setField('status')}>
              <option value="COMPLETED">{t('members.spiritual.completed')}</option>
              <option value="SCHEDULED">{t('members.spiritual.scheduled')}</option>
            </Select>
          </FormField>
          <FormField label={t('common.date')} htmlFor="date" error={errors.date}>
            <Input id="date" type="date" value={values.date} onChange={setField('date')} />
          </FormField>
        </div>

        <FormField label={t('members.spiritual.place')} htmlFor="place" error={errors.place}>
          <Input id="place" value={values.place} onChange={setField('place')} />
        </FormField>
        <FormField label={t('members.spiritual.minister')} htmlFor="minister_name" error={errors.minister_name}>
          <Input id="minister_name" value={values.minister_name} onChange={setField('minister_name')} />
        </FormField>
        <FormField label={t('common.notes')} htmlFor="notes" error={errors.notes}>
          <Input id="notes" value={values.notes} onChange={setField('notes')} />
        </FormField>

        {formError && <p className="text-sm text-danger">{formError}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('common.loading') : t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
