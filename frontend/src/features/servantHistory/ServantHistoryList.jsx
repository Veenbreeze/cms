import { useEffect, useState } from 'react'
import { History, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, EmptyState, Modal, ResponsiveTable, Spinner } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getErrorDetail } from '../../services/api/apiError'
import { deactivateServant, listServants } from '../../services/api/servantHistoryService'
import { isStaffRole } from '../../utils/roles'
import ServantHistoryForm from './ServantHistoryForm'

export default function ServantHistoryList() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { showToast } = useToast()
  const canManage = isStaffRole(user?.role)

  const [servants, setServants] = useState(null)
  const [modalState, setModalState] = useState(null)

  const loadServants = () => {
    listServants().then((data) => setServants(data.results))
  }

  useEffect(loadServants, [])

  const handleSaved = () => {
    setModalState(null)
    loadServants()
  }

  const handleDeactivate = async (servant) => {
    if (!window.confirm(t('servantsHistory.deactivateConfirm'))) return
    try {
      await deactivateServant(servant.id)
      showToast({ type: 'success', message: t('common.success') })
      loadServants()
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    }
  }

  if (!servants) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    )
  }

  const columns = [
    { key: 'full_name', header: t('servantsHistory.fullName'), render: (row) => <span className="font-medium">{row.full_name}</span> },
    { key: 'position_title', header: t('servantsHistory.positionTitle') },
    { key: 'jumuia_name', header: t('servantsHistory.jumuia'), render: (row) => row.jumuia_name || '—' },
    {
      key: 'years',
      header: `${t('servantsHistory.startYear')} — ${t('servantsHistory.endYear')}`,
      render: (row) => `${row.start_year}–${row.end_year || t('servantsHistory.present')}`,
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
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('servantsHistory.title')}</h1>
        {canManage && (
          <Button onClick={() => setModalState('create')}>
            <Plus className="h-4 w-4" />
            {t('servantsHistory.addServant')}
          </Button>
        )}
      </div>

      <ResponsiveTable columns={columns} rows={servants} emptyState={<EmptyState icon={History} title={t('servantsHistory.noServants')} />} />

      <Modal
        open={!!modalState}
        onClose={() => setModalState(null)}
        title={modalState === 'create' ? t('servantsHistory.addServant') : t('common.edit')}
        size="lg"
      >
        <ServantHistoryForm
          servant={modalState && modalState !== 'create' ? modalState : null}
          onSaved={handleSaved}
          onCancel={() => setModalState(null)}
        />
      </Modal>
    </div>
  )
}
