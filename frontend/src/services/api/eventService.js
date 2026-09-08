import axiosClient from './axiosClient'

export function listEvents(params) {
  return axiosClient.get('/events/', { params }).then((res) => res.data)
}

export function getEvent(id) {
  return axiosClient.get(`/events/${id}/`).then((res) => res.data)
}

export function createEvent(payload) {
  return axiosClient.post('/events/', payload).then((res) => res.data)
}

export function updateEvent(id, payload) {
  return axiosClient.patch(`/events/${id}/`, payload).then((res) => res.data)
}

export function deactivateEvent(id) {
  return axiosClient.delete(`/events/${id}/`)
}
