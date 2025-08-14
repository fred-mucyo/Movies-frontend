import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { API_BASE_URL } from '../utils/api'

const WatchlistContext = createContext()

export { WatchlistContext }

export const useWatchlist = () => {
  const context = useContext(WatchlistContext)
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider')
  }
  return context
}

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(false)
  const { token, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchWatchlist()
    } else {
      setWatchlist([])
    }
  }, [isAuthenticated])

  const fetchWatchlist = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/watchlist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setWatchlist(data)
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToWatchlist = async (movieId) => {
    if (!token) return { success: false, error: 'Please login to add movies to watchlist' }
    
    try {
      const response = await fetch(`${API_BASE_URL}/watchlist/${movieId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Refresh watchlist
        await fetchWatchlist()
        return { success: true, message: 'Added to watchlist' }
      } else {
        return { success: false, error: data.message || 'Failed to add to watchlist' }
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const removeFromWatchlist = async (movieId) => {
    if (!token) return { success: false, error: 'Please login to manage watchlist' }
    
    try {
      const response = await fetch(`${API_BASE_URL}/watchlist/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Refresh watchlist
        await fetchWatchlist()
        return { success: true, message: 'Removed from watchlist' }
      } else {
        return { success: false, error: data.message || 'Failed to remove from watchlist' }
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const isInWatchlist = (movieId) => {
    return watchlist.some(movie => movie.id === movieId)
  }

  const value = {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    refreshWatchlist: fetchWatchlist
  }

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  )
}
