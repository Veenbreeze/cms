import { Card, CardBody } from '../../components/ui'

export default function StatsCard({ label, value, icon: Icon, accent = 'primary' }) {
  const accentClasses = {
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
    accent: 'bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300',
    neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  }

  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accentClasses[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
          <p className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{value}</p>
        </div>
      </CardBody>
    </Card>
  )
}
