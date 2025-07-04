import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../auth-context'
import { authAPI } from '../api'

// Mock the API module
jest.mock('../api', () => ({
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
    getProfile: jest.fn(),
  },
}))

const mockAuthAPI = authAPI as jest.Mocked<typeof authAPI>

// Test component to access auth context
function TestComponent() {
  const { user, currentOrganization, login, register, logout } = useAuth()
  
  return (
    <div>
      <div data-testid="user-name">{user?.name || 'No user'}</div>
      <div data-testid="user-email">{user?.email || 'No email'}</div>
      <div data-testid="org-name">{currentOrganization?.organization.name || 'No org'}</div>
      <div data-testid="org-role">{currentOrganization?.role || 'No role'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => register('test@example.com', 'password', 'Test User')}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('initial state', () => {
    it('should start with no user and loading state', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByTestId('user-name')).toHaveTextContent('No user')
      expect(screen.getByTestId('user-email')).toHaveTextContent('No email')
      expect(screen.getByTestId('org-name')).toHaveTextContent('No org')
    })
  })

  describe('login functionality', () => {
    it('should login successfully and set user data', async () => {
      const mockUser = {
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

      mockAuthAPI.login.mockResolvedValue({
        access_token: 'mock-token',
        user: mockUser,
      })
      mockAuthAPI.getProfile.mockResolvedValue(mockUser)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      await userEvent.click(loginButton)

      await waitFor(() => {
        expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
        expect(screen.getByTestId('org-name')).toHaveTextContent('Test Organization')
        expect(screen.getByTestId('org-role')).toHaveTextContent('ADMIN')
      })

      expect(mockAuthAPI.login).toHaveBeenCalledWith('test@example.com', 'password')
      expect(mockAuthAPI.getProfile).toHaveBeenCalled()
      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'mock-token')
    })

    it('should handle login errors', async () => {
      const error = new Error('Invalid credentials')
      mockAuthAPI.login.mockRejectedValue(error)

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      let context: any
      function CaptureContext() {
        context = useAuth()
        return null
      }
      render(
        <AuthProvider>
          <CaptureContext />
        </AuthProvider>
      )

      await expect(context.login('test@example.com', 'password')).rejects.toThrow('Invalid credentials')
      expect(mockAuthAPI.login).toHaveBeenCalledWith('test@example.com', 'password')
      consoleSpy.mockRestore()
    })
  })

  describe('register functionality', () => {
    it('should register successfully and set user data', async () => {
      const mockUser = {
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

      mockAuthAPI.register.mockResolvedValue(mockUser)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const registerButton = screen.getByText('Register')
      await userEvent.click(registerButton)

      await waitFor(() => {
        expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
        expect(screen.getByTestId('org-name')).toHaveTextContent("Test User's Organization")
        expect(screen.getByTestId('org-role')).toHaveTextContent('ADMIN')
      })

      expect(mockAuthAPI.register).toHaveBeenCalledWith('test@example.com', 'password', 'Test User')
    })

    it('should handle register errors', async () => {
      const error = new Error('Email already exists')
      mockAuthAPI.register.mockRejectedValue(error)

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      let context: any
      function CaptureContext() {
        context = useAuth()
        return null
      }
      render(
        <AuthProvider>
          <CaptureContext />
        </AuthProvider>
      )

      await expect(context.register('test@example.com', 'password', 'Test User')).rejects.toThrow('Email already exists')
      expect(mockAuthAPI.register).toHaveBeenCalledWith('test@example.com', 'password', 'Test User')
      consoleSpy.mockRestore()
    })
  })

  describe('logout functionality', () => {
    it('should clear user data and token on logout', async () => {
      const mockUser = {
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

      mockAuthAPI.login.mockResolvedValue({
        access_token: 'mock-token',
        user: mockUser,
      })
      mockAuthAPI.getProfile.mockResolvedValue(mockUser)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // First login
      const loginButton = screen.getByText('Login')
      await userEvent.click(loginButton)

      await waitFor(() => {
        expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
      })

      // Then logout
      const logoutButton = screen.getByText('Logout')
      await userEvent.click(logoutButton)

      await waitFor(() => {
        expect(screen.getByTestId('user-name')).toHaveTextContent('No user')
        expect(screen.getByTestId('user-email')).toHaveTextContent('No email')
        expect(screen.getByTestId('org-name')).toHaveTextContent('No org')
      })

      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token')
    })
  })

  describe('organization data', () => {
    it('should display correct organization name from backend', async () => {
      const mockUser = {
        id: '1',
        email: 'admin@system.com',
        name: 'Admin User',
        organizations: [
          {
            organization: {
              id: 'org-1',
              name: 'System Organization',
            },
            role: 'ADMIN',
          },
        ],
      }

      mockAuthAPI.login.mockResolvedValue({
        access_token: 'mock-token',
        user: mockUser,
      })
      mockAuthAPI.getProfile.mockResolvedValue(mockUser)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      await userEvent.click(loginButton)

      await waitFor(() => {
        expect(screen.getByTestId('org-name')).toHaveTextContent('System Organization')
        expect(screen.getByTestId('org-role')).toHaveTextContent('ADMIN')
      })
    })

    it('should handle multiple organizations', async () => {
      const mockUser = {
        id: '1',
        email: 'user@client.com',
        name: 'Client User',
        organizations: [
          {
            organization: {
              id: 'org-1',
              name: 'Client Organization',
            },
            role: 'MEMBER',
          },
          {
            organization: {
              id: 'org-2',
              name: 'Another Organization',
            },
            role: 'ADMIN',
          },
        ],
      }

      mockAuthAPI.login.mockResolvedValue({
        access_token: 'mock-token',
        user: mockUser,
      })
      mockAuthAPI.getProfile.mockResolvedValue(mockUser)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      await userEvent.click(loginButton)

      await waitFor(() => {
        // Should use the first organization by default
        expect(screen.getByTestId('org-name')).toHaveTextContent('Client Organization')
        expect(screen.getByTestId('org-role')).toHaveTextContent('MEMBER')
      })
    })
  })
}) 