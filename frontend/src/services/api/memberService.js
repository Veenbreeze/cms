import axiosClient from './axiosClient'

export function listMembers(params) {
  return axiosClient.get('/members/', { params }).then((res) => res.data)
}

export function getMember(id) {
  return axiosClient.get(`/members/${id}/`).then((res) => res.data)
}

export function getMyMember() {
  return axiosClient.get('/members/me/').then((res) => res.data)
}

export function createMember(payload) {
  return axiosClient.post('/members/', payload).then((res) => res.data)
}

export function updateMember(id, payload) {
  return axiosClient.patch(`/members/${id}/`, payload).then((res) => res.data)
}

export function deactivateMember(id) {
  return axiosClient.post(`/members/${id}/deactivate/`).then((res) => res.data)
}

export function uploadMemberPhoto(id, file) {
  const formData = new FormData()
  formData.append('profile_photo', file)
  return axiosClient
    .post(`/members/${id}/photo/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)
}

export function suggestJumuia() {
  return axiosClient.get('/members/suggest-jumuia/').then((res) => res.data)
}

export function listSpiritualRecords(memberId) {
  return axiosClient.get('/spiritual-records/', { params: { member: memberId } }).then((res) => res.data)
}

export function createSpiritualRecord(payload) {
  return axiosClient.post('/spiritual-records/', payload).then((res) => res.data)
}

export function updateSpiritualRecord(id, payload) {
  return axiosClient.patch(`/spiritual-records/${id}/`, payload).then((res) => res.data)
}

export function deleteSpiritualRecord(id) {
  return axiosClient.delete(`/spiritual-records/${id}/`)
}

export function createParticipationRecord(payload) {
  return axiosClient.post('/participation-records/', payload).then((res) => res.data)
}

export function updateParticipationRecord(id, payload) {
  return axiosClient.patch(`/participation-records/${id}/`, payload).then((res) => res.data)
}

export function deleteParticipationRecord(id) {
  return axiosClient.delete(`/participation-records/${id}/`)
}
