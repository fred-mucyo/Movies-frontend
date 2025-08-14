import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'
import { useAuth } from '../context/AuthContext'
import { truncateText } from '../utils/api'
import './MovieCard.css'

const MovieCard = ({ movie }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      // Show login prompt or redirect to login
      return
    }

    setIsLoading(true)
    try {
      if (isInWatchlist(movie.id)) {
        await removeFromWatchlist(movie.id)
      } else {
        await addToWatchlist(movie.id)
      }
    } catch (error) {
      console.error('Watchlist operation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleThumbnailClick = () => {
    if (movie.youtube_trailer_url) {
      navigate(`/movie/${movie.id}?t=trailer`)
    } else {
      navigate(`/movie/${movie.id}`)
    }
  }

  const defaultThumbnail = 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=Movie'

  return (
    <div className="movie-card">
      <div className="movie-card-image">
        
        <img 
          src={movie.thumbnail_url || defaultThumbnail} 
          alt={movie.title}
          onClick={handleThumbnailClick}
          className="clickable-thumbnail"
          onError={(e) => {
            e.target.src = defaultThumbnail
          }}
        />
        <div className="movie-card-overlay">
          <div className="movie-card-actions">
            {movie.youtube_trailer_url ? (
              <button 
                onClick={handleThumbnailClick}
                className="btn btn-primary trailer-btn"
              >
              Watch
              </button>
            ) : (
              <Link to={`/movie/${movie.id}`} className="btn btn-primary">
                View Details
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={handleWatchlistToggle}
                disabled={isLoading}
                className={`btn ${isInWatchlist(movie.id) ? 'btn-danger' : 'btn-secondary'}`}
              >
                {isLoading ? (
                  <span className="spinner spinner-sm"></span>
                ) : isInWatchlist(movie.id) ? (
                  '❌Watchlist'
                ) : (
                  ' ➕Watchlist'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="movie-card-content">
        <h3 className="movie-card-title">{movie.title}</h3>
        {movie.description && (
          <p className="movie-card-description">
            {truncateText(movie.description, 100)}
          </p>
        )}
        {movie.interpreter_name && (
          <p className="movie-card-interpreter">
            <strong>Interpreter:</strong> {movie.interpreter_name}
          </p>
        )}
        {movie.created_at && (
          <p className="movie-card-date">
            <strong>Added:</strong> {new Date(movie.created_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}

export default MovieCard
