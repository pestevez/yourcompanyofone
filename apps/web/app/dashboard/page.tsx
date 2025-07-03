'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, currentOrganization, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

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
              <span className="text-sm text-gray-500">
                {currentOrganization?.organization.name}
              </span>
              <button
                onClick={logout}
                className="btn-secondary"
              >
                Sign out
              </button>
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
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Name:</span> {currentOrganization?.organization.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Your Role:</span> {currentOrganization?.role}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full btn-primary">
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
    </div>
  )
} 