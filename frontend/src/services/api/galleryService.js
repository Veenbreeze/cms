import axiosClient from './axiosClient'

export function listGalleryCategories(params) {
  return axiosClient.get('/gallery-categories/', { params }).then((res) => res.data)
}

export function createGalleryCategory(payload) {
  return axiosClient.post('/gallery-categories/', payload).then((res) => res.data)
}

export function updateGalleryCategory(id, payload) {
  return axiosClient.patch(`/gallery-categories/${id}/`, payload).then((res) => res.data)
}

export function deactivateGalleryCategory(id) {
  return axiosClient.delete(`/gallery-categories/${id}/`)
}

export function listGalleryImages(params) {
  return axiosClient.get('/gallery-images/', { params }).then((res) => res.data)
}

export function uploadGalleryImage({ image, category, caption, taken_on } = {}) {
  const formData = new FormData()
  formData.append('image', image)
  if (category) formData.append('category', category)
  if (caption) formData.append('caption', caption)
  if (taken_on) formData.append('taken_on', taken_on)
  return axiosClient
    .post('/gallery-images/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)
}

export function deleteGalleryImage(id) {
  return axiosClient.delete(`/gallery-images/${id}/`)
}
