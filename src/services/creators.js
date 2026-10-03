import { fallbackInfluencers } from '../data/influencers'

const apiBaseUrl = "https://influs-backend.onrender.com"
// import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '')
const authTokenKey = 'influs_auth_token'

export const hasCreatorApi = Boolean(apiBaseUrl)
export const hasAuthToken = () => Boolean(window.localStorage.getItem(authTokenKey))

const getAuthHeaders = () => {
  const token = window.localStorage.getItem(authTokenKey)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getInfluencers({ signal } = {}) {
  if (!apiBaseUrl) return fallbackInfluencers

  const response = await fetch(`${apiBaseUrl}/api/creators`, {
    signal,
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = new Error(`Creator API request failed (${response.status}).`)
    error.status = response.status
    if (response.status === 401) logoutAccount()
    throw error
  }

  const payload = await response.json()
  const creators = Array.isArray(payload) ? payload : payload.data

  if (!Array.isArray(creators)) {
    throw new Error('Creator API must return an array or an object with a data array.')
  }

  return creators
}

async function postRegistration(endpoint, payload) {
  if (!apiBaseUrl) return { configured: false }

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(result.error || `Registration failed (${response.status}).`)
  }

  return { configured: true, data: result.data }
}

export function registerInfluencer(payload) {
  return postRegistration('/api/auth/register/influencer', payload).then((result) => {
    if (result.configured) {
      window.dispatchEvent(new Event('creators-updated'))
    }
    return result
  })
}

export function registerSponsor(payload) {
  return postRegistration('/api/auth/register/sponsor', payload)
}

async function authenticatedRequest(path, options = {}) {
  if (!apiBaseUrl) {
    throw new Error('Connect the API before signing in or editing a profile.')
  }

  const token = window.localStorage.getItem(authTokenKey)
  const headers = { ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`
  if (options.body) headers['Content-Type'] = 'application/json'

  const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401) window.localStorage.removeItem(authTokenKey)
    throw new Error(result.error || `Request failed (${response.status}).`)
  }
  return result.data
}

export async function loginAccount(role, email, password) {
  if (!apiBaseUrl) {
    throw new Error('Connect the API before signing in.')
  }

  const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, email, password }),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(result.error || `Sign in failed (${response.status}).`)
  }

  window.localStorage.setItem(authTokenKey, result.data.token)
  window.dispatchEvent(new Event('auth-updated'))
  return result.data.account
}

export function getMyProfile() {
  return authenticatedRequest('/api/me')
}

export function updateMyProfile(profile) {
  return authenticatedRequest('/api/me', {
    method: 'PUT',
    body: JSON.stringify(profile),
  }).then((updatedProfile) => {
    window.dispatchEvent(new Event('creators-updated'))
    return updatedProfile
  })
}

export function logoutAccount() {
  window.localStorage.removeItem(authTokenKey)
}