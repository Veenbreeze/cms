import axiosClient from './axiosClient'

export function listServants(params) {
  return axiosClient.get('/servants/', { params }).then((res) => res.data)
}

export function getServant(id) {
  return axiosClient.get(`/servants/${id}/`).then((res) => res.data)
}

export function createServant(payload) {
  return axiosClient.post('/servants/', payload).then((res) => res.data)
}

export function updateServant(id, payload) {
  return axiosClient.patch(`/servants/${id}/`, payload).then((res) => res.data)
}

export function deactivateServant(id) {
  return axiosClient.delete(`/servants/${id}/`)
}

export function getPublicLeadership() {
  return axiosClient.get('/public/leadership/').then((res) => res.data)
}
