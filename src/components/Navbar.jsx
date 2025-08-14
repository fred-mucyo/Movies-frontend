import React, { useState, useContext, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useAdmin } from '../context/AdminContext'
import './Navbar.css'

const Navbar = () => {
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { isAuthenticated, logout, user } = useContext(AuthContext)
  const { isAdmin } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeMenu, setActiveMenu] = useState('HOME')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userDropdownRef = useRef(null)



  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setShowSearchModal(false)
      setSearchTerm('')
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const scrollToSection = (sectionId) => {
    const doScroll = () => {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(doScroll, 0)
    } else {
      doScroll()
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Netflix-style Logo */}
        <Link to="/" className="nav-brand">
          <div className="brand-logo">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">MovieFlix</span>
          </div>
          <div className="brand-tagline">Unlimited Movies & TV Shows</div>
        </Link>

        {/* Main Navigation */}
        <div className={`nav-menu`}>
                     <button
             className={`nav-link as-button ${activeMenu === 'HOME' ? 'active' : ''}`}
             onClick={() => {
               setActiveMenu('HOME')
               navigate('/')
             }}
           >
             <span className="nav-text">HOME</span>
           </button>

          <button
            className={`nav-link as-button ${activeMenu === 'FEATURED' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('FEATURED')
              scrollToSection('featured')
            }}
          >
            <span className="nav-text">FEATURED</span>
          </button>

          <button
            className={`nav-link as-button ${activeMenu === 'POPULAR' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('POPULAR')
              scrollToSection('popular')
            }}
          >
            <span className="nav-text">POPULAR</span>
          </button>

          <Link to="/watchlist" className={`nav-link ${activeMenu === 'WATCHLIST' ? 'active' : ''}`} onClick={() => {
            setActiveMenu('WATCHLIST')
          }}>
            <span className="nav-text">WATCHLIST</span>
          </Link>

          {/* Admin Portal Link - removed from header as requested */}
        </div>

        {/* User Authentication */}
        <div className="nav-auth">
                     <button className="icon-btn" aria-label="Search" onClick={() => setShowSearchModal(true)}>
             Search
           </button>
          {isAuthenticated ? (
            <div className="user-dropdown" ref={userDropdownRef}>
              <button className="user-avatar-btn" onClick={toggleUserMenu} aria-label="User Menu">
                <span className="avatar-circle">{(user?.username?.[0] || 'U').toUpperCase()}</span>
              </button>
              {isUserMenuOpen && (
                <div className="user-dropdown-menu">
                                     <Link to="/change-password" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>Change Password</Link>
                                     {isAdmin && (
                     <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>Admin Dashboard</Link>
                   )}
                                     <button className="dropdown-item danger" onClick={() => { setIsUserMenuOpen(false); handleLogout() }}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
                             <Link to="/login" className="auth-btn login-btn">
                 <span className="btn-text">Sign In</span>
               </Link>
               <Link to="/register" className="auth-btn register-btn">
                 <span className="btn-text">Sign Up</span>
               </Link>
            </div>
          )}

        </div>


      </div>

      {/* Search Modal (closes on outside click) */}
      {showSearchModal && (
        <div className="search-modal-overlay" onMouseDown={() => setShowSearchModal(false)}>
          <div className="search-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <h3>Search Movies</h3>
              <button 
                className="search-modal-close" 
                onClick={() => setShowSearchModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="search-modal-form">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search movies, descriptions, or interpreters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-modal-input"
                  autoFocus
                />
                {searchTerm && (
                  <button 
                    type="button"
                    onClick={() => setSearchTerm('')} 
                    className="clear-search-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button type="submit" className="search-submit-btn" disabled={!searchTerm.trim()}>
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
