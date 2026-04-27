/**
 * API Client Utility
 * Menghandle semua HTTP requests dengan automatic token management
 * 
 * TODO: Update API_URL sesuai dengan endpoint BE Anda
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Melakukan HTTP request dengan automatic token handling
 * 
 * @param endpoint - API endpoint (e.g., '/auth/login')
 * @param options - Fetch options
 * @returns Response
 */
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers = new Headers(options.headers || {})

  // Set default Content-Type jika belum ada
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  // Tambahkan authorization token
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle 401 - Token expired
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  return response
}

/**
 * Helper untuk GET request
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await apiCall(endpoint, {
    method: 'GET',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new ApiError(response.status, (error as any).error || 'Failed to fetch data')
  }

  return response.json()
}

/**
 * Helper untuk POST request
 */
export async function apiPost<T>(
  endpoint: string,
  body?: Record<string, any> | FormData
): Promise<T> {
  const options: RequestInit = {
    method: 'POST',
  }

  if (body) {
    if (body instanceof FormData) {
      options.body = body
    } else {
      options.body = JSON.stringify(body)
    }
  }

  const response = await apiCall(endpoint, options)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new ApiError(response.status, error.error || 'Request failed')
  }

  return response.json()
}

/**
 * Helper untuk PATCH request
 */
export async function apiPatch<T>(
  endpoint: string,
  body?: Record<string, any>
): Promise<T> {
  const response = await apiCall(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body || {}),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new ApiError(response.status, error.error || 'Request failed')
  }

  return response.json()
}

/**
 * Helper untuk DELETE request
 */
export async function apiDelete<T = void>(endpoint: string): Promise<T | null> {
  const response = await apiCall(endpoint, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new ApiError(response.status, (error as any).error || 'Request failed')
  }

  // 204 No Content — no JSON body
  if (response.status === 204) {
    return null
  }

  return response.json()
}

/**
 * Helper untuk PUT request
 */
export async function apiPut<T>(
  endpoint: string,
  body?: Record<string, any>
): Promise<T> {
  const response = await apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body || {}),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new ApiError(response.status, error.error || 'Request failed')
  }
  return response.json()
}

/**
 * Helper untuk mendownload file (PDF, Excel, dll)
 */
export async function apiDownload(endpoint: string, filename: string): Promise<void> {
  const response = await apiCall(endpoint, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to download file')
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}
