'use client'

import { useAuth } from '@/lib/auth-context'
import { useOrganizations } from '@/lib/organizations-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { 
    organizations, 
    currentOrganization, 
    loading, 
    error, 
    fetchOrganizations,
    createOrganization,
    setCurrentOrganization 
  } = useOrganizations()
  const router = useRouter()
  const [showCreateOrg, setShowCreateOrg] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    } else {
      fetchOrganizations()
    }
  }, [user, router, fetchOrganizations])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {organizations.length > 1 && (
                <select
                  value={currentOrganization?.id || ''}
                  onChange={(e) => {
                    const org = organizations.find(o => o.id === e.target.value)
                    setCurrentOrganization(org || null)
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Organization Card */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Organization
              </h3>
              {loading ? (
                <div className="text-sm text-gray-600">Loading...</div>
              ) : error ? (
                <div className="text-sm text-red-600">{error}</div>
              ) : currentOrganization ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {currentOrganization.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Plan:</span> {currentOrganization.plan.name} (${currentOrganization.plan.price}/month)
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Members:</span> {currentOrganization.members.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Content:</span> {currentOrganization._count.content}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Platforms:</span> {currentOrganization._count.platformIdentities}
                  </p>
                </div>
              ) : (
                <div className="text-sm text-gray-600">No organization selected</div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowCreateOrg(true)}
                  className="w-full btn-primary"
                >
                  Create Organization
                </button>
                <button className="w-full btn-secondary">
                  Create Content
                </button>
                <button className="w-full btn-secondary">
                  Connect Platform
                </button>
                <button className="w-full btn-secondary">
                  View Analytics
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="text-sm text-gray-600">
                <p>No recent activity</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Organization Modal */}
      {showCreateOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Organization
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="orgName" className="block text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <input
                  type="text"
                  id="orgName"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter organization name"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    if (newOrgName.trim()) {
                      try {
                        await createOrganization(newOrgName.trim())
                        setNewOrgName('')
                        setShowCreateOrg(false)
                      } catch (error) {
                        console.error('Failed to create organization:', error)
                      }
                    }
                  }}
                  className="flex-1 btn-primary"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setNewOrgName('')
                    setShowCreateOrg(false)
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 