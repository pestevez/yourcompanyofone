import axios from 'axios'

jest.mock('axios')

const mockAxiosInstance = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
}
;(axios.create as jest.Mock).mockReturnValue(mockAxiosInstance)

import { authAPI, organizationsAPI } from '../api'

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('authAPI', () => {
    it('should call login endpoint with correct data', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { access_token: 'mock-token' } })
      await authAPI.login('test@example.com', 'password')
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password',
      })
    })

    it('should call register endpoint with correct data', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { access_token: 'mock-token' } })
      await authAPI.register('test@example.com', 'password', 'Test User')
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      })
    })

    it('should call getProfile endpoint', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: { id: '1', name: 'Test User' } })
      await authAPI.getProfile()
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/auth/profile')
    })
  })

  describe('organizationsAPI', () => {
    it('should call list organizations endpoint', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: [{ id: '1', name: 'Org 1' }] })
      await organizationsAPI.list()
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/organizations')
    })

    it('should call get organization endpoint with correct ID', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: { id: '1', name: 'Org 1' } })
      await organizationsAPI.get('org-1')
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/organizations/org-1')
    })

    it('should call create organization endpoint with correct data', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { id: '1', name: 'New Org' } })
      await organizationsAPI.create({ name: 'New Org' })
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/organizations', {
        name: 'New Org',
      })
    })

    it('should call update organization endpoint with correct data', async () => {
      mockAxiosInstance.put.mockResolvedValue({ data: { id: '1', name: 'Updated Org' } })
      await organizationsAPI.update('org-1', { name: 'Updated Org' })
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/organizations/org-1', {
        name: 'Updated Org',
      })
    })

    it('should call get members endpoint with correct organization ID', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: [{ id: '1', name: 'Member 1' }] })
      await organizationsAPI.getMembers('org-1')
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/organizations/org-1/members')
    })

    it('should call add member endpoint with correct data', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { id: '1', email: 'member@example.com' } })
      await organizationsAPI.addMember('org-1', {
        email: 'member@example.com',
        role: 'MEMBER',
      })
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/organizations/org-1/members', {
        email: 'member@example.com',
        role: 'MEMBER',
      })
    })
  })
}) 