const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const adminApi = {
  // Movie Management
  addMovie: async (token, movieData) => {
    const { title, description, video_url, youtube_trailer_url, thumbnail_url, interpreter_name } = movieData || {}
    const payload = { title, description, video_url, youtube_trailer_url, thumbnail_url, interpreter_name }
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add movie')
    }
    
    return response.json()
  },

  updateMovie: async (token, movieId, movieData) => {
    const { title, description, video_url, youtube_trailer_url, thumbnail_url, interpreter_name } = movieData || {}
    const payload = { title, description, video_url, youtube_trailer_url, thumbnail_url, interpreter_name }
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update movie')
    }
    
    return response.json()
  },

  deleteMovie: async (token, movieId) => {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete movie')
    }
    
    return response.json()
  },

  setMovieFlags: async (token, movieId, { is_featured, is_popular }) => {
    const response = await fetch(`${API_BASE_URL}/admin/movies/${movieId}/flags`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ is_featured, is_popular })
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update flags')
    }
    return response.json()
  },

  // User Management
  getAllUsers: async (token) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch users')
    }
    
    return response.json()
  },

  updateUserRole: async (token, userId, role) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update user role')
    }
    
    return response.json()
  },

  // Analytics
  getAnalytics: async (token) => {
    const [visitsResponse, topMoviesResponse, countriesResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/admin/analytics/visits`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`${API_BASE_URL}/admin/analytics/top-movies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`${API_BASE_URL}/admin/analytics/countries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ])

    if (!visitsResponse.ok || !topMoviesResponse.ok || !countriesResponse.ok) {
      throw new Error('Failed to fetch analytics data')
    }

    const [visits, topMovies, countries] = await Promise.all([
      visitsResponse.json(),
      topMoviesResponse.json(),
      countriesResponse.json()
    ])

    return { visits, topMovies, countries }
  }
}
