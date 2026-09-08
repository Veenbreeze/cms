import { useEffect, useState } from 'react'
import { ArrowLeft, UserCheck, Users, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { Button, Card, CardBody, Spinner } from '../components/ui'
import StatsCard from '../features/dashboard/StatsCard'
import { getJumuia, getJumuiaStats } from '../services/api/jumuiaService'
import { ROUTES } from '../routes/routePaths'

export default function JumuiaDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [jumuia, setJumuia] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getJumuia(id).then(setJumuia)
    getJumuiaStats(id).then(setStats)
  }, [id])

  if (!jumuia) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link to={ROUTES.JUMUIA} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-700 dark:text-neutral-400">
        <ArrowLeft className="h-4 w-4" />
        {t('jumuia.title')}
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{jumuia.name}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{jumuia.code}</p>
        </div>
        <Button as={Link} to={`${ROUTES.MEMBERS}?jumuia=${jumuia.id}`}>
          {t('nav.allMembers')}
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatsCard label={t('dashboard.totalMembers')} value={stats.total_members} icon={Users} accent="primary" />
          <StatsCard label={t('dashboard.maleMembers')} value={stats.male_members} icon={UserCheck} accent="neutral" />
          <StatsCard label={t('dashboard.femaleMembers')} value={stats.female_members} icon={UserCheck} accent="neutral" />
        </div>
      )}

      <Card>
        <CardBody className="space-y-3">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <UsersRound className="h-4 w-4" />
            <span className="text-sm">{jumuia.description || '—'}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400">{t('jumuia.meetingDay')}</p>
              <p className="font-medium text-neutral-800 dark:text-neutral-100">{jumuia.meeting_day || '—'}</p>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400">{t('jumuia.meetingLocation')}</p>
              <p className="font-medium text-neutral-800 dark:text-neutral-100">{jumuia.meeting_location || '—'}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
