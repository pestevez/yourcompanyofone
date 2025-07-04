import axios from 'axios'

jest.mock('axios')

const mockAxiosInstance = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
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
      const mockResponse = {
        access_token: 'mock-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          organizations: [
            {
              organization: {
                id: 'org-1',
                name: 'Test Organization',
              },
              role: 'ADMIN',
            },
          ],
        },
      }
      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse })
      
      const result = await authAPI.login('test@example.com', 'password')
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password',
      })
      expect(result).toEqual(mockResponse)
    })

    it('should call register endpoint with correct data', async () => {
      const mockResponse = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        organizations: [
          {
            organization: {
              id: 'org-1',
              name: "Test User's Organization",
            },
            role: 'ADMIN',
          },
        ],
      }
      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse })
      
      const result = await authAPI.register('test@example.com', 'password', 'Test User')
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      })
      expect(result).toEqual(mockResponse)
    })

    it('should call getProfile endpoint', async () => {
      const mockResponse = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        organizations: [
          {
            organization: {
              id: 'org-1',
              name: 'Test Organization',
            },
            role: 'ADMIN',
          },
        ],
      }
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse })
      
      const result = await authAPI.getProfile()
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/auth/profile')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('organizationsAPI', () => {
    it('should call list organizations endpoint', async () => {
      const mockResponse = [
        {
          id: '1',
          name: 'Org 1',
          plan: { name: 'Free', price: 0 },
          members: [],
          _count: { content: 0, platformIdentities: 0 },
        },
      ]
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse })
      const result = await organizationsAPI.list()
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/organizations')
      expect(result).toEqual(mockResponse)
    })

    it('should call get organization endpoint with correct ID', async () => {
      const mockResponse = {
        id: '1',
        name: 'Org 1',
        plan: { name: 'Free', price: 0 },
        members: [],
        _count: { content: 0, platformIdentities: 0 },
      }
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse })
      const result = await organizationsAPI.get('org-1')
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/organizations/org-1')
      expect(result).toEqual(mockResponse)
    })

    it('should call create organization endpoint with correct data', async () => {
      const mockResponse = {
        id: '1',
        name: 'New Org',
        plan: { name: 'Free', price: 0 },
        members: [],
      }
      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse })
      const result = await organizationsAPI.create({ name: 'New Org' })
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/organizations', {
        name: 'New Org',
      })
      expect(result).toEqual(mockResponse)
    })

    it('should call update organization endpoint with correct data', async () => {
      const mockResponse = {
        id: '1',
        name: 'Updated Org',
        plan: { name: 'Free', price: 0 },
        members: [],
      }
      mockAxiosInstance.patch.mockResolvedValue({ data: mockResponse })
      const result = await organizationsAPI.update('org-1', { name: 'Updated Org' })
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/organizations/org-1', {
        name: 'Updated Org',
      })
      expect(result).toEqual(mockResponse)
    })

    it('should call delete organization endpoint with correct ID', async () => {
      const mockResponse = { message: 'Organization deleted successfully' }
      mockAxiosInstance.delete.mockResolvedValue({ data: mockResponse })
      const result = await organizationsAPI.delete('org-1')
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/organizations/org-1')
      expect(result).toEqual(mockResponse)
    })

    it('should call get members endpoint with correct organization ID', async () => {
      const mockResponse = [
        {
          id: '1',
          userId: 'user-1',
          role: 'ADMIN',
          user: { id: 'user-1', name: 'Member 1', email: 'member@example.com' },
        },
      ]
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse })
      const result = await organizationsAPI.getMembers('org-1')
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/organizations/org-1/members')
      expect(result).toEqual(mockResponse)
    })

    it('should call add member endpoint with correct data', async () => {
      const mockResponse = {
        id: '1',
        userId: 'user-1',
        role: 'MEMBER',
        user: { id: 'user-1', name: 'New Member', email: 'member@example.com' },
      }
      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse })
      const result = await organizationsAPI.addMember('org-1', {
        email: 'member@example.com',
        role: 'MEMBER',
      })
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/organizations/org-1/members', {
        email: 'member@example.com',
        role: 'MEMBER',
      })
      expect(result).toEqual(mockResponse)
    })

    it('should call remove member endpoint with correct data', async () => {
      const mockResponse = { message: 'Member removed successfully' }
      mockAxiosInstance.delete.mockResolvedValue({ data: mockResponse })
      const result = await organizationsAPI.removeMember('org-1', 'member-1')
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/organizations/org-1/members/member-1')
      expect(result).toEqual(mockResponse)
    })
  })
}) 