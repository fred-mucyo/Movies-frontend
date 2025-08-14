import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import { useAuth } from '../context/AuthContext'
import { adminApi } from '../utils/adminApi'
import LoadingSpinner from '../components/LoadingSpinner'
import { API_BASE_URL } from '../utils/api'
import './Admin.css'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [analytics, setAnalytics] = useState(null)
  const [users, setUsers] = useState([])
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Add Movie Modal State
  const [showAddMovieModal, setShowAddMovieModal] = useState(false)
  const [addMovieLoading, setAddMovieLoading] = useState(false)
  const [addMovieError, setAddMovieError] = useState('')
  const [addMovieSuccess, setAddMovieSuccess] = useState('')
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    video_url: '',
    youtube_trailer_url: '',
    thumbnail_url: '',
    interpreter_name: ''
  })
  
  // Delete Movie Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [movieToDelete, setMovieToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Edit Movie Modal State
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')
  
  const { isAdmin, user, token } = useAdmin()
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin || !token) {
      navigate('/admin/login')
      return
    }
    
    fetchDashboardData()
  }, [isAdmin, token, navigate])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [analyticsData, usersData, moviesData] = await Promise.all([
        adminApi.getAnalytics(token),
        adminApi.getAllUsers(token),
        fetch(`${API_BASE_URL}/movies`).then(res => res.json())
      ])
      
      setAnalytics(analyticsData)
      setUsers(usersData)
      setMovies(moviesData)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  // Add Movie Functions
  const handleAddMovie = async (e) => {
    e.preventDefault()
    setAddMovieError('')
    setAddMovieLoading(true)

    // Basic validation
    if (!newMovie.title.trim()) {
      setAddMovieError('Movie title is required')
      setAddMovieLoading(false)
      return
    }

    if (!newMovie.video_url.trim()) {
      setAddMovieError('Video URL is required')
      setAddMovieLoading(false)
      return
    }

    // Validate URLs
    try {
      if (newMovie.video_url && !isValidUrl(newMovie.video_url)) {
        setAddMovieError('Please enter a valid video URL')
        setAddMovieLoading(false)
        return
      }
      if (newMovie.youtube_trailer_url && !isValidUrl(newMovie.youtube_trailer_url)) {
        setAddMovieError('Please enter a valid YouTube trailer URL')
        setAddMovieLoading(false)
        return
      }
      // Skip thumbnail URL validation if it's a base64 data URL (from file upload)
      if (newMovie.thumbnail_url && !newMovie.thumbnail_url.startsWith('data:image/') && !isValidUrl(newMovie.thumbnail_url)) {
        setAddMovieError('Please enter a valid thumbnail URL')
        setAddMovieLoading(false)
        return
      }
    } catch (err) {
      setAddMovieError('Please enter valid URLs')
      setAddMovieLoading(false)
      return
    }

    try {
      console.log('Sending movie data to backend:', {
        ...newMovie,
        thumbnail_url: newMovie.thumbnail_url ? `${newMovie.thumbnail_url.substring(0, 50)}...` : null
      });
      const addedMovie = await adminApi.addMovie(token, newMovie)
      setMovies([addedMovie, ...movies]) // Add to beginning of list
      setShowAddMovieModal(false)
      setNewMovie({
        title: '',
        description: '',
        video_url: '',
        youtube_trailer_url: '',
        thumbnail_url: '',
        interpreter_name: ''
      })
      setAddMovieSuccess('Movie added successfully!')
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setAddMovieSuccess('')
      }, 5000)
    } catch (err) {
      console.error('Error adding movie:', err);
      console.error('Error details:', err.message);
      setAddMovieError(err.message || 'Failed to add movie')
    } finally {
      setAddMovieLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewMovie(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const openAddMovieModal = () => {
    setShowAddMovieModal(true)
    setAddMovieError('')
    setAddMovieSuccess('') // Clear success message when opening modal
  }

  const closeAddMovieModal = () => {
    setShowAddMovieModal(false)
    setAddMovieError('')
    setAddMovieSuccess('')
    setNewMovie({
      title: '',
      description: '',
      video_url: '',
      youtube_trailer_url: '',
      thumbnail_url: '',
      interpreter_name: ''
    })
    // Clear the file input
    const fileInput = document.getElementById('thumbnail_file')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  // URL validation helper
  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  // Delete Movie Functions
  const openDeleteModal = (movie) => {
    setMovieToDelete(movie)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setMovieToDelete(null)
  }

  const handleDeleteMovie = async () => {
    if (!movieToDelete) return
    
    setDeleteLoading(true)
    try {
      await adminApi.deleteMovie(token, movieToDelete.id)
      setMovies(movies.filter(movie => movie.id !== movieToDelete.id))
      setShowDeleteModal(false)
      setMovieToDelete(null)
      setAddMovieSuccess('Movie deleted successfully!')
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setAddMovieSuccess('')
      }, 5000)
    } catch (err) {
      console.error('Failed to delete movie:', err)
      setAddMovieError('Failed to delete movie')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Edit Movie Functions
  const openEditModal = (movie) => {
    setEditingMovie({
      id: movie.id,
      title: movie.title || '',
      description: movie.description || '',
      video_url: movie.video_url || '',
      youtube_trailer_url: movie.youtube_trailer_url || '',
      thumbnail_url: movie.thumbnail_url || '',
      interpreter_name: movie.interpreter_name || '',
      is_featured: !!movie.is_featured,
      is_popular: !!movie.is_popular
    })
    setShowEditModal(true)
    setEditError('')
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingMovie(null)
    setEditError('')
    // Clear the file input
    const fileInput = document.getElementById('edit-thumbnail_file')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleEditMovie = async (e) => {
    e.preventDefault()
    if (!editingMovie) return

    setEditError('')
    setEditLoading(true)

    // Basic validation
    if (!editingMovie.title.trim()) {
      setEditError('Movie title is required')
      setEditLoading(false)
      return
    }

    if (!editingMovie.video_url.trim()) {
      setEditError('Video URL is required')
      setEditLoading(false)
      return
    }

    // Validate URLs
    try {
      if (editingMovie.video_url && !isValidUrl(editingMovie.video_url)) {
        setEditError('Please enter a valid video URL')
        setEditLoading(false)
        return
      }
      if (editingMovie.youtube_trailer_url && !isValidUrl(editingMovie.youtube_trailer_url)) {
        setEditError('Please enter a valid YouTube trailer URL')
        setEditLoading(false)
        return
      }
      // Skip thumbnail URL validation if it's a base64 data URL (from file upload)
      if (editingMovie.thumbnail_url && !editingMovie.thumbnail_url.startsWith('data:image/') && !isValidUrl(editingMovie.thumbnail_url)) {
        setEditError('Please enter a valid thumbnail URL')
        setEditLoading(false)
        return
      }
    } catch (err) {
      setEditError('Please enter valid URLs')
      setEditLoading(false)
      return
    }

    try {
      const updatedMovie = await adminApi.updateMovie(token, editingMovie.id, editingMovie)
      setMovies(movies.map(movie => 
        movie.id === editingMovie.id ? updatedMovie.movie : movie
      ))
      setShowEditModal(false)
      setEditingMovie(null)
      setAddMovieSuccess('Movie updated successfully!')
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setAddMovieSuccess('')
      }, 5000)
    } catch (err) {
      setEditError(err.message || 'Failed to update movie')
    } finally {
      setEditLoading(false)
    }
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditingMovie(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return <LoadingSpinner text="Loading Admin Dashboard..." />
  }

  if (error) {
    return (
      <div className="admin-error">
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-btn">Retry</button>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>🎬 Admin Dashboard</h1>
          <p>Welcome back, {user?.username || 'Administrator'}</p>
        </div>
        <div className="admin-header-right">
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {addMovieSuccess && (
        <div className="success-banner">
          <span className="success-icon">✅</span>
          <span className="success-text">{addMovieSuccess}</span>
          <button 
            className="success-close" 
            onClick={() => setAddMovieSuccess('')}
          >
            ×
          </button>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          🎬 Movies
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Movies</h3>
                <p className="stat-number">{movies.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{users.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Visits</h3>
                <p className="stat-number">{analytics?.visits?.total_visits || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Top Countries</h3>
                <p className="stat-number">{analytics?.countries?.length || 0}</p>
              </div>
            </div>
            
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button onClick={() => setActiveTab('movies')} className="action-btn">
                  ➕ Add New Movie
                </button>
                <button onClick={() => setActiveTab('users')} className="action-btn">
                  👥 Manage Users
                </button>
                <button onClick={() => setActiveTab('analytics')} className="action-btn">
                  📊 View Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'movies' && (
          <div className="movies-tab">
            <div className="tab-header">
              <h2>Movie Management</h2>
              <button className="add-movie-btn" onClick={openAddMovieModal}>➕ Add New Movie</button>
            </div>
            <div className="movies-list">
              {movies.map(movie => (
                <div key={movie.id} className="movie-item">
                  <div className="movie-info">
                    <h4>{movie.title}</h4>
                    <p>{movie.description}</p>
                    <span className="movie-meta">Added: {new Date(movie.created_at).toLocaleDateString()}</span>
                  </div>
                    <div className="movie-actions">
                      <button className="edit-btn" onClick={() => openEditModal(movie)}>✏️ Edit</button>
                      <button className="delete-btn" onClick={() => openDeleteModal(movie)}>🗑️ Delete</button>
                      <button
                        className="edit-btn"
                        onClick={async () => {
                          try {
                            const updated = await adminApi.setMovieFlags(token, movie.id, { is_featured: !movie.is_featured })
                            setMovies(movies.map(m => m.id === movie.id ? updated.movie : m))
                          } catch (e) { console.error(e) }
                        }}
                      >{movie.is_featured ? 'Unfeature' : 'Make Featured'}</button>
                      <button
                        className="edit-btn"
                        onClick={async () => {
                          try {
                            const updated = await adminApi.setMovieFlags(token, movie.id, { is_popular: !movie.is_popular })
                            setMovies(movies.map(m => m.id === movie.id ? updated.movie : m))
                          } catch (e) { console.error(e) }
                        }}
                      >{movie.is_popular ? 'Remove Popular' : 'Mark Popular'}</button>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="tab-header">
              <h2>User Management</h2>
            </div>
            <div className="users-list">
              {users.map(user => (
                <div key={user.id} className="user-item">
                  <div className="user-info">
                    <h4>{user.username}</h4>
                    <p>{user.email}</p>
                    <span className={`user-role ${user.role}`}>{user.role}</span>
                  </div>
                  <div className="user-actions">
                    <select 
                      className="role-select"
                      defaultValue={user.role}
                      onChange={async (e) => {
                        try {
                          const newRole = e.target.value
                          await adminApi.updateUserRole(token, user.id, newRole)
                          // refresh users list
                          const updatedUsers = await adminApi.getAllUsers(token)
                          setUsers(updatedUsers)
                        } catch (err) {
                          console.error('Failed to update user role:', err)
                        }
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="tab-header">
              <h2>Analytics Dashboard</h2>
            </div>
            
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Top Movies by Visits</h3>
                <div className="top-movies">
                  {analytics?.topMovies?.slice(0, 5).map((movie, index) => (
                    <div key={index} className="top-movie-item">
                      <span className="rank">#{index + 1}</span>
                      <span className="movie-id">Movie {movie.movie_id}</span>
                      <span className="visits">{movie.visits} visits</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>Visits by Country</h3>
                <div className="countries-list">
                  {analytics?.countries?.slice(0, 5).map((country, index) => (
                    <div key={index} className="country-item">
                      <span className="country-name">{country.country}</span>
                      <span className="visits">{country.visits} visits</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      {showAddMovieModal && (
        <div className="modal-overlay" onClick={closeAddMovieModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Add New Movie</h2>
              <button className="modal-close" onClick={closeAddMovieModal}>×</button>
            </div>
            
            <form onSubmit={handleAddMovie} className="add-movie-form">
              <div className="form-group">
                <label htmlFor="title">Movie Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newMovie.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter movie title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newMovie.description}
                  onChange={handleInputChange}
                  placeholder="Enter movie description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="video_url">Video URL *</label>
                <input
                  type="url"
                  id="video_url"
                  name="video_url"
                  value={newMovie.video_url}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter video URL (MP4, WebM, etc.)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="youtube_trailer_url">YouTube Trailer URL</label>
                <input
                  type="url"
                  id="youtube_trailer_url"
                  name="youtube_trailer_url"
                  value={newMovie.youtube_trailer_url}
                  onChange={handleInputChange}
                  placeholder="Enter YouTube trailer URL"
                />
              </div>

              <div className="form-group">
                <label htmlFor="thumbnail_file">Thumbnail Image</label>
                <input
                  type="file"
                  id="thumbnail_file"
                  name="thumbnail_file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      // Convert file to base64 data URL
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const base64Url = event.target.result
                        setNewMovie(prev => ({
                          ...prev,
                          thumbnail_file: file,
                          thumbnail_url: base64Url
                        }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="file-input"
                />
                <small className="form-help">Upload a thumbnail image (JPG, PNG, GIF)</small>
              </div>

              <div className="form-group">
                <label htmlFor="interpreter_name">Interpreter Name</label>
                <input
                  type="text"
                  id="interpreter_name"
                  name="interpreter_name"
                  value={newMovie.interpreter_name}
                  onChange={handleInputChange}
                  placeholder="Enter interpreter name"
                />
              </div>

              {/* Movie Preview */}
              {(newMovie.title || newMovie.description || newMovie.thumbnail_url) && (
                <div className="movie-preview">
                  <h4>Preview</h4>
                  <div className="preview-content">
                    {newMovie.thumbnail_url && (
                      <div className="preview-thumbnail">
                        <img 
                          src={newMovie.thumbnail_url} 
                          alt="Movie thumbnail" 
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                          }}
                        />
                        <div className="thumbnail-placeholder" style={{display: 'none'}}>
                          🎬
                        </div>
                      </div>
                    )}
                    <div className="preview-info">
                      <h5>{newMovie.title || 'Movie Title'}</h5>
                      <p>{newMovie.description || 'No description provided'}</p>
                      {newMovie.interpreter_name && (
                        <span className="preview-interpreter">👤 {newMovie.interpreter_name}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {addMovieError && (
                <div className="error-message">{addMovieError}</div>
              )}
              {addMovieSuccess && (
                <div className="success-message">{addMovieSuccess}</div>
              )}

              <div className="modal-actions">
                <button type="button" onClick={closeAddMovieModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={addMovieLoading}>
                  {addMovieLoading ? 'Adding...' : 'Add Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && movieToDelete && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🗑️ Delete Movie</h2>
              <button className="modal-close" onClick={closeDeleteModal}>×</button>
            </div>
            
            <div className="delete-movie-content">
              <div className="delete-warning">
                <span className="warning-icon">⚠️</span>
                <h3>Are you sure you want to delete this movie?</h3>
                <p>This action cannot be undone.</p>
              </div>
              
              <div className="movie-to-delete">
                <h4>{movieToDelete.title}</h4>
                {movieToDelete.description && (
                  <p>{movieToDelete.description}</p>
                )}
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={closeDeleteModal} className="btn-secondary">
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleDeleteMovie} 
                  className="btn-danger" 
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Movie'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Movie Modal */}
      {showEditModal && editingMovie && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Movie</h2>
              <button className="modal-close" onClick={closeEditModal}>×</button>
            </div>
            
            <form onSubmit={handleEditMovie} className="add-movie-form">
              <div className="form-group">
                <label htmlFor="edit-title">Movie Title *</label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={editingMovie.title}
                  onChange={handleEditInputChange}
                  required
                  placeholder="Enter movie title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editingMovie.description}
                  onChange={handleEditInputChange}
                  placeholder="Enter movie description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-video_url">Video URL *</label>
                <input
                  type="url"
                  id="edit-video_url"
                  name="video_url"
                  value={editingMovie.video_url}
                  onChange={handleEditInputChange}
                  required
                  placeholder="Enter video URL (MP4, WebM, etc.)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-youtube_trailer_url">YouTube Trailer URL</label>
                <input
                  type="url"
                  id="edit-youtube_trailer_url"
                  name="youtube_trailer_url"
                  value={editingMovie.youtube_trailer_url}
                  onChange={handleEditInputChange}
                  placeholder="Enter YouTube trailer URL"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-thumbnail_file">Thumbnail Image</label>
                <input
                  type="file"
                  id="edit-thumbnail_file"
                  name="thumbnail_file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      // Convert file to base64 data URL
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const base64Url = event.target.result
                        setEditingMovie(prev => ({
                          ...prev,
                          thumbnail_file: file,
                          thumbnail_url: base64Url
                        }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="file-input"
                />
                <small className="form-help">Upload a new thumbnail image (JPG, PNG, GIF)</small>
                {editingMovie.thumbnail_url && !editingMovie.thumbnail_file && (
                  <div className="current-thumbnail">
                    <small>Current thumbnail:</small>
                    <img 
                      src={editingMovie.thumbnail_url} 
                      alt="Current thumbnail" 
                      style={{width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginLeft: '8px'}}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="edit-interpreter_name">Interpreter Name</label>
                <input
                  type="text"
                  id="edit-interpreter_name"
                  name="interpreter_name"
                  value={editingMovie.interpreter_name}
                  onChange={handleEditInputChange}
                  placeholder="Enter interpreter name"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={!!editingMovie.is_featured}
                    onChange={(e) => setEditingMovie(prev => ({ ...prev, is_featured: e.target.checked }))}
                  />
                  Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    name="is_popular"
                    checked={!!editingMovie.is_popular}
                    onChange={(e) => setEditingMovie(prev => ({ ...prev, is_popular: e.target.checked }))}
                  />
                  Popular
                </label>
              </div>

              {/* Movie Preview */}
              {(editingMovie.title || editingMovie.description || editingMovie.thumbnail_url) && (
                <div className="movie-preview">
                  <h4>Preview</h4>
                  <div className="preview-content">
                    {editingMovie.thumbnail_url && (
                      <div className="preview-thumbnail">
                        <img 
                          src={editingMovie.thumbnail_url} 
                          alt="Movie thumbnail" 
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                          }}
                        />
                        <div className="thumbnail-placeholder" style={{display: 'none'}}>
                          🎬
                        </div>
                      </div>
                    )}
                    <div className="preview-info">
                      <h5>{editingMovie.title || 'Movie Title'}</h5>
                      <p>{editingMovie.description || 'No description provided'}</p>
                      {editingMovie.interpreter_name && (
                        <span className="preview-interpreter">👤 {editingMovie.interpreter_name}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {editError && (
                <div className="error-message">{editError}</div>
              )}

              <div className="modal-actions">
                <button type="button" onClick={closeEditModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={editLoading}>
                  {editLoading ? 'Updating...' : 'Update Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
