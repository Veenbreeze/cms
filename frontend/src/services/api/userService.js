import axiosClient from './axiosClient'

export function listUsers(params) {
  return axiosClient.get('/users/', { params }).then((res) => res.data)
}

export function listAvailableMembers() {
  return axiosClient.get('/users/available-members/').then((res) => res.data)
}

export function createUser(payload) {
  return axiosClient.post('/users/', payload).then((res) => res.data)
}

export function updateUser(id, payload) {
  return axiosClient.patch(`/users/${id}/`, payload).then((res) => res.data)
}

export function deactivateUser(id) {
  return axiosClient.post(`/users/${id}/deactivate/`).then((res) => res.data)
}

export function resetUserPassword(id, newPassword) {
  return axiosClient.post(`/users/${id}/reset-password/`, { new_password: newPassword }).then((res) => res.data)
}
