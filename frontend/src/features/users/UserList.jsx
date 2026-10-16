import { useEffect, useState } from 'react'
import { Plus, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge, Button, EmptyState, Modal, ResponsiveTable, Spinner } from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { getErrorDetail } from '../../services/api/apiError'
import { deactivateUser, listUsers } from '../../services/api/userService'
import UserForm from './UserForm'

export default function UserList() {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [users, setUsers] = useState(null)
  const [modalState, setModalState] = useState(null)

  const loadUsers = () => listUsers().then((data) => setUsers(data.results))

  useEffect(() => {
    loadUsers()
  }, [])

  const handleSaved = () => {
    setModalState(null)
    loadUsers()
  }

  const handleDeactivate = async (user) => {
    if (!window.confirm(t('members.deactivateConfirm'))) return
    try {
      await deactivateUser(user.id)
      showToast({ type: 'success', message: t('common.success') })
      loadUsers()
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    }
  }

  if (!users) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    )
  }

  const columns = [
    { key: 'full_name', header: t('common.name') },
    { key: 'email', header: t('auth.email') },
    { key: 'role', header: t('users.role'), render: (row) => t(`users.roles.${row.role}`) },
    { key: 'member_name', header: t('users.memberRecord'), render: (row) => row.member_name || '—' },
    { key: 'jumuia_name', header: t('members.jumuia'), render: (row) => row.jumuia_name || '—' },
    {
      key: 'is_active',
      header: t('common.status'),
      render: (row) => <Badge variant={row.is_active ? 'success' : 'neutral'}>{row.is_active ? t('common.active') : t('common.inactive')}</Badge>,
    },
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('users.title')}</h1>
        <Button onClick={() => setModalState('create')}>
          <Plus className="h-4 w-4" />
          {t('users.addUser')}
        </Button>
      </div>

      <ResponsiveTable columns={columns} rows={users} emptyState={<EmptyState icon={Shield} title={t('users.noUsers')} />} />

      <Modal open={!!modalState} onClose={() => setModalState(null)} title={modalState === 'create' ? t('users.addUser') : t('common.edit')}>
        <UserForm user={modalState && modalState !== 'create' ? modalState : null} onSaved={handleSaved} onCancel={() => setModalState(null)} />
      </Modal>
    </div>
  )
}
