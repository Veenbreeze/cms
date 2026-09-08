import axiosClient from './axiosClient'

export function listAnnouncements(params) {
  return axiosClient.get('/announcements/', { params }).then((res) => res.data)
}

export function getAnnouncement(id) {
  return axiosClient.get(`/announcements/${id}/`).then((res) => res.data)
}

export function createAnnouncement(payload) {
  return axiosClient.post('/announcements/', payload).then((res) => res.data)
}

export function updateAnnouncement(id, payload) {
  return axiosClient.patch(`/announcements/${id}/`, payload).then((res) => res.data)
}

export function deactivateAnnouncement(id) {
  return axiosClient.delete(`/announcements/${id}/`)
}
