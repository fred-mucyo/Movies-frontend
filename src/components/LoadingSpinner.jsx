import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner"></div>
      {text && <p>{text}</p>}
    </div>
  )
}

export default LoadingSpinner

