import axiosClient from './axiosClient'

export function getPublicChurchInfo() {
  return axiosClient.get('/public/church-info/').then((res) => res.data)
}

export function getChurchSettings() {
  return axiosClient.get('/church-settings/').then((res) => res.data)
}

export function updateChurchSettings(payload) {
  return axiosClient.patch('/church-settings/', payload).then((res) => res.data)
}
