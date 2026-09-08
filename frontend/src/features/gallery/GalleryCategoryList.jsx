import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, EmptyState, Input } from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { getErrorDetail } from '../../services/api/apiError'
import { createGalleryCategory, deactivateGalleryCategory, listGalleryCategories } from '../../services/api/galleryService'

export default function GalleryCategoryList({ onChanged }) {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [categories, setCategories] = useState(null)
  const [newName, setNewName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const load = () => {
    listGalleryCategories().then((data) => {
      setCategories(data.results)
      onChanged?.()
    })
  }

  useEffect(load, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = async (event) => {
    event.preventDefault()
    if (!newName.trim()) return
    setIsSubmitting(true)
    try {
      await createGalleryCategory({ name: newName.trim() })
      setNewName('')
      load()
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = async (category) => {
    if (!window.confirm(t('gallery.deactivateConfirm'))) return
    try {
      await deactivateGalleryCategory(category.id)
      load()
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    }
  }

  if (!categories) return null

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder={t('gallery.categoryName')} />
        <Button type="submit" disabled={isSubmitting}>
          {t('gallery.addCategory')}
        </Button>
      </form>

      {categories.length === 0 ? (
        <EmptyState title={t('gallery.noCategories')} />
      ) : (
        <ul className="space-y-1.5">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800"
            >
              {category.name}
              <Button variant="ghost" size="sm" onClick={() => handleRemove(category)}>
                {t('common.delete')}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
