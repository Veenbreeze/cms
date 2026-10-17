import axiosClient from './axiosClient'

export function submitPrayerRequest(payload) {
  return axiosClient.post('/prayer-requests/', payload).then((response) => response.data)
}

export function listMyPrayerRequests() {
  return axiosClient.get('/prayer-requests/mine/').then((response) => response.data)
}

export function listPrayerRequests(params) {
  return axiosClient.get('/prayer-requests/', { params }).then((response) => response.data)
}

export function updatePrayerRequest(id, payload) {
  return axiosClient.patch(`/prayer-requests/${id}/`, payload).then((response) => response.data)
}