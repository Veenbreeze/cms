import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import MobileDrawer from './MobileDrawer'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <aside className="hidden w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 md:block">
        <Sidebar />
      </aside>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
