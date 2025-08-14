import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import LoadingSpinner from './LoadingSpinner'

const ProtectedAdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAdmin()

  if (loading) {
    return <LoadingSpinner text="Verifying admin access..." />
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedAdminRoute
