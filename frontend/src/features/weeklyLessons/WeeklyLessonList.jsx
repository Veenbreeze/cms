import { useEffect, useState } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, EmptyState, Modal, ResponsiveTable, Spinner } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getErrorDetail } from '../../services/api/apiError'
import { deactivateWeeklyLesson, listWeeklyLessons } from '../../services/api/weeklyLessonService'
import { formatDate } from '../../utils/formatDate'
import { isStaffRole } from '../../utils/roles'
import WeeklyLessonForm from './WeeklyLessonForm'

export default function WeeklyLessonList() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { showToast } = useToast()
  const canManage = isStaffRole(user?.role)

  const [lessons, setLessons] = useState(null)
  const [modalState, setModalState] = useState(null)

  const loadLessons = () => {
    listWeeklyLessons().then((data) => setLessons(data.results))
  }

  useEffect(loadLessons, [])

  const handleSaved = () => {
    setModalState(null)
    loadLessons()
  }

  const handleDeactivate = async (lesson) => {
    if (!window.confirm(t('weeklyLessons.deactivateConfirm'))) return
    try {
      await deactivateWeeklyLesson(lesson.id)
      showToast({ type: 'success', message: t('common.success') })
      loadLessons()
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    }
  }

  if (!lessons) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    )
  }

  const columns = [
    { key: 'title', header: t('weeklyLessons.title'), render: (row) => <span className="font-medium">{row.title}</span> },
    { key: 'scripture_reference', header: t('weeklyLessons.scriptureReference') },
    { key: 'week_start_date', header: t('weeklyLessons.weekStartDate'), render: (row) => formatDate(row.week_start_date) },
    { key: 'author_name', header: t('weeklyLessons.authorName'), render: (row) => row.author_name || '—' },
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
        <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('weeklyLessons.title')}</h1>
        {canManage && (
          <Button onClick={() => setModalState('create')}>
            <Plus className="h-4 w-4" />
            {t('weeklyLessons.addLesson')}
          </Button>
        )}
      </div>

      <ResponsiveTable columns={columns} rows={lessons} emptyState={<EmptyState icon={BookOpen} title={t('weeklyLessons.noLessons')} />} />

      <Modal
        open={!!modalState}
        onClose={() => setModalState(null)}
        title={modalState === 'create' ? t('weeklyLessons.addLesson') : t('common.edit')}
        size="lg"
      >
        <WeeklyLessonForm
          lesson={modalState && modalState !== 'create' ? modalState : null}
          onSaved={handleSaved}
          onCancel={() => setModalState(null)}
        />
      </Modal>
    </div>
  )
}
