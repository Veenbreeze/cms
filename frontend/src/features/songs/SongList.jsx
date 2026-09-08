import { useEffect, useState } from 'react'
import { Music, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, EmptyState, Modal, ResponsiveTable, Spinner } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getErrorDetail } from '../../services/api/apiError'
import { deactivateSong, listSongs } from '../../services/api/songService'
import { isStaffRole } from '../../utils/roles'
import SongForm from './SongForm'

export default function SongList() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { showToast } = useToast()
  const canManage = isStaffRole(user?.role)

  const [songs, setSongs] = useState(null)
  const [modalState, setModalState] = useState(null)

  const loadSongs = () => {
    listSongs().then((data) => setSongs(data.results))
  }

  useEffect(loadSongs, [])

  const handleSaved = () => {
    setModalState(null)
    loadSongs()
  }

  const handleDeactivate = async (song) => {
    if (!window.confirm(t('songs.deactivateConfirm'))) return
    try {
      await deactivateSong(song.id)
      showToast({ type: 'success', message: t('common.success') })
      loadSongs()
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    }
  }

  if (!songs) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    )
  }

  const columns = [
    { key: 'number', header: t('songs.number'), render: (row) => row.number || '—' },
    { key: 'title', header: t('songs.title'), render: (row) => <span className="font-medium">{row.title}</span> },
    { key: 'category', header: t('songs.category'), render: (row) => row.category || '—' },
    { key: 'language', header: t('songs.language') },
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
            {t('songs.addSong')}
          </Button>
        )}
      </div>

      <ResponsiveTable columns={columns} rows={songs} emptyState={<EmptyState icon={Music} title={t('songs.noSongs')} />} />

      <Modal
        open={!!modalState}
        onClose={() => setModalState(null)}
        title={modalState === 'create' ? t('songs.addSong') : t('common.edit')}
      >
        <SongForm song={modalState && modalState !== 'create' ? modalState : null} onSaved={handleSaved} onCancel={() => setModalState(null)} />
      </Modal>
    </div>
  )
}
