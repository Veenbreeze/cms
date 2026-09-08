import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// The access token lives in memory only (never localStorage) — it's attached
// to every request via the interceptor below. The refresh token is an
// httpOnly cookie the browser manages automatically (see backend
// apps/accounts/views.py), which is why every request needs withCredentials.
let accessToken = null
let refreshPromise = null

export function setAccessToken(token) {
  accessToken = token
}

const axiosClient = axios.create({ baseURL, withCredentials: true })

axiosClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

function isAuthEndpoint(url = '') {
  return url.includes('/auth/login') || url.includes('/auth/refresh')
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axiosClient
      .post('/auth/refresh/')
      .then((response) => {
        setAccessToken(response.data.access)
        return response.data.access
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error
    if (!response || !config || config._retry || isAuthEndpoint(config.url)) {
      return Promise.reject(error)
    }
    if (response.status === 401) {
      config._retry = true
      try {
        const newAccessToken = await refreshAccessToken()
        config.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosClient(config)
      } catch (refreshError) {
        setAccessToken(null)
        window.dispatchEvent(new CustomEvent('cmsa:session-expired'))
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClient
