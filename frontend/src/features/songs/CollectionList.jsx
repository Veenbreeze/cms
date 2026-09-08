import { useEffect, useState } from 'react'
import { Plus, QrCode } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, EmptyState, Modal, ResponsiveTable, Spinner } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getErrorDetail } from '../../services/api/apiError'
import {
  deactivateSongCollection,
  generateCollectionQr,
  listSongCollections,
} from '../../services/api/songService'
import { formatDate } from '../../utils/formatDate'
import { isStaffRole } from '../../utils/roles'
import CollectionForm from './CollectionForm'

export default function CollectionList() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { showToast } = useToast()
  const canManage = isStaffRole(user?.role)

  const [collections, setCollections] = useState(null)
  const [modalState, setModalState] = useState(null)
  const [qrRecord, setQrRecord] = useState(null)
  const [generatingId, setGeneratingId] = useState(null)

  const loadCollections = () => {
    listSongCollections().then((data) => setCollections(data.results))
  }

  useEffect(loadCollections, [])

  const handleSaved = () => {
    setModalState(null)
    loadCollections()
  }

  const handleDeactivate = async (collection) => {
    if (!window.confirm(t('songs.collections.deactivateConfirm'))) return
    try {
      await deactivateSongCollection(collection.id)
      showToast({ type: 'success', message: t('common.success') })
      loadCollections()
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    }
  }

  const handleGenerateQr = async (collection) => {
    setGeneratingId(collection.id)
    try {
      const record = await generateCollectionQr(collection.id)
      setQrRecord(record)
      showToast({ type: 'success', message: t('songs.collections.qrGenerated') })
      loadCollections()
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    } finally {
      setGeneratingId(null)
    }
  }

  if (!collections) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    )
  }

  const columns = [
    { key: 'date', header: t('songs.collections.date'), render: (row) => formatDate(row.date) },
    { key: 'service_name', header: t('songs.collections.serviceName'), render: (row) => row.service_name || '—' },
    { key: 'items', header: t('songs.collections.items'), render: (row) => row.items?.length || 0 },
    {
      key: 'qr',
      header: 'QR',
      render: (row) =>
        row.qr_code ? (
          <Button variant="ghost" size="sm" onClick={() => setQrRecord(row.qr_code)}>
            <QrCode className="h-3.5 w-3.5" />
            {t('songs.collections.scans')}: {row.qr_code.scan_count}
          </Button>
        ) : canManage ? (
          <Button variant="outline" size="sm" disabled={generatingId === row.id} onClick={() => handleGenerateQr(row)}>
            <QrCode className="h-3.5 w-3.5" />
            {t('songs.collections.generateQr')}
          </Button>
        ) : (
          '—'
        ),
    },
    ...(canManage
      ? [
          {
            key: 'actions',
            header: t('common.actions'),
            render: (row) => (
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setModalState(row)}>
                  {t('common.edit')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeactivate(row)}>
                  {t('common.delete')}
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        {canManage && (
          <Button onClick={() => setModalState('create')}>
            <Plus className="h-4 w-4" />
            {t('songs.collections.addCollection')}
          </Button>
        )}
      </div>

      <ResponsiveTable
        columns={columns}
        rows={collections}
        emptyState={<EmptyState icon={QrCode} title={t('songs.collections.noCollections')} />}
      />

      <Modal
        open={!!modalState}
        onClose={() => setModalState(null)}
        title={modalState === 'create' ? t('songs.collections.addCollection') : t('common.edit')}
        size="lg"
      >
        <CollectionForm
          collection={modalState && modalState !== 'create' ? modalState : null}
          onSaved={handleSaved}
          onCancel={() => setModalState(null)}
        />
      </Modal>

      <Modal open={!!qrRecord} onClose={() => setQrRecord(null)} title={t('songs.collections.generateQr')}>
        {qrRecord && (
          <div className="flex flex-col items-center gap-4">
            {qrRecord.qr_image && <img src={qrRecord.qr_image} alt="QR code" className="h-48 w-48" />}
            <p className="break-all text-center text-sm text-neutral-500 dark:text-neutral-400">{qrRecord.target_url}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('songs.collections.scans')}: {qrRecord.scan_count}
            </p>
            {qrRecord.qr_image && (
              <Button as="a" href={qrRecord.qr_image} download variant="outline">
                {t('songs.collections.downloadQr')}
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
