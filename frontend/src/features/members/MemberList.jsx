import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Search, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { Avatar, Badge, Button, EmptyState, Input, ResponsiveTable, Select, Spinner } from '../../components/ui'
import { useDebounce } from '../../hooks/useDebounce'
import { ROUTES } from '../../routes/routePaths'
import { listJumuia } from '../../services/api/jumuiaService'
import { listMembers } from '../../services/api/memberService'

export default function MemberList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [jumuiaFilter, setJumuiaFilter] = useState(searchParams.get('jumuia') || '')
  const [page, setPage] = useState(1)
  const [jumuiaOptions, setJumuiaOptions] = useState([])
  const [data, setData] = useState(null)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    listJumuia().then((res) => setJumuiaOptions(res.results))
  }, [])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, jumuiaFilter])

  useEffect(() => {
    setData(null)
    listMembers({ search: debouncedSearch || undefined, jumuia: jumuiaFilter || undefined, page }).then(setData)
    const params = {}
    if (debouncedSearch) params.search = debouncedSearch
    if (jumuiaFilter) params.jumuia = jumuiaFilter
    setSearchParams(params, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, jumuiaFilter, page])

  const columns = [
    {
      key: 'full_name',
      header: t('members.fullName'),
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.profile_photo} name={row.full_name} size="sm" />
          <div>
            <p className="font-medium text-neutral-800 dark:text-neutral-100">{row.full_name}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{row.member_no}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: t('common.phone'), render: (row) => row.phone || '—' },
    { key: 'jumuia_name', header: t('members.jumuia') },
    {
      key: 'is_active',
      header: t('common.status'),
      render: (row) => (
        <Badge variant={row.is_active ? 'success' : 'neutral'}>{row.is_active ? t('common.active') : t('common.inactive')}</Badge>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('members.title')}</h1>
        <Button as={Link} to={ROUTES.MEMBER_NEW}>
          <Plus className="h-4 w-4" />
          {t('members.addMember')}
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('common.searchPlaceholder')}
            className="pl-9"
          />
        </div>
        <Select value={jumuiaFilter} onChange={(e) => setJumuiaFilter(e.target.value)} className="sm:w-56">
          <option value="">{t('nav.allJumuia')}</option>
          {jumuiaOptions.map((jumuia) => (
            <option key={jumuia.id} value={jumuia.id}>
              {jumuia.name}
            </option>
          ))}
        </Select>
      </div>

      {!data ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : (
        <>
          <ResponsiveTable
            columns={columns}
            rows={data.results}
            onRowClick={(row) => navigate(ROUTES.memberDetail(row.id))}
            emptyState={<EmptyState icon={UsersRound} title={t('members.noMembers')} description={t('members.noMembersHint')} />}
          />

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
