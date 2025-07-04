'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { organizationsAPI } from './api'

interface Organization {
  id: string
  name: string
  planId: string
  plan: {
    id: string
    name: string
    description: string
    price: number
    features: Record<string, any>
  }
  members: Array<{
    id: string
    userId: string
    role: string
    user: {
      id: string
      name: string
      email: string
    }
  }>
  _count: {
    content: number
    platformIdentities: number
  }
}

interface OrganizationsContextType {
  organizations: Organization[]
  currentOrganization: Organization | null
  loading: boolean
  error: string | null
  fetchOrganizations: () => Promise<void>
  createOrganization: (name: string) => Promise<Organization>
  updateOrganization: (id: string, data: { name?: string }) => Promise<Organization>
  deleteOrganization: (id: string) => Promise<void>
  getOrganization: (id: string) => Promise<Organization>
  getMembers: (organizationId: string) => Promise<any[]>
  addMember: (organizationId: string, email: string, role: string) => Promise<any>
  removeMember: (organizationId: string, memberId: string) => Promise<void>
  setCurrentOrganization: (org: Organization | null) => void
}

const OrganizationsContext = createContext<OrganizationsContextType | undefined>(undefined)

export function OrganizationsProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrganization, setCurrentOrganizationState] = useState<Organization | null>(null)
  
  const setCurrentOrganization = useCallback((org: Organization | null) => {
    setCurrentOrganizationState(org)
  }, [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await organizationsAPI.list()
      setOrganizations(data)
      
      // Set current organization if not already set
      if (!currentOrganization && data.length > 0) {
        setCurrentOrganizationState(data[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organizations')
      console.error('Error fetching organizations:', err)
    } finally {
      setLoading(false)
    }
  }, [currentOrganization])

  const createOrganization = useCallback(async (name: string): Promise<Organization> => {
    try {
      setError(null)
      const newOrg = await organizationsAPI.create({ name })
      setOrganizations(prev => [...prev, newOrg])
      
      // Set as current organization if it's the first one
      if (organizations.length === 0) {
        setCurrentOrganizationState(newOrg)
      }
      
      return newOrg
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create organization'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [organizations.length])

  const updateOrganization = useCallback(async (id: string, data: { name?: string }): Promise<Organization> => {
    try {
      setError(null)
      const updatedOrg = await organizationsAPI.update(id, data)
      setOrganizations(prev => 
        prev.map(org => org.id === id ? updatedOrg : org)
      )
      
      // Update current organization if it's the one being updated
      if (currentOrganization?.id === id) {
        setCurrentOrganizationState(updatedOrg)
      }
      
      return updatedOrg
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update organization'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [currentOrganization?.id])

  const deleteOrganization = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await organizationsAPI.delete(id)
      setOrganizations(prev => prev.filter(org => org.id !== id))
      
      // Clear current organization if it's the one being deleted
      if (currentOrganization?.id === id) {
        setCurrentOrganizationState(organizations.length > 1 ? organizations[0] : null)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete organization'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [currentOrganization?.id, organizations.length])

  const getOrganization = useCallback(async (id: string): Promise<Organization> => {
    try {
      setError(null)
      return await organizationsAPI.get(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organization'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getMembers = useCallback(async (organizationId: string): Promise<any[]> => {
    try {
      setError(null)
      return await organizationsAPI.getMembers(organizationId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch members'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addMember = useCallback(async (organizationId: string, email: string, role: string): Promise<any> => {
    try {
      setError(null)
      const newMember = await organizationsAPI.addMember(organizationId, { email, role })
      
      // Refresh the organization to get updated member list
      const updatedOrg = await getOrganization(organizationId)
      setOrganizations(prev => 
        prev.map(org => org.id === organizationId ? updatedOrg : org)
      )
      
      if (currentOrganization?.id === organizationId) {
        setCurrentOrganizationState(updatedOrg)
      }
      
      return newMember
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add member'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [getOrganization, currentOrganization?.id])

  const removeMember = useCallback(async (organizationId: string, memberId: string): Promise<void> => {
    try {
      setError(null)
      await organizationsAPI.removeMember(organizationId, memberId)
      
      // Refresh the organization to get updated member list
      const updatedOrg = await getOrganization(organizationId)
      setOrganizations(prev => 
        prev.map(org => org.id === organizationId ? updatedOrg : org)
      )
      
      if (currentOrganization?.id === organizationId) {
        setCurrentOrganizationState(updatedOrg)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove member'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [getOrganization, currentOrganization?.id])

  return (
    <OrganizationsContext.Provider
      value={{
        organizations,
        currentOrganization,
        loading,
        error,
        fetchOrganizations,
        createOrganization,
        updateOrganization,
        deleteOrganization,
        getOrganization,
        getMembers,
        addMember,
        removeMember,
        setCurrentOrganization,
      }}
    >
      {children}
    </OrganizationsContext.Provider>
  )
}

export function useOrganizations() {
  const context = useContext(OrganizationsContext)
  if (context === undefined) {
    throw new Error('useOrganizations must be used within an OrganizationsProvider')
  }
  return context
} 