import axiosClient from './axiosClient'

export function listAuditLogs(params) {
  return axiosClient.get('/audit-logs/', { params }).then((res) => res.data)
}
