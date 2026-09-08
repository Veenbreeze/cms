import axiosClient from './axiosClient'

export function getPublicSongCollection(id) {
  return axiosClient.get(`/public/song-collections/${id}/`).then((res) => res.data)
}

export function scanSongCollection(id) {
  return axiosClient.post(`/public/song-collections/${id}/scan/`).then((res) => res.data)
}

export function getLandingFeed() {
  return axiosClient.get('/public/landing-feed/').then((res) => res.data)
}
