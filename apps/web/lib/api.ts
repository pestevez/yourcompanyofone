import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Create axios instance with dependency injection for testing
export const createApiInstance = (axiosInstance?: AxiosInstance): AxiosInstance => {
  const instance = axiosInstance || axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor to add auth token
  instance.interceptors.request.use(
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
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token')
        window.location.href = '/auth/login'
      }
      return Promise.reject(error)
    }
  )

  return instance
}

// Lazy initialization of the default api instance
let _api: AxiosInstance | null = null

const getApi = (): AxiosInstance => {
  if (!_api) {
    _api = createApiInstance()
  }
  return _api
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await getApi().post('/auth/login', { email, password })
    return response.data
  },
  
  register: async (email: string, password: string, name: string) => {
    const response = await getApi().post('/auth/register', { email, password, name })
    return response.data
  },

  getProfile: async () => {
    const response = await getApi().get('/auth/profile')
    return response.data
  },
}

// Organizations API
export const organizationsAPI = {
  list: async () => {
    const response = await getApi().get('/organizations')
    return response.data
  },
  
  get: async (id: string) => {
    const response = await getApi().get(`/organizations/${id}`)
    return response.data
  },
  
  create: async (data: { name: string }) => {
    const response = await getApi().post('/organizations', data)
    return response.data
  },
  
  update: async (id: string, data: { name?: string }) => {
    const response = await getApi().patch(`/organizations/${id}`, data)
    return response.data
  },
  
  delete: async (id: string) => {
    const response = await getApi().delete(`/organizations/${id}`)
    return response.data
  },
  
  getMembers: async (id: string) => {
    const response = await getApi().get(`/organizations/${id}/members`)
    return response.data
  },
  
  addMember: async (organizationId: string, data: { email: string; role: string }) => {
    const response = await getApi().post(`/organizations/${organizationId}/members`, data)
    return response.data
  },
  
  removeMember: async (organizationId: string, memberId: string) => {
    const response = await getApi().delete(`/organizations/${organizationId}/members/${memberId}`)
    return response.data
  },
} 