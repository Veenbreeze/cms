import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ScrollText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge, Button, EmptyState, ResponsiveTable, Select, Spinner } from '../../components/ui'
import { listAuditLogs } from '../../services/api/auditService'
import { formatDateTime } from '../../utils/formatDate'

const ACTION_VARIANTS = { CREATE: 'success', UPDATE: 'accent', DELETE: 'danger' }

export default function AuditLogList() {
  const { t } = useTranslation()
  const [action, setAction] = useState('')
  const [modelName, setModelName] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(null)
    listAuditLogs({ action: action || undefined, model_name: modelName || undefined, page }).then(setData)
  }, [action, modelName, page])

  const columns = [
    { key: 'created_at', header: t('audit.when'), render: (row) => formatDateTime(row.created_at) },
    { key: 'actor_name', header: t('audit.actor'), render: (row) => row.actor_name || row.actor_email || '—' },
    { key: 'action', header: t('audit.action'), render: (row) => <Badge variant={ACTION_VARIANTS[row.action]}>{row.action}</Badge> },
    { key: 'model_name', header: t('audit.model') },
    { key: 'object_repr', header: t('audit.object') },
  ]

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('audit.title')}</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={action} onChange={(e) => { setAction(e.target.value); setPage(1) }} className="sm:w-48">
          <option value="">{t('audit.action')}</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </Select>
        <Select value={modelName} onChange={(e) => { setModelName(e.target.value); setPage(1) }} className="sm:w-48">
          <option value="">{t('audit.model')}</option>
          <option value="Member">Member</option>
          <option value="Jumuia">Jumuia</option>
          <option value="User">User</option>
        </Select>
      </div>

      {!data ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : (
        <>
          <ResponsiveTable columns={columns} rows={data.results} emptyState={<EmptyState icon={ScrollText} title={t('audit.noLogs')} />} />
          {data.count > 0 && (
            <div className="flex items-center justify-between pt-2 text-sm text-neutral-500 dark:text-neutral-400">
              <span>{data.count}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={!data.previous} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                  {t('common.back')}
                </Button>
                <Button variant="outline" size="sm" disabled={!data.next} onClick={() => setPage((p) => p + 1)}>
                  {t('common.next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
