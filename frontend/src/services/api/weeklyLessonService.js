import axiosClient from './axiosClient'

export function listWeeklyLessons(params) {
  return axiosClient.get('/weekly-lessons/', { params }).then((res) => res.data)
}

export function getWeeklyLesson(id) {
  return axiosClient.get(`/weekly-lessons/${id}/`).then((res) => res.data)
}

export function createWeeklyLesson(payload) {
  return axiosClient.post('/weekly-lessons/', payload).then((res) => res.data)
}

export function updateWeeklyLesson(id, payload) {
  return axiosClient.patch(`/weekly-lessons/${id}/`, payload).then((res) => res.data)
}

export function deactivateWeeklyLesson(id) {
  return axiosClient.delete(`/weekly-lessons/${id}/`)
}
