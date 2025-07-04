import React from 'react'
import { render, screen } from '@testing-library/react'
import DashboardPage from '../page'
import { AuthProvider } from '@/lib/auth-context'

// Mock next/navigation at the top level
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock the auth context
jest.mock('@/lib/auth-context', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const mockUseAuth = require('@/lib/auth-context').useAuth

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should redirect to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      currentOrganization: null,
      logout: jest.fn(),
    })

    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    )

    expect(mockPush).toHaveBeenCalledWith('/auth/login')
  })

  it('should display user and organization information when authenticated', () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    }

    const mockOrganization = {
      organization: {
        id: 'org-1',
        name: 'John Doe Organization',
      },
      role: 'ADMIN',
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      currentOrganization: mockOrganization,
      logout: jest.fn(),
    })

    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    )

    expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument()
    expect(screen.getAllByText('John Doe Organization').length).toBeGreaterThan(0)
    expect(screen.getAllByText('ADMIN').length).toBeGreaterThan(0)
  })

  it('should display different organization names for different users', () => {
    const mockUser1 = {
      id: '1',
      name: 'Admin User',
      email: 'admin@system.com',
    }

    const mockOrg1 = {
      organization: {
        id: 'org-1',
        name: 'System Organization',
      },
      role: 'ADMIN',
    }

    mockUseAuth.mockReturnValue({
      user: mockUser1,
      currentOrganization: mockOrg1,
      logout: jest.fn(),
    })

    const { rerender } = render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    )

    expect(screen.getAllByText('System Organization').length).toBeGreaterThan(0)

    // Test with different user
    const mockUser2 = {
      id: '2',
      name: 'Client User',
      email: 'user@client.com',
    }

    const mockOrg2 = {
      organization: {
        id: 'org-2',
        name: 'Client Organization',
      },
      role: 'MEMBER',
    }

    mockUseAuth.mockReturnValue({
      user: mockUser2,
      currentOrganization: mockOrg2,
      logout: jest.fn(),
    })

    rerender(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    )

    expect(screen.getAllByText('Client Organization').length).toBeGreaterThan(0)
    expect(screen.getAllByText('MEMBER').length).toBeGreaterThan(0)
  })

  it('should handle logout functionality', async () => {
    const mockLogout = jest.fn()
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    }

    const mockOrganization = {
      organization: {
        id: 'org-1',
        name: 'Test Organization',
      },
      role: 'ADMIN',
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      currentOrganization: mockOrganization,
      logout: mockLogout,
    })

    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    )

    const logoutButton = screen.getByText('Sign out')
    logoutButton.click()

    expect(mockLogout).toHaveBeenCalled()
  })

  it('should display quick action buttons', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    }

    const mockOrganization = {
      organization: {
        id: 'org-1',
        name: 'Test Organization',
      },
      role: 'ADMIN',
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      currentOrganization: mockOrganization,
      logout: jest.fn(),
    })

    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    )

    expect(screen.getByText('Create Content')).toBeInTheDocument()
    expect(screen.getByText('Connect Platform')).toBeInTheDocument()
    expect(screen.getByText('View Analytics')).toBeInTheDocument()
  })

  it('should display recent activity section', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    }

    const mockOrganization = {
      organization: {
        id: 'org-1',
        name: 'Test Organization',
      },
      role: 'ADMIN',
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      currentOrganization: mockOrganization,
      logout: jest.fn(),
    })

    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    )

    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('No recent activity')).toBeInTheDocument()
  })
}) 