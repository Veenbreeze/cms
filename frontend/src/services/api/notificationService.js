import axiosClient from './axiosClient'

export function listNotifications(params) {
  return axiosClient.get('/notifications/', { params }).then((res) => res.data)
}

export function getUnreadNotificationCount() {
  return axiosClient.get('/notifications/unread-count/').then((res) => res.data)
}

export function markNotificationRead(id) {
  return axiosClient.post(`/notifications/${id}/mark-read/`).then((res) => res.data)
}

export function markAllNotificationsRead() {
  return axiosClient.post('/notifications/mark-all-read/').then((res) => res.data)
}
