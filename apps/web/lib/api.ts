import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name })
    return response.data
  },
}

// Organizations API (to be implemented)
export const organizationsAPI = {
  list: async () => {
    const response = await api.get('/organizations')
    return response.data
  },
  
  get: async (id: string) => {
    const response = await api.get(`/organizations/${id}`)
    return response.data
  },
  
  create: async (data: { name: string }) => {
    const response = await api.post('/organizations', data)
    return response.data
  },
  
  update: async (id: string, data: { name: string }) => {
    const response = await api.put(`/organizations/${id}`, data)
    return response.data
  },
  
  getMembers: async (id: string) => {
    const response = await api.get(`/organizations/${id}/members`)
    return response.data
  },
  
  addMember: async (organizationId: string, data: { email: string; role: string }) => {
    const response = await api.post(`/organizations/${organizationId}/members`, data)
    return response.data
  },
} 