import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWatchlist } from '../context/WatchlistContext'
import { api, formatDate } from '../utils/api'
import TrailerEmbed from '../components/TrailerEmbed'
import './MovieDetail.css'

const MovieDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
  
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)
  const [popular, setPopular] = useState([])

  useEffect(() => {
    fetchMovie()
  }, [id])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('t') === 'trailer') {
      setShowTrailer(true)
    }
  }, [location.search])

  const fetchMovie = async () => {
    try {
      setLoading(true)
      const data = await api.getMovie(id)
      setMovie(data)
      // also fetch popular list for sidebar
      const all = await api.getMovies()
      const popularList = all.filter(m => m.is_popular).slice(0, 6)
      setPopular(popularList.length ? popularList : all.slice(0, 6))
      setError(null)
    } catch (err) {
      setError('Movie not found or failed to load.')
      console.error('Error fetching movie:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setIsWatchlistLoading(true)
    try {
      if (isInWatchlist(movie.id)) {
        await removeFromWatchlist(movie.id)
      } else {
        await addToWatchlist(movie.id)
      }
    } catch (error) {
      console.error('Watchlist operation failed:', error)
    } finally {
      setIsWatchlistLoading(false)
    }
  }

  const openExternal = (url) => {
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleTrailerClick = () => setShowTrailer(true)

  const defaultThumbnail = 'https://via.placeholder.com/400x600/1a1a2e/ffffff?text=Movie'

  if (loading) {
    return (
      <div className="movie-detail-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading movie details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-page">
        <div className="container">
          <div className="error-container">
            <h2>Movie Not Found</h2>
            <p>{error || 'The movie you are looking for does not exist.'}</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-detail-page">
      <div className="container">
        <div className="movie-detail-container">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/')} 
            className="back-button"
          >
            ← Back to Movies
          </button>

          <div className="movie-detail-content">
            {/* Movie Info (left) */}
            <div className="movie-info">
              <h1 className="movie-title">{movie.title}</h1>
              
              {movie.description && (
                <p className="movie-description">{movie.description}</p>
              )}

              {/* Trailer Section */}
              {movie.youtube_trailer_url && (
                <div className="trailer-section">
                  <h3>🎬 Watch Trailer</h3>
                  <p>Get a preview of this amazing movie!</p>
                  {!showTrailer ? (
                    <button onClick={handleTrailerClick} className="trailer-watch-btn">
                      🎥 Watch Trailer Now
                    </button>
                  ) : (
                    <TrailerEmbed
                      youtubeUrl={movie.youtube_trailer_url}
                      thumbnailUrl={movie.thumbnail_url}
                      title={movie.title}
                    />
                  )}
                </div>
              )}

              {/* Movie Details */}
              <div className="movie-details">
                {movie.interpreter_name && (
                  <div className="detail-item">
                    <strong>Interpreter:</strong> {movie.interpreter_name}
                  </div>
                )}
                
                {movie.created_at && (
                  <div className="detail-item">
                    <strong>Added:</strong> {formatDate(movie.created_at)}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="movie-actions">
                {movie.video_url && (
                  <>
                    <button onClick={() => openExternal(movie.video_url)} className="btn btn-primary">
                      🎬 Watch Full Movie
                    </button>
                    <a href={movie.video_url} download className="btn btn-secondary">
                      ⬇️ Download
                    </a>
                  </>
                )}
                
                {isAuthenticated && (
                  <button
                    onClick={handleWatchlistToggle}
                    disabled={isWatchlistLoading}
                    className={`btn ${isInWatchlist(movie.id) ? 'btn-danger' : 'btn-secondary'}`}
                  >
                    {isWatchlistLoading ? (
                      <span className="spinner spinner-sm"></span>
                    ) : isInWatchlist(movie.id) ? (
                      'Remove from Watchlist'
                    ) : (
                      'Add to Watchlist'
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Right panel: Popular thumbnails horizontal strip */}
            <aside className="right-panel">
              <h3 className="right-panel-title">Popular Now</h3>
              <div className="thumb-strip">
                {popular.map(p => (
                  <button key={p.id} className="thumb-card" onClick={() => navigate(`/movie/${p.id}`)} title={p.title}>
                    <img src={p.thumbnail_url || defaultThumbnail} alt={p.title} onError={(e)=>{e.currentTarget.src=defaultThumbnail}} />
                  </button>
                ))}
              </div>
            </aside>
          </div>

          {/* Inline trailer shown above; no server-side streaming needed */}
        </div>
      </div>
    </div>
  )
}

export default MovieDetail

