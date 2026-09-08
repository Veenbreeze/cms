import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Select } from '../../components/ui'
import { getErrorDetail, getFieldErrors } from '../../services/api/apiError'
import { createAnnouncement, updateAnnouncement } from '../../services/api/announcementService'
import { listJumuia } from '../../services/api/jumuiaService'
import { buildFormData } from '../../utils/buildFormData'
import { cleanPayload } from '../../utils/cleanPayload'
import { ROLES } from '../../utils/roles'

function toLocalDateTimeInput(value) {
  return value ? value.slice(0, 16) : ''
}

export default function AnnouncementForm({ announcement, onSaved, onCancel }) {
  const { t } = useTranslation()
  const [jumuiaOptions, setJumuiaOptions] = useState([])
  const [values, setValues] = useState({
    title: announcement?.title || '',
    body: announcement?.body || '',
    category: announcement?.category || 'GENERAL',
    priority: announcement?.priority || 'NORMAL',
    target_audience: announcement?.target_audience || 'EVERYONE',
    target_jumuia: announcement?.target_jumuia || '',
    target_role: announcement?.target_role || '',
    is_pinned: announcement?.is_pinned || false,
    published_at: toLocalDateTimeInput(announcement?.published_at),
    expires_at: toLocalDateTimeInput(announcement?.expires_at),
  })
  const [imageFile, setImageFile] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    listJumuia({ page_size: 100 }).then((data) => setJumuiaOptions(data.results))
  }, [])

  const setField = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setFieldErrors({})
    setIsSubmitting(true)
    try {
      const payload = imageFile ? buildFormData({ ...values, image: imageFile }) : cleanPayload(values)
      const saved = announcement ? await updateAnnouncement(announcement.id, payload) : await createAnnouncement(payload)
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
      <FormField label={t('announcements.title')} htmlFor="title" required error={fieldErrors.title}>
        <Input id="title" required value={values.title} onChange={setField('title')} />
      </FormField>
      <FormField label={t('announcements.body')} htmlFor="body" required error={fieldErrors.body}>
        <textarea
          id="body"
          required
          rows={4}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-1 focus:outline-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          value={values.body}
          onChange={setField('body')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('announcements.category')} htmlFor="category" error={fieldErrors.category}>
          <Select id="category" value={values.category} onChange={setField('category')}>
            {Object.entries(t('announcements.categories', { returnObjects: true })).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label={t('announcements.priority')} htmlFor="priority" error={fieldErrors.priority}>
          <Select id="priority" value={values.priority} onChange={setField('priority')}>
            {Object.entries(t('announcements.priorities', { returnObjects: true })).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label={t('announcements.audience')} htmlFor="target_audience" error={fieldErrors.target_audience}>
        <Select id="target_audience" value={values.target_audience} onChange={setField('target_audience')}>
          {Object.entries(t('announcements.audiences', { returnObjects: true })).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </FormField>

      {values.target_audience === 'JUMUIA' && (
        <FormField label={t('announcements.targetJumuia')} htmlFor="target_jumuia" error={fieldErrors.target_jumuia}>
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
        <FormField label={t('announcements.targetRole')} htmlFor="target_role" error={fieldErrors.target_role}>
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

      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('announcements.publishedAt')} htmlFor="published_at" error={fieldErrors.published_at}>
          <Input id="published_at" type="datetime-local" value={values.published_at} onChange={setField('published_at')} />
        </FormField>
        <FormField label={t('announcements.expiresAt')} htmlFor="expires_at" error={fieldErrors.expires_at}>
          <Input id="expires_at" type="datetime-local" value={values.expires_at} onChange={setField('expires_at')} />
        </FormField>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          checked={values.is_pinned}
          onChange={(event) => setValues((current) => ({ ...current, is_pinned: event.target.checked }))}
        />
        {t('announcements.isPinned')}
      </label>

      <FormField label={t('common.image')}>
        <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
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
