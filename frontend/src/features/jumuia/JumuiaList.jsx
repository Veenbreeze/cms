import { useEffect, useState } from 'react'
import { Plus, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Badge, Button, EmptyState, Modal, ResponsiveTable, Spinner } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { ROUTES } from '../../routes/routePaths'
import { deactivateJumuia, listJumuia } from '../../services/api/jumuiaService'
import { getErrorDetail } from '../../services/api/apiError'
import { isAdminRole } from '../../utils/roles'
import JumuiaForm from './JumuiaForm'

export default function JumuiaList() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const canManage = isAdminRole(user?.role)

  const [jumuiaList, setJumuiaList] = useState(null)
  const [modalState, setModalState] = useState(null) // null | 'create' | jumuia object to edit

  const loadJumuia = () => {
    listJumuia().then((data) => setJumuiaList(data.results))
  }

  useEffect(loadJumuia, [])

  const handleSaved = () => {
    setModalState(null)
    loadJumuia()
  }

  const handleDeactivate = async (jumuia, event) => {
    event.stopPropagation()
    if (!window.confirm(t('jumuia.deactivateConfirm'))) return
    try {
      await deactivateJumuia(jumuia.id)
      showToast({ type: 'success', message: t('common.success') })
      loadJumuia()
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('jumuia.deactivateBlocked')) })
    }
  }

  if (!jumuiaList) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    )
  }

  const columns = [
    { key: 'name', header: t('jumuia.name'), render: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'code', header: t('jumuia.code') },
    { key: 'member_count', header: t('jumuia.memberCount') },
    { key: 'chairperson_name', header: t('jumuia.chairperson'), render: (row) => row.chairperson_name || '—' },
    {
      key: 'is_active',
      header: t('common.status'),
      render: (row) => <Badge variant={row.is_active ? 'success' : 'neutral'}>{row.is_active ? t('common.active') : t('common.inactive')}</Badge>,
    },
    ...(canManage
      ? [
          {
            key: 'actions',
            header: t('common.actions'),
            render: (row) => (
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setModalState(row) }}>
                  {t('common.edit')}
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => handleDeactivate(row, e)}>
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
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('jumuia.title')}</h1>
        {canManage && (
          <Button onClick={() => setModalState('create')}>
            <Plus className="h-4 w-4" />
            {t('jumuia.addJumuia')}
          </Button>
        )}
      </div>

      <ResponsiveTable
        columns={columns}
        rows={jumuiaList}
        onRowClick={(row) => navigate(ROUTES.jumuiaDetail(row.id))}
        emptyState={<EmptyState icon={UsersRound} title={t('jumuia.noJumuia')} />}
      />

      <Modal
        open={!!modalState}
        onClose={() => setModalState(null)}
        title={modalState === 'create' ? t('jumuia.addJumuia') : t('common.edit')}
      >
        <JumuiaForm
          jumuia={modalState && modalState !== 'create' ? modalState : null}
          onSaved={handleSaved}
          onCancel={() => setModalState(null)}
        />
      </Modal>
    </div>
  )
}
