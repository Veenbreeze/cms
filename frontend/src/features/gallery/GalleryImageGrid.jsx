import { useEffect, useState } from 'react'
import { Image as ImageIcon, Plus, Settings, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, EmptyState, Modal, Select, Spinner } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getErrorDetail } from '../../services/api/apiError'
import { deleteGalleryImage, listGalleryCategories, listGalleryImages } from '../../services/api/galleryService'
import { formatDate } from '../../utils/formatDate'
import { isStaffRole } from '../../utils/roles'
import GalleryCategoryList from './GalleryCategoryList'
import GalleryUploadForm from './GalleryUploadForm'

export default function GalleryImageGrid() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { showToast } = useToast()
  const canManage = isStaffRole(user?.role)

  const [images, setImages] = useState(null)
  const [categories, setCategories] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [showCategories, setShowCategories] = useState(false)

  const loadCategories = () => listGalleryCategories().then((data) => setCategories(data.results))
  const loadImages = () => listGalleryImages(categoryFilter ? { category: categoryFilter } : undefined).then((data) => setImages(data.results))

  useEffect(() => {
    loadCategories()
  }, [])
  useEffect(() => {
    loadImages()
  }, [categoryFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUploaded = () => {
    setShowUpload(false)
    loadImages()
  }

  const handleDelete = async (image) => {
    if (!window.confirm(t('gallery.deactivateConfirm'))) return
    try {
      await deleteGalleryImage(image.id)
      showToast({ type: 'success', message: t('common.success') })
      loadImages()
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="max-w-xs">
          <option value="">{t('gallery.categories')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        {canManage && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCategories(true)}>
              <Settings className="h-4 w-4" />
              {t('gallery.categories')}
            </Button>
            <Button onClick={() => setShowUpload(true)}>
              <Plus className="h-4 w-4" />
              {t('gallery.addPhoto')}
            </Button>
          </div>
        )}
      </div>

      {!images ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : images.length === 0 ? (
        <EmptyState icon={ImageIcon} title={t('gallery.noPhotos')} />
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="group relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
              <img src={image.image} alt={image.caption || ''} className="aspect-square w-full object-cover" />
              {canManage && (
                <button
                  onClick={() => handleDelete(image)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={t('common.delete')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {(image.caption || image.taken_on) && (
                <div className="p-2 text-xs text-neutral-500 dark:text-neutral-400">
                  {image.caption && <p className="truncate">{image.caption}</p>}
                  {image.taken_on && <p>{formatDate(image.taken_on)}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={showUpload} onClose={() => setShowUpload(false)} title={t('gallery.addPhoto')}>
        <GalleryUploadForm categories={categories} onSaved={handleUploaded} onCancel={() => setShowUpload(false)} />
      </Modal>

      <Modal open={showCategories} onClose={() => setShowCategories(false)} title={t('gallery.categories')}>
        <GalleryCategoryList onChanged={loadCategories} />
      </Modal>
    </div>
  )
}
