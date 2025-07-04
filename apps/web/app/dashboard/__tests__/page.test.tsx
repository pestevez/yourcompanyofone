import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import DashboardPage from '../page'
import { AuthProvider } from '@/lib/auth-context'
import { OrganizationsProvider } from '@/lib/organizations-context'

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

// Mock the organizations context
jest.mock('@/lib/organizations-context', () => ({
  useOrganizations: jest.fn(),
  OrganizationsProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const mockUseAuth = require('@/lib/auth-context').useAuth
const mockUseOrganizations = require('@/lib/organizations-context').useOrganizations

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock for organizations context
    mockUseOrganizations.mockReturnValue({
      organizations: [],
      currentOrganization: null,
      loading: false,
      error: null,
      fetchOrganizations: jest.fn(),
      createOrganization: jest.fn(),
      setCurrentOrganization: jest.fn(),
    })
  })

  it('should redirect to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      currentOrganization: null,
      logout: jest.fn(),
    })

    render(
      <AuthProvider>
        <OrganizationsProvider>
          <DashboardPage />
        </OrganizationsProvider>
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
      id: 'org-1',
      name: 'John Doe Organization',
      plan: {
        id: 'plan-1',
        name: 'Basic Plan',
        description: 'Basic plan for small teams',
        price: 29,
        features: {},
      },
      members: [
        {
          id: 'member-1',
          userId: '1',
          role: 'ADMIN',
          user: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      ],
      _count: {
        content: 0,
        platformIdentities: 0,
      },
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
    })

    mockUseOrganizations.mockReturnValue({
      organizations: [mockOrganization],
      currentOrganization: mockOrganization,
      loading: false,
      error: null,
      fetchOrganizations: jest.fn(),
      createOrganization: jest.fn(),
      setCurrentOrganization: jest.fn(),
    })

    render(
      <AuthProvider>
        <OrganizationsProvider>
          <DashboardPage />
        </OrganizationsProvider>
      </AuthProvider>
    )

    expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument()
    expect(screen.getByText('John Doe Organization')).toBeInTheDocument()
    expect(screen.getByText('Basic Plan ($29/month)')).toBeInTheDocument()
  })

  it('should display different organization names for different users', () => {
    const mockUser1 = {
      id: '1',
      name: 'Admin User',
      email: 'admin@system.com',
    }

    const mockOrg1 = {
      id: 'org-1',
      name: 'System Organization',
      plan: {
        id: 'plan-1',
        name: 'Basic Plan',
        description: 'Basic plan for small teams',
        price: 29,
        features: {},
      },
      members: [
        {
          id: 'member-1',
          userId: '1',
          role: 'ADMIN',
          user: {
            id: '1',
            name: 'Admin User',
            email: 'admin@system.com',
          },
        },
      ],
      _count: {
        content: 0,
        platformIdentities: 0,
      },
    }

    mockUseAuth.mockReturnValue({
      user: mockUser1,
      logout: jest.fn(),
    })

    mockUseOrganizations.mockReturnValue({
      organizations: [mockOrg1],
      currentOrganization: mockOrg1,
      loading: false,
      error: null,
      fetchOrganizations: jest.fn(),
      createOrganization: jest.fn(),
      setCurrentOrganization: jest.fn(),
    })

    const { rerender } = render(
      <AuthProvider>
        <OrganizationsProvider>
          <DashboardPage />
        </OrganizationsProvider>
      </AuthProvider>
    )

    expect(screen.getByText('System Organization')).toBeInTheDocument()

    // Test with different user
    const mockUser2 = {
      id: '2',
      name: 'Client User',
      email: 'user@client.com',
    }

    const mockOrg2 = {
      id: 'org-2',
      name: 'Client Organization',
      plan: {
        id: 'plan-1',
        name: 'Basic Plan',
        description: 'Basic plan for small teams',
        price: 29,
        features: {},
      },
      members: [
        {
          id: 'member-2',
          userId: '2',
          role: 'MEMBER',
          user: {
            id: '2',
            name: 'Client User',
            email: 'user@client.com',
          },
        },
      ],
      _count: {
        content: 0,
        platformIdentities: 0,
      },
    }

    mockUseAuth.mockReturnValue({
      user: mockUser2,
      logout: jest.fn(),
    })

    mockUseOrganizations.mockReturnValue({
      organizations: [mockOrg2],
      currentOrganization: mockOrg2,
      loading: false,
      error: null,
      fetchOrganizations: jest.fn(),
      createOrganization: jest.fn(),
      setCurrentOrganization: jest.fn(),
    })

    rerender(
      <AuthProvider>
        <OrganizationsProvider>
          <DashboardPage />
        </OrganizationsProvider>
      </AuthProvider>
    )

    expect(screen.getByText('Client Organization')).toBeInTheDocument()
  })

  it('should display organization information correctly', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    }

    const mockOrganization = {
      id: 'org-1',
      name: 'Test Organization',
      plan: {
        id: 'plan-1',
        name: 'Basic Plan',
        description: 'Basic plan for small teams',
        price: 29,
        features: {},
      },
      members: [
        {
          id: 'member-1',
          userId: '1',
          role: 'ADMIN',
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
          },
        },
      ],
      _count: {
        content: 5,
        platformIdentities: 2,
      },
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
    })

    mockUseOrganizations.mockReturnValue({
      organizations: [mockOrganization],
      currentOrganization: mockOrganization,
      loading: false,
      error: null,
      fetchOrganizations: jest.fn(),
      createOrganization: jest.fn(),
      setCurrentOrganization: jest.fn(),
    })

    render(
      <AuthProvider>
        <OrganizationsProvider>
          <DashboardPage />
        </OrganizationsProvider>
      </AuthProvider>
    )

    expect(screen.getByText('Test Organization')).toBeInTheDocument()
    expect(screen.getByText('Basic Plan ($29/month)')).toBeInTheDocument()
    expect(screen.getByText((content, node) =>
      node?.textContent === 'Members: 1')
    ).toBeInTheDocument()
    expect(screen.getByText((content, node) =>
      node?.textContent === 'Content: 5')
    ).toBeInTheDocument()
    expect(screen.getByText((content, node) =>
      node?.textContent === 'Platforms: 2')
    ).toBeInTheDocument()
  })

  it('should display quick action buttons', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    }

    const mockOrganization = {
      id: 'org-1',
      name: 'Test Organization',
      plan: {
        id: 'plan-1',
        name: 'Basic Plan',
        description: 'Basic plan for small teams',
        price: 29,
        features: {},
      },
      members: [
        {
          id: 'member-1',
          userId: '1',
          role: 'ADMIN',
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
          },
        },
      ],
      _count: {
        content: 0,
        platformIdentities: 0,
      },
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
    })

    mockUseOrganizations.mockReturnValue({
      organizations: [mockOrganization],
      currentOrganization: mockOrganization,
      loading: false,
      error: null,
      fetchOrganizations: jest.fn(),
      createOrganization: jest.fn(),
      setCurrentOrganization: jest.fn(),
    })

    render(
      <AuthProvider>
        <OrganizationsProvider>
          <DashboardPage />
        </OrganizationsProvider>
      </AuthProvider>
    )

    expect(screen.getByText('Create Organization')).toBeInTheDocument()
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
      id: 'org-1',
      name: 'Test Organization',
      plan: {
        id: 'plan-1',
        name: 'Basic Plan',
        description: 'Basic plan for small teams',
        price: 29,
        features: {},
      },
      members: [
        {
          id: 'member-1',
          userId: '1',
          role: 'ADMIN',
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
          },
        },
      ],
      _count: {
        content: 0,
        platformIdentities: 0,
      },
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
    })

    mockUseOrganizations.mockReturnValue({
      organizations: [mockOrganization],
      currentOrganization: mockOrganization,
      loading: false,
      error: null,
      fetchOrganizations: jest.fn(),
      createOrganization: jest.fn(),
      setCurrentOrganization: jest.fn(),
    })

    render(
      <AuthProvider>
        <OrganizationsProvider>
          <DashboardPage />
        </OrganizationsProvider>
      </AuthProvider>
    )

    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('No recent activity')).toBeInTheDocument()
  })
}) 