import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input } from '../../components/ui'
import { getErrorDetail, getFieldErrors } from '../../services/api/apiError'
import { createJumuia, updateJumuia } from '../../services/api/jumuiaService'

export default function JumuiaForm({ jumuia, onSaved, onCancel }) {
  const { t } = useTranslation()
  const [values, setValues] = useState({
    name: jumuia?.name || '',
    code: jumuia?.code || '',
    description: jumuia?.description || '',
    meeting_day: jumuia?.meeting_day || '',
    meeting_location: jumuia?.meeting_location || '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setField = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setFieldErrors({})
    setIsSubmitting(true)
    try {
      const saved = jumuia ? await updateJumuia(jumuia.id, values) : await createJumuia(values)
      onSaved(saved)
    } catch (error) {
      setFieldErrors(getFieldErrors(error))
      setFormError(getErrorDetail(error, t('common.error')))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label={t('jumuia.name')} htmlFor="name" required error={fieldErrors.name}>
        <Input id="name" required value={values.name} onChange={setField('name')} />
      </FormField>
      <FormField label={t('jumuia.code')} htmlFor="code" required error={fieldErrors.code}>
        <Input id="code" required value={values.code} onChange={setField('code')} />
      </FormField>
      <FormField label={t('jumuia.description')} htmlFor="description" error={fieldErrors.description}>
        <Input id="description" value={values.description} onChange={setField('description')} />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('jumuia.meetingDay')} htmlFor="meeting_day" error={fieldErrors.meeting_day}>
          <Input id="meeting_day" value={values.meeting_day} onChange={setField('meeting_day')} />
        </FormField>
        <FormField label={t('jumuia.meetingLocation')} htmlFor="meeting_location" error={fieldErrors.meeting_location}>
          <Input id="meeting_location" value={values.meeting_location} onChange={setField('meeting_location')} />
        </FormField>
      </div>

      {formError && <p className="text-sm text-danger">{formError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('common.loading') : t('common.save')}
        </Button>
      </div>
    </form>
  )
}
