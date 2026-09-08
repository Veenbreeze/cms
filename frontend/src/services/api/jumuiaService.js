import axiosClient from './axiosClient'

export function listJumuia(params) {
  return axiosClient.get('/jumuia/', { params }).then((res) => res.data)
}

export function getJumuia(id) {
  return axiosClient.get(`/jumuia/${id}/`).then((res) => res.data)
}

export function createJumuia(payload) {
  return axiosClient.post('/jumuia/', payload).then((res) => res.data)
}

export function updateJumuia(id, payload) {
  return axiosClient.patch(`/jumuia/${id}/`, payload).then((res) => res.data)
}

export function deactivateJumuia(id) {
  return axiosClient.post(`/jumuia/${id}/deactivate/`).then((res) => res.data)
}

export function getJumuiaStats(id) {
  return axiosClient.get(`/jumuia/${id}/stats/`).then((res) => res.data)
}
