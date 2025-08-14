export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const api = {
  // Fetch all movies
  getMovies: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies`)
      if (!response.ok) throw new Error('Failed to fetch movies')
      return await response.json()
    } catch (error) {
      console.error('Error fetching movies:', error)
      throw error
    }
  },

  // Fetch single movie by ID
  getMovie: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${id}`)
      if (!response.ok) throw new Error('Movie not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching movie:', error)
      throw error
    }
  },

  // Fetch user profile
  getUserProfile: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch profile')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  },

  // Update user profile
  updateUserProfile: async (token, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  },

  // Change user password
  changePassword: async (token, currentPassword, newPassword) => {
    try {
      // Extract user ID from JWT token
      const tokenPayload = JSON.parse(atob(token.split('.')[1]))
      const userId = tokenPayload.id
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          current_password: currentPassword,
          new_password: newPassword 
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to change password')
      }
      return await response.json()
    } catch (error) {
      console.error('Error changing password:', error)
      throw error
    }
  }
}

// Helper function to get streaming URL
export const getStreamUrl = (movieId) => {
  return `${API_BASE_URL}/stream/${movieId}`
}

// Helper function to format date
export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper function to truncate text
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
