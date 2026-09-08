import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Select } from '../../components/ui'
import { getErrorDetail, getFieldErrors } from '../../services/api/apiError'
import { createEvent, updateEvent } from '../../services/api/eventService'
import { listJumuia } from '../../services/api/jumuiaService'
import { buildFormData } from '../../utils/buildFormData'
import { cleanPayload } from '../../utils/cleanPayload'
import { ROLES } from '../../utils/roles'

function toLocalDateTimeInput(value) {
  return value ? value.slice(0, 16) : ''
}

export default function EventForm({ event, onSaved, onCancel }) {
  const { t } = useTranslation()
  const [jumuiaOptions, setJumuiaOptions] = useState([])
  const [values, setValues] = useState({
    title: event?.title || '',
    description: event?.description || '',
    start_datetime: toLocalDateTimeInput(event?.start_datetime),
    end_datetime: toLocalDateTimeInput(event?.end_datetime),
    location: event?.location || '',
    category: event?.category || '',
    video_url: event?.video_url || '',
    target_audience: event?.target_audience || 'EVERYONE',
    target_jumuia: event?.target_jumuia || '',
    target_role: event?.target_role || '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    listJumuia({ page_size: 100 }).then((data) => setJumuiaOptions(data.results))
  }, [])

  const setField = (field) => (eventObj) => setValues((current) => ({ ...current, [field]: eventObj.target.value }))

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault()
    setFormError('')
    setFieldErrors({})
    setIsSubmitting(true)
    try {
      const payload = imageFile ? buildFormData({ ...values, image: imageFile }) : cleanPayload(values)
      const saved = event ? await updateEvent(event.id, payload) : await createEvent(payload)
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
      <FormField label={t('events.title')} htmlFor="title" required error={fieldErrors.title}>
        <Input id="title" required value={values.title} onChange={setField('title')} />
      </FormField>
      <FormField label={t('events.description')} htmlFor="description" error={fieldErrors.description}>
        <textarea
          id="description"
          rows={3}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-1 focus:outline-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          value={values.description}
          onChange={setField('description')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('events.startDatetime')} htmlFor="start_datetime" required error={fieldErrors.start_datetime}>
          <Input id="start_datetime" type="datetime-local" required value={values.start_datetime} onChange={setField('start_datetime')} />
        </FormField>
        <FormField label={t('events.endDatetime')} htmlFor="end_datetime" error={fieldErrors.end_datetime}>
          <Input id="end_datetime" type="datetime-local" value={values.end_datetime} onChange={setField('end_datetime')} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('events.location')} htmlFor="location" error={fieldErrors.location}>
          <Input id="location" value={values.location} onChange={setField('location')} />
        </FormField>
        <FormField label={t('events.category')} htmlFor="category" error={fieldErrors.category}>
          <Input id="category" value={values.category} onChange={setField('category')} />
        </FormField>
      </div>

      <FormField label={t('events.audience')} htmlFor="target_audience" error={fieldErrors.target_audience}>
        <Select id="target_audience" value={values.target_audience} onChange={setField('target_audience')}>
          {Object.entries(t('announcements.audiences', { returnObjects: true })).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </FormField>

      {values.target_audience === 'JUMUIA' && (
        <FormField label={t('events.targetJumuia')} htmlFor="target_jumuia" error={fieldErrors.target_jumuia}>
          <Select id="target_jumuia" value={values.target_jumuia} onChange={setField('target_jumuia')}>
            <option value="">—</option>
            {jumuiaOptions.map((jumuia) => (
              <option key={jumuia.id} value={jumuia.id}>
                {jumuia.name}
              </option>
            ))}
          </Select>
        </FormField>
      )}

      {values.target_audience === 'ROLE' && (
        <FormField label={t('events.targetRole')} htmlFor="target_role" error={fieldErrors.target_role}>
          <Select id="target_role" value={values.target_role} onChange={setField('target_role')}>
            <option value="">—</option>
            {Object.values(ROLES).map((role) => (
              <option key={role} value={role}>
                {t(`users.roles.${role}`)}
              </option>
            ))}
          </Select>
        </FormField>
      )}

      <FormField label={t('common.image')}>
        <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
      </FormField>

      <FormField label={t('events.videoUrl')} htmlFor="video_url" hint={t('events.videoUrlHint')} error={fieldErrors.video_url}>
        <Input
          id="video_url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={values.video_url}
          onChange={setField('video_url')}
        />
      </FormField>

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
