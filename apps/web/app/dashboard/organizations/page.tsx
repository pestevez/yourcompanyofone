'use client'

import { useAuth } from '@/lib/auth-context'
import { useOrganizations } from '@/lib/organizations-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OrganizationsPage() {
  const { user } = useAuth()
  const { 
    organizations, 
    currentOrganization, 
    loading, 
    error, 
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    addMember,
    removeMember,
    setCurrentOrganization 
  } = useOrganizations()
  const router = useRouter()
  
  const [showCreateOrg, setShowCreateOrg] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('MEMBER')

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

  const handleCreateOrganization = async () => {
    if (newOrgName.trim()) {
      try {
        await createOrganization(newOrgName.trim())
        setNewOrgName('')
        setShowCreateOrg(false)
      } catch (error) {
        console.error('Failed to create organization:', error)
      }
    }
  }

  const handleAddMember = async () => {
    if (newMemberEmail.trim() && currentOrganization) {
      try {
        await addMember(currentOrganization.id, newMemberEmail.trim(), newMemberRole)
        setNewMemberEmail('')
        setNewMemberRole('MEMBER')
        setShowAddMember(false)
      } catch (error) {
        console.error('Failed to add member:', error)
      }
    }
  }

  const handleDeleteOrganization = async (orgId: string) => {
    if (confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      try {
        await deleteOrganization(orgId)
      } catch (error) {
        console.error('Failed to delete organization:', error)
      }
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (currentOrganization && confirm('Are you sure you want to remove this member?')) {
      try {
        await removeMember(currentOrganization.id, memberId)
      } catch (error) {
        console.error('Failed to remove member:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
              <p className="text-gray-600">
                Manage your organizations and team members
              </p>
            </div>
            <button
              onClick={() => setShowCreateOrg(true)}
              className="btn-primary"
            >
              Create Organization
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading organizations...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600">{error}</div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Organization List */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {organizations.map((org) => (
                  <div key={org.id} className="card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {org.name}
                          {currentOrganization?.id === org.id && (
                            <span className="ml-2 text-sm text-blue-600">(Current)</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {org.plan.name} Plan - ${org.plan.price}/month
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentOrganization(org)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Switch
                        </button>
                        {org.members.length > 1 && (
                          <button
                            onClick={() => handleDeleteOrganization(org.id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Members:</span> {org.members.length}</p>
                      <p><span className="font-medium">Content:</span> {org._count.content}</p>
                      <p><span className="font-medium">Platforms:</span> {org._count.platformIdentities}</p>
                    </div>

                    {/* Members List */}
                    {currentOrganization?.id === org.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-medium text-gray-900">Members</h4>
                          <button
                            onClick={() => setShowAddMember(true)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Add Member
                          </button>
                        </div>
                        <div className="space-y-2">
                          {org.members.map((member) => (
                            <div key={member.id} className="flex justify-between items-center text-sm">
                              <div>
                                <span className="font-medium">{member.user.name}</span>
                                <span className="text-gray-500 ml-2">({member.user.email})</span>
                                <span className="text-gray-400 ml-2">• {member.role}</span>
                              </div>
                              {org.members.length > 1 && member.role !== 'ADMIN' && (
                                <button
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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
                  onClick={handleCreateOrganization}
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

      {/* Add Member Modal */}
      {showAddMember && currentOrganization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add Member to {currentOrganization.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="memberEmail"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="member@example.com"
                />
              </div>
              <div>
                <label htmlFor="memberRole" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="memberRole"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddMember}
                  className="flex-1 btn-primary"
                >
                  Add Member
                </button>
                <button
                  onClick={() => {
                    setNewMemberEmail('')
                    setNewMemberRole('MEMBER')
                    setShowAddMember(false)
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