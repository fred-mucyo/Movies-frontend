import React, { useState, useMemo } from 'react'
import './TrailerEmbed.css'

function normalizeYouTubeEmbedUrl(rawUrl) {
  if (!rawUrl) return ''
  try {
    const url = new URL(rawUrl)
    // youtu.be/<id>
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace('/', '')
      return `https://www.youtube.com/embed/${id}`
    }
    // youtube.com/watch?v=<id>
    if (url.searchParams.get('v')) {
      const id = url.searchParams.get('v')
      return `https://www.youtube.com/embed/${id}`
    }
    // already embed
    if (url.pathname.includes('/embed/')) return rawUrl
    return rawUrl
  } catch {
    return rawUrl
  }
}

const TrailerEmbed = ({ youtubeUrl, thumbnailUrl, title = 'Trailer' }) => {
  const [showPlayer, setShowPlayer] = useState(false)
  const embedUrl = useMemo(() => normalizeYouTubeEmbedUrl(youtubeUrl), [youtubeUrl])
  const fallbackThumb = 'https://via.placeholder.com/1280x720/1e1e2e/667eea?text=TRAILER'

  return (
    <div className="trailer-embed">
      {!showPlayer ? (
        <button
          type="button"
          className="trailer-thumb"
          onClick={() => setShowPlayer(true)}
          aria-label={`Play trailer for ${title}`}
        >
          <img
            src={thumbnailUrl || fallbackThumb}
            alt={`${title} trailer thumbnail`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = fallbackThumb
            }}
          />
          <span className="trailer-play">▶</span>
          <div className="trailer-gradient" />
        </button>
      ) : (
        <div className="trailer-player">
          <iframe
            src={embedUrl}
            title={`${title} trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}

export default TrailerEmbed

