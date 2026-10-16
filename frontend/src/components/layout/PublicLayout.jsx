import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { getPublicChurchInfo } from '../../services/api/churchService'
import PublicFooter from './PublicFooter'
import PublicHeader from './PublicHeader'
import ScrollToTop from './ScrollToTop'

export default function PublicLayout() {
  const [church, setChurch] = useState(null)

  useEffect(() => {
    getPublicChurchInfo()
      .then(setChurch)
      .catch(() => setChurch(null))
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <ScrollToTop />
      <PublicHeader />
      <main>
        <Outlet context={{ church }} />
      </main>
      <PublicFooter church={church} />
    </div>
  )
}
