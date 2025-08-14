import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { api } from '../utils/api'
import './Profile.css'

const Profile = () => {
  const { user, token, logout, updateUserData, isAuthenticated } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchProfile()
  }, [isAuthenticated, navigate])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const userProfile = await api.getUserProfile(token)
      setProfile(userProfile)
      setFormData({
        username: userProfile.username || '',
        email: userProfile.email || ''
      })
    } catch (err) {
      setError('Failed to load profile')
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate that at least one field has meaningful content
    const trimmedUsername = formData.username.trim()
    const trimmedEmail = formData.email.trim()
    
    if (!trimmedUsername && !trimmedEmail) {
      setError('At least one field (username or email) is required for update.')
      return
    }

    // Validate username length if provided
    if (trimmedUsername && (trimmedUsername.length < 3 || trimmedUsername.length > 50)) {
      setError('Username must be between 3 and 50 characters.')
      return
    }

    // Validate email format if provided
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      const updatedProfile = await api.updateUserProfile(token, {
        username: trimmedUsername || undefined,
        email: trimmedEmail || undefined
      })
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
      
      // Update both local profile state and global auth context
      setProfile(updatedProfile.user)
      updateUserData(updatedProfile.user)
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to update profile')
      console.error('Error updating profile:', err)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    // Validate password length
    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      return
    }

    try {
      setPasswordLoading(true)
      await api.changePassword(token, passwordData.currentPassword, passwordData.newPassword)
      setSuccess('Password changed successfully!')
      setShowPasswordChange(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to change password')
      console.error('Error changing password:', err)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>Profile</h1>
          <p>Manage your account settings</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {profile?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>

            {!isEditing && !showPasswordChange ? (
              <div className="profile-info">
                <div className="info-group">
                  <label>Username</label>
                  <p>{profile?.username || 'Not set'}</p>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <p>{profile?.email || 'Not set'}</p>
                </div>
                <div className="info-group">
                  <label>Member Since</label>
                  <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</p>
                </div>
                
                <div className="profile-actions">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="edit-btn"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setShowPasswordChange(true)}
                    className="password-btn"
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="logout-btn"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    minLength="3"
                    maxLength="50"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit"
                    className="save-btn"
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setFormData({
                        username: profile?.username || '',
                        email: profile?.email || ''
                      })
                      setError('')
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="8"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="8"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit"
                    className="save-btn"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? 'Changing Password...' : 'Change Password'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowPasswordChange(false)
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      })
                      setError('')
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
