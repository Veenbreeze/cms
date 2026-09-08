import { useEffect, useState } from 'react'
import { Users2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Card, CardBody, EmptyState, Spinner } from '../../components/ui'
import { getPublicLeadership } from '../../services/api/servantHistoryService'

function LeaderCard({ leader, t }) {
  return (
    <Card className="flex flex-col items-center gap-3 p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-warm-md)]">
      {leader.photo ? (
        <img src={leader.photo} alt="" className="h-28 w-28 rounded-full object-cover" />
      ) : (
        <span className="flex h-28 w-28 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200">
          <Users2 className="h-12 w-12" />
        </span>
      )}
      <div>
        <p className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100">{leader.full_name}</p>
        <p className="text-sm font-medium text-primary-700 dark:text-primary-300">{leader.position_title}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {leader.start_year}–{leader.end_year || t('servantsHistory.present')}
        </p>
        {leader.biography && <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{leader.biography}</p>}
      </div>
    </Card>
  )
}

export default function LeadershipSection() {
  const { t } = useTranslation()
  const [leaders, setLeaders] = useState(undefined)

  useEffect(() => {
    getPublicLeadership()
      .then((data) => setLeaders(data.results))
      .catch(() => setLeaders(null))
  }, [])

  if (leaders === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    )
  }

  if (!leaders || leaders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 md:px-6">
        <Card>
          <CardBody>
            <EmptyState icon={Users2} title={t('leadership.comingSoonTitle')} description={t('leadership.comingSoonBody')} />
          </CardBody>
        </Card>
      </div>
    )
  }

  const current = leaders.filter((leader) => !leader.end_year)
  const past = leaders.filter((leader) => leader.end_year).sort((a, b) => b.start_year - a.start_year)

  return (
    <div>
      {current.length > 0 && (
        <section id="current" className="scroll-mt-24">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
            <h2 className="mb-6 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('leadership.currentTitle')}</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {current.map((leader) => (
                <LeaderCard key={leader.id} leader={leader} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section id="history" className="scroll-mt-24 bg-neutral-50 dark:bg-neutral-900/40">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
            <h2 className="mb-6 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('leadership.historyTitle')}</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((leader) => (
                <LeaderCard key={leader.id} leader={leader} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
