import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Select } from '../../components/ui'
import { getErrorDetail, getFieldErrors } from '../../services/api/apiError'
import { createSongCollection, listSongs, updateSongCollection } from '../../services/api/songService'

export default function CollectionForm({ collection, onSaved, onCancel }) {
  const { t } = useTranslation()
  const [allSongs, setAllSongs] = useState([])
  const [values, setValues] = useState({
    date: collection?.date || '',
    service_name: collection?.service_name || '',
  })
  const [selectedSongs, setSelectedSongs] = useState(
    (collection?.items || [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((item) => ({ id: item.song, title: item.song_title }))
  )
  const [songToAdd, setSongToAdd] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    listSongs({ page_size: 200 }).then((data) => setAllSongs(data.results))
  }, [])

  const setField = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))

  const addSong = () => {
    if (!songToAdd) return
    const song = allSongs.find((item) => item.id === songToAdd)
    if (!song || selectedSongs.some((item) => item.id === song.id)) return
    setSelectedSongs((current) => [...current, { id: song.id, title: song.title }])
    setSongToAdd('')
  }

  const removeSong = (id) => setSelectedSongs((current) => current.filter((item) => item.id !== id))

  const moveSong = (index, direction) => {
    setSelectedSongs((current) => {
      const next = current.slice()
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setFieldErrors({})
    setIsSubmitting(true)
    try {
      const payload = {
        ...values,
        items: selectedSongs.map((song, index) => ({ song: song.id, order: index })),
      }
      const saved = collection ? await updateSongCollection(collection.id, payload) : await createSongCollection(payload)
      onSaved(saved)
    } catch (error) {
      setFieldErrors(getFieldErrors(error))
      setFormError(getErrorDetail(error, t('common.error')))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('songs.collections.date')} htmlFor="date" required error={fieldErrors.date}>
          <Input id="date" type="date" required value={values.date} onChange={setField('date')} />
        </FormField>
        <FormField label={t('songs.collections.serviceName')} htmlFor="service_name" error={fieldErrors.service_name}>
          <Input id="service_name" value={values.service_name} onChange={setField('service_name')} />
        </FormField>
      </div>

      <FormField label={t('songs.collections.items')} error={fieldErrors.items}>
        <div className="flex gap-2">
          <Select value={songToAdd} onChange={(event) => setSongToAdd(event.target.value)}>
            <option value="">—</option>
            {allSongs
              .filter((song) => !selectedSongs.some((item) => item.id === song.id))
              .map((song) => (
                <option key={song.id} value={song.id}>
                  {song.title}
                </option>
              ))}
          </Select>
          <Button type="button" variant="outline" onClick={addSong}>
            {t('songs.collections.addSongs')}
          </Button>
        </div>

        {selectedSongs.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {selectedSongs.map((song, index) => (
              <li
                key={song.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800"
              >
                <span>{song.title}</span>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="sm" onClick={() => moveSong(index, -1)} disabled={index === 0}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => moveSong(index, 1)} disabled={index === selectedSongs.length - 1}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSong(song.id)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </FormField>

      {formError && <p className="text-sm text-danger">{formError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('common.loading') : t('common.save')}
        </Button>
      </div>
    </form>
  )
}
