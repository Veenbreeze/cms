import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Tabs } from '../components/ui'
import CollectionList from '../features/songs/CollectionList'
import SongList from '../features/songs/SongList'

export default function SongsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('library')

  const tabs = [
    { value: 'library', label: t('songs.tabs.library') },
    { value: 'collections', label: t('songs.tabs.collections') },
  ]

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('songs.title')}</h1>
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      {activeTab === 'library' && <SongList />}
      {activeTab === 'collections' && <CollectionList />}
    </div>
  )
}
