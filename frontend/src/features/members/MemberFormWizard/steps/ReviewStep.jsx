import { useTranslation } from 'react-i18next'

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-neutral-100 py-2 text-sm last:border-0 dark:border-neutral-800">
      <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className="font-medium text-neutral-800 dark:text-neutral-100">{value || '—'}</span>
    </div>
  )
}

export default function ReviewStep({ values, jumuiaName }) {
  const { t } = useTranslation()

  return (
    <div>
      <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">{t('members.wizard.reviewHint')}</p>
      <div className="rounded-lg border border-neutral-200 px-4 dark:border-neutral-800">
        <ReviewRow label={t('members.fullName')} value={values.full_name} />
        <ReviewRow label={t('members.gender')} value={values.gender} />
        <ReviewRow label={t('members.dateOfBirth')} value={values.date_of_birth} />
        <ReviewRow label={t('common.phone')} value={values.phone} />
        <ReviewRow label={t('common.email')} value={values.email} />
        <ReviewRow label={t('members.residentialAddress')} value={values.residential_address} />
        <ReviewRow label={t('members.jumuia')} value={jumuiaName} />
        <ReviewRow label={t('members.dateJoinedChurch')} value={values.date_joined_church} />
      </div>
    </div>
  )
}
