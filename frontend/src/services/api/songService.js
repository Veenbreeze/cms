import axiosClient from './axiosClient'

export function listSongs(params) {
  return axiosClient.get('/songs/', { params }).then((res) => res.data)
}

export function getSong(id) {
  return axiosClient.get(`/songs/${id}/`).then((res) => res.data)
}

export function createSong(payload) {
  return axiosClient.post('/songs/', payload).then((res) => res.data)
}

export function updateSong(id, payload) {
  return axiosClient.patch(`/songs/${id}/`, payload).then((res) => res.data)
}

export function deactivateSong(id) {
  return axiosClient.delete(`/songs/${id}/`)
}

export function listSongCollections(params) {
  return axiosClient.get('/song-collections/', { params }).then((res) => res.data)
}

export function getSongCollection(id) {
  return axiosClient.get(`/song-collections/${id}/`).then((res) => res.data)
}

export function createSongCollection(payload) {
  return axiosClient.post('/song-collections/', payload).then((res) => res.data)
}

export function updateSongCollection(id, payload) {
  return axiosClient.patch(`/song-collections/${id}/`, payload).then((res) => res.data)
}

export function deactivateSongCollection(id) {
  return axiosClient.delete(`/song-collections/${id}/`)
}

export function generateCollectionQr(id) {
  return axiosClient.post(`/song-collections/${id}/generate-qr/`).then((res) => res.data)
}
