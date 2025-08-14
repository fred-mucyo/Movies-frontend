import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAdmin } from '../context/AdminContext'
import LoadingSpinner from '../components/LoadingSpinner'
import './Admin.css'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const { isAdmin } = useAdmin()
  const navigate = useNavigate()

  // Redirect to admin dashboard if already admin
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard')
    }
  }, [isAdmin, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(formData.username, formData.password)
      
      if (result.success) {
        // Check if user has admin role
        if (result.user && result.user.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          setError('Access denied. Administrator privileges required.')
        }
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Authenticating..." />
  }

  return (
    <div className="admin-login">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h1>🔐 Admin Portal</h1>
          <p>Enter your administrator credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter admin username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter admin password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>🔒 Secure admin access only</p>
          <p className="admin-note">
            Note: Admin accounts must be manually assigned by database administrator
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
