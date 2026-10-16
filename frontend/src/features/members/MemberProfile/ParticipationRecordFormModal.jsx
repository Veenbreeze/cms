import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Modal, Select } from '../../../components/ui'
import { getErrorDetail, getFieldErrors } from '../../../services/api/apiError'
import { createParticipationRecord, updateParticipationRecord } from '../../../services/api/memberService'

const CATEGORIES = ['JUMUIA_MEETING', 'CHURCH_SERVICE', 'EVENT', 'MINISTRY_SERVICE']
const STATUSES = ['ATTENDED', 'ABSENT', 'EXCUSED']

export default function ParticipationRecordFormModal({ memberId, record, onClose, onSaved }) {
  const { t } = useTranslation()
  const [values, setValues] = useState(() => ({
    category: record?.category || 'JUMUIA_MEETING',
    activity_name: record?.activity_name || '',
    date: record?.date || '',
    status: record?.status || 'ATTENDED',
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
      const payload = { ...values, member: memberId }
      const saved = record
        ? await updateParticipationRecord(record.id, payload)
        : await createParticipationRecord(payload)
      onSaved(saved)
    } catch (error) {
      setErrors(getFieldErrors(error))
      setFormError(getErrorDetail(error, t('common.error')))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open onClose={onClose} title={t(record ? 'members.participation.editRecord' : 'members.participation.addRecord')}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField label={t('members.participation.category')} htmlFor="participation_category" required error={errors.category}>
          <Select id="participation_category" value={values.category} onChange={setField('category')}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{t(`members.participation.categories.${category}`)}</option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('members.participation.activityName')} htmlFor="participation_activity_name" required error={errors.activity_name}>
          <Input id="participation_activity_name" required value={values.activity_name} onChange={setField('activity_name')} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t('common.date')} htmlFor="participation_date" required error={errors.date}>
            <Input id="participation_date" type="date" required value={values.date} onChange={setField('date')} />
          </FormField>
          <FormField label={t('members.participation.status')} htmlFor="participation_status" required error={errors.status}>
            <Select id="participation_status" value={values.status} onChange={setField('status')}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>{t(`members.participation.statuses.${status}`)}</option>
              ))}
            </Select>
          </FormField>
        </div>

        <FormField label={t('common.notes')} htmlFor="participation_notes" error={errors.notes}>
          <textarea
            id="participation_notes"
            rows={3}
            value={values.notes}
            onChange={setField('notes')}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-2 focus:outline-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </FormField>

        {formError && <p className="text-sm text-danger" role="alert">{formError}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('common.loading') : t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}