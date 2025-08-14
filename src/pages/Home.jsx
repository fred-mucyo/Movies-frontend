import React, { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../utils/api'
import MovieCard from '../components/MovieCard'
import LoadingSpinner from '../components/LoadingSpinner'
import FeaturedHero from '../components/FeaturedHero'
import './Home.css'

const Home = () => {
  const location = useLocation()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMovies, setFilteredMovies] = useState([])
  const popularNow = useMemo(() => {
    const popular = movies.filter(m => m.is_popular)
    return (popular.length ? popular : movies).slice(0, 6)
  }, [movies])
  const recentReleases = useMemo(() => movies.slice(0, 4), [movies])

  useEffect(() => {
    fetchMovies()
  }, [])

  useEffect(() => {
    // Check for search parameter in URL
    const params = new URLSearchParams(location.search)
    const searchParam = params.get('search')
    if (searchParam) {
      setSearchTerm(searchParam)
    }
  }, [location.search])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMovies(movies)
    } else {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (movie.description && movie.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (movie.interpreter_name && movie.interpreter_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredMovies(filtered)
    }
  }, [searchTerm, movies])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const data = await api.getMovies()
      setMovies(data)
      setFilteredMovies(data)
      setError(null)
    } catch (err) {
      setError('Failed to load movies. Please try again later.')
      console.error('Error fetching movies:', err)
    } finally {
      setLoading(false)
    }
  }



  if (loading) {
    return <LoadingSpinner text="Loading amazing movies..." />
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="error-container">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={fetchMovies} className="retry-btn">
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="home-page">
      {/* Featured Hero with inline trailer embed */}
      <div className="container" id="featured">
        <FeaturedHero movies={movies} />
      </div>

      <div className="container">
        {/* Popular Now */}
        <div className="movies-section" id="popular">
          <div className="section-header">
            <h2 className="section-title">Popular Now</h2>
            <div className="section-subtitle">Hand-picked highlights</div>
          </div>
          <div className="movies-grid compact-grid">
            {popularNow.map((movie) => (
              <MovieCard key={`popular-${movie.id}`} movie={movie} />
            ))}
          </div>
        </div>

        {/* Recent Releases */}
        <div className="movies-section" id="recent">
          <div className="section-header">
            <h2 className="section-title">Recent Releases</h2>
            <div className="section-subtitle">Fresh additions across genres</div>
          </div>
          <div className="movies-grid compact-grid">
            {recentReleases.map((movie) => (
              <MovieCard key={`recent-${movie.id}`} movie={movie} />
            ))}
          </div>
        </div>

        {/* Search Results (if any) */}
        {searchTerm && (
          <div className="movies-section">
            <div className="section-header">
              <h2 className="section-title">Search Results</h2>
              <div className="trailer-highlight">
                <span className="trailer-icon">🎬</span>
                <span>Click any thumbnail to watch trailers!</span>
              </div>
            </div>

            {filteredMovies.length > 0 ? (
              <div className="movies-grid compact-grid">
                {filteredMovies.map((movie) => (
                  <MovieCard key={`search-${movie.id}`} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🎭</div>
                <h3>No movies found</h3>
                <p>Try adjusting your search terms or browse all movies</p>
                <button onClick={() => setSearchTerm('')} className="browse-all-btn">
                  Browse All Movies
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
