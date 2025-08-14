import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const AdminContext = createContext()

export { AdminContext }

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }) => {
  const { user, isAuthenticated, token } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if current user has admin role
    if (isAuthenticated && user) {
      setIsAdmin(user.role === 'admin')
    } else {
      setIsAdmin(false)
    }
    setLoading(false)
  }, [isAuthenticated, user])

  const value = {
    isAdmin,
    loading,
    user: isAdmin ? user : null,
    token: isAdmin ? token : null
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
