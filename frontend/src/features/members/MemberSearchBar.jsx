import { useEffect, useRef, useState } from 'react'
import { Search, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Input, Spinner } from '../../components/ui'
import { useDebounce } from '../../hooks/useDebounce'
import { ROUTES } from '../../routes/routePaths'
import { listMembers } from '../../services/api/memberService'

export default function MemberSearchBar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([])
      return
    }
    let cancelled = false
    setIsLoading(true)
    listMembers({ search: debouncedQuery, page_size: 6 })
      .then((data) => {
        if (!cancelled) setResults(data.results)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const goToMember = (member) => {
    setIsOpen(false)
    setQuery('')
    navigate(ROUTES.memberDetail(member.id))
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t('common.searchPlaceholder')}
          className="pl-9"
        />
      </div>

      {isOpen && debouncedQuery.trim().length >= 2 && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[var(--shadow-warm-md)] dark:border-neutral-800 dark:bg-neutral-900">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Spinner size={18} />
            </div>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">{t('members.noMembers')}</p>
          ) : (
            <ul>
              {results.map((member) => (
                <li key={member.id}>
                  <button
                    onClick={() => goToMember(member)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <User className="h-4 w-4 text-neutral-400" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-neutral-800 dark:text-neutral-100">
                        {member.full_name}
                      </span>
                      <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {member.member_no} &middot; {member.jumuia_name}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
