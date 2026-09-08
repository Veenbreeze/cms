import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import PublicFooter from '../components/layout/PublicFooter'
import PublicHeader from '../components/layout/PublicHeader'
import { Spinner } from '../components/ui'
import { getPublicSongCollection, scanSongCollection } from '../services/api/publicContentService'
import { formatDate } from '../utils/formatDate'

export default function SongSheetPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [collection, setCollection] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getPublicSongCollection(id)
      .then(setCollection)
      .catch(() => setNotFound(true))
    scanSongCollection(id).catch(() => {})
  }, [id])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <PublicHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 md:px-6">
        {!collection && !notFound && (
          <div className="flex justify-center py-16">
            <Spinner size={28} />
          </div>
        )}
        {notFound && <p className="text-center text-neutral-500 dark:text-neutral-400">{t('songs.collections.noCollections')}</p>}
        {collection && (
          <div className="space-y-8">
            <div>
              <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {collection.service_name || t('songs.collections.title')}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatDate(collection.date)}</p>
            </div>
            {collection.songs.map((song, index) => (
              <div key={song.id} className="space-y-2 border-t border-neutral-200 pt-6 first:border-0 first:pt-0 dark:border-neutral-800">
                <h2 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {index + 1}. {song.title}
                  {song.number ? ` (${song.number})` : ''}
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{song.lyrics}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  )
}
