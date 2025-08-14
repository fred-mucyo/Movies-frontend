import React, { useMemo } from 'react'
import TrailerEmbed from './TrailerEmbed'
import './FeaturedHero.css'

const FeaturedHero = ({ movies = [] }) => {
  const featured = useMemo(() => {
    if (!Array.isArray(movies) || movies.length === 0) return null
    const flagged = movies.find((m) => m.is_featured)
    if (flagged) return flagged
    const withTrailer = movies.filter((m) => m.youtube_trailer_url)
    return (withTrailer[0] || movies[0]) ?? null
  }, [movies])

  if (!featured) return null

  const createdYear = featured.created_at ? new Date(featured.created_at).getFullYear() : ''
  const bgImage = null

  return (
    <section className="featured-hero" style={{ backgroundColor: '#000', backgroundImage: bgImage ? `url(${bgImage})` : 'none' }}>
      <div className="featured-overlay" />
      <div className="featured-inner container">
        <div className="featured-text">
          <h1 className="featured-title">{featured.title}</h1>
          <p className="featured-subtitle">{createdYear} • Exclusive Trailer</p>
          <div className="featured-actions">
            {featured.video_url && (
              <a
                href={featured.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta"
              >
                WATCH FULL MOVIE
              </a>
            )}
            {featured.video_url && (
              <a
                href={featured.video_url}
                download
                className="btn-secondary-cta"
              >
                DOWNLOAD
              </a>
            )}
          </div>
        </div>
        {featured.youtube_trailer_url && (
          <div className="featured-trailer">
            <TrailerEmbed
              youtubeUrl={featured.youtube_trailer_url}
              thumbnailUrl={featured.thumbnail_url}
              title={featured.title}
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedHero

