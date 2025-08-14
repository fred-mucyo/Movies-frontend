import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { WatchlistContext } from '../context/WatchlistContext'
import MovieCard from '../components/MovieCard'
import './Watchlist.css'

const Watchlist = () => {
  const { user } = useContext(AuthContext)
  const { watchlist, removeFromWatchlist, isInWatchlist } = useContext(WatchlistContext)
  const [filteredWatchlist, setFilteredWatchlist] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
  }, [user, navigate])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredWatchlist(watchlist)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = watchlist.filter(movie => {
        const title = movie.title?.toLowerCase() || ''
        const desc = movie.description?.toLowerCase() || ''
        const interp = movie.interpreter_name?.toLowerCase() || ''
        return title.includes(term) || desc.includes(term) || interp.includes(term)
      })
      setFilteredWatchlist(filtered)
    }
  }, [watchlist, searchTerm])

  if (!user) {
    return null
  }

  return (
    <div className="watchlist-page">
      <div className="container">
        <div className="watchlist-header">
          <h1>My Watchlist</h1>
          <p>Keep track of movies you want to watch</p>
        </div>

        {watchlist.length > 0 && (
          <div className="search-section">
            <input
              type="text"
              placeholder="Search your watchlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        {watchlist.length === 0 ? (
          <div className="empty-watchlist">
            <div className="empty-icon">📺</div>
            <h2>Your watchlist is empty</h2>
            <p>Start adding movies to your watchlist to see them here</p>
            <button 
              onClick={() => navigate('/')}
              className="browse-movies-btn"
            >
              Browse Movies
            </button>
          </div>
        ) : filteredWatchlist.length === 0 ? (
          <div className="no-results">
            <p>No movies found matching "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="clear-search-btn"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="watchlist-stats">
              <span>{filteredWatchlist.length} movie{filteredWatchlist.length !== 1 ? 's' : ''} in your watchlist</span>
            </div>
            <div className="watchlist-grid">
              {filteredWatchlist.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie}
                  showWatchlistButton={true}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Watchlist

