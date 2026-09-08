import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input } from '../../components/ui'
import { getErrorDetail, getFieldErrors } from '../../services/api/apiError'
import { createWeeklyLesson, updateWeeklyLesson } from '../../services/api/weeklyLessonService'
import { buildFormData } from '../../utils/buildFormData'
import { cleanPayload } from '../../utils/cleanPayload'

export default function WeeklyLessonForm({ lesson, onSaved, onCancel }) {
  const { t } = useTranslation()
  const [values, setValues] = useState({
    title: lesson?.title || '',
    scripture_reference: lesson?.scripture_reference || '',
    content: lesson?.content || '',
    week_start_date: lesson?.week_start_date || '',
    author_name: lesson?.author_name || '',
    notes: lesson?.notes || '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [documentFile, setDocumentFile] = useState(null)
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
      const hasFiles = imageFile || documentFile
      const payload = hasFiles
        ? buildFormData({ ...values, ...(imageFile && { image: imageFile }), ...(documentFile && { document: documentFile }) })
        : cleanPayload(values)
      const saved = lesson ? await updateWeeklyLesson(lesson.id, payload) : await createWeeklyLesson(payload)
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
      <FormField label={t('weeklyLessons.title')} htmlFor="title" required error={fieldErrors.title}>
        <Input id="title" required value={values.title} onChange={setField('title')} />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('weeklyLessons.scriptureReference')} htmlFor="scripture_reference" error={fieldErrors.scripture_reference}>
          <Input id="scripture_reference" value={values.scripture_reference} onChange={setField('scripture_reference')} />
        </FormField>
        <FormField label={t('weeklyLessons.weekStartDate')} htmlFor="week_start_date" required error={fieldErrors.week_start_date}>
          <Input id="week_start_date" type="date" required value={values.week_start_date} onChange={setField('week_start_date')} />
        </FormField>
      </div>
      <FormField label={t('weeklyLessons.content')} htmlFor="content" required error={fieldErrors.content}>
        <textarea
          id="content"
          required
          rows={6}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-1 focus:outline-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          value={values.content}
          onChange={setField('content')}
        />
      </FormField>
      <FormField label={t('weeklyLessons.authorName')} htmlFor="author_name" error={fieldErrors.author_name}>
        <Input id="author_name" value={values.author_name} onChange={setField('author_name')} />
      </FormField>
      <FormField label={t('common.notes')} htmlFor="notes" error={fieldErrors.notes}>
        <Input id="notes" value={values.notes} onChange={setField('notes')} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('common.image')}>
          <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
        </FormField>
        <FormField label={t('weeklyLessons.document')}>
          <input type="file" accept=".pdf,image/*" onChange={(event) => setDocumentFile(event.target.files?.[0] || null)} />
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
