import { useEffect, useMemo, useState } from 'react'
import { CreatorDashboard, LoginPage, ProfileSetupPage, SponsorRegisterPage } from './AuthPages'
import { fallbackInfluencers } from './data/influencers'
import { getInfluencers, hasAuthToken, hasCreatorApi, logoutAccount } from './services/creators'
import './App.css'

const platformMeta = {
  Instagram: { icon: '◎', label: 'Instagram' },
  YouTube: { icon: '▶', label: 'YouTube' },
  TikTok: { icon: '♪', label: 'TikTok' },
  Blog: { icon: '✎', label: 'Blog' },
  Reels: { icon: '◉', label: 'Reels' },
  Podcast: { icon: '◌', label: 'Podcast' },
}

const defaultCreatorImage = fallbackInfluencers[0].image
const isPublicRoute = (route) =>
  route.startsWith('#login') || route === '#profile' || route === '#register/sponsor'

const formatCompact = (value) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

function App() {
  const [route, setRoute] = useState(() => {
    const requestedRoute = window.location.hash
    if (isPublicRoute(requestedRoute)) return requestedRoute
    return hasAuthToken() ? requestedRoute || '#top' : '#login/influencer'
  })
  const [influencers, setInfluencers] = useState(hasCreatorApi ? [] : fallbackInfluencers)
  const [isLoadingCreators, setIsLoadingCreators] = useState(hasCreatorApi)
  const [creatorApiError, setCreatorApiError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('engagement')
  const [searchQuery, setSearchQuery] = useState('')
  const [maxRate, setMaxRate] = useState('')
  const [shortlistedIds, setShortlistedIds] = useState(() => {
    try {
      const savedIds = JSON.parse(window.localStorage.getItem('infls-shortlist') || '[]')
      return Array.isArray(savedIds) ? savedIds : []
    } catch {
      return []
    }
  })
  const [selectedId, setSelectedId] = useState(fallbackInfluencers[0].id)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  const categories = ['All', ...new Set(influencers.map((item) => item.category))]

  const filteredInfluencers = useMemo(() => {
    const list =
      selectedCategory === 'All'
        ? influencers
        : influencers.filter((influencer) => influencer.category === selectedCategory)

    const normalizedQuery = searchQuery.trim().toLowerCase()
    const filteredList = list.filter((influencer) => {
      const matchesQuery =
        !normalizedQuery ||
        [influencer.name, influencer.handle, influencer.category, influencer.city, influencer.bio]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery))
      const matchesRate = maxRate === '' || influencer.price <= Number(maxRate)
      return matchesQuery && matchesRate
    })

    return [...filteredList].sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views
      if (sortBy === 'likes') return b.likes - a.likes
      if (sortBy === 'followers') return b.followers - a.followers
      return b.engagement - a.engagement
    })
  }, [influencers, selectedCategory, sortBy, searchQuery, maxRate])

  const shortlistedInfluencers = useMemo(
    () => shortlistedIds.map((id) => influencers.find((item) => item.id === id)).filter(Boolean),
    [influencers, shortlistedIds],
  )

  const topInfluencers = useMemo(
    () => [...influencers].sort((a, b) => b.engagement - a.engagement).slice(0, 3),
    [influencers],
  )

  useEffect(() => {
    try {
      window.localStorage.setItem('infls-shortlist', JSON.stringify(shortlistedIds))
    } catch {
      // Keep shortlist changes available for this session if storage is disabled.
    }
  }, [shortlistedIds])

  useEffect(() => {
    if (!hasCreatorApi) return undefined

    const controller = new AbortController()
    const loadCreators = () => {
      getInfluencers({ signal: controller.signal })
        .then((creators) => {
          setInfluencers(creators)
          setCreatorApiError('')
          setSelectedId((currentId) =>
            creators.some((creator) => creator.id === currentId)
              ? currentId
              : creators[0]?.id ?? null,
          )
        })
        .catch((error) => {
          if (error.name === 'AbortError') return
          if (error.status === 401) {
            logoutAccount()
            window.location.hash = '#login/influencer'
            return
          }
          setInfluencers(fallbackInfluencers)
          setCreatorApiError('Could not load live creators. Showing sample profiles instead.')
        })
        .finally(() => setIsLoadingCreators(false))
    }

    if (hasAuthToken()) loadCreators()
    window.addEventListener('creators-updated', loadCreators)
    window.addEventListener('auth-updated', loadCreators)

    return () => {
      window.removeEventListener('creators-updated', loadCreators)
      window.removeEventListener('auth-updated', loadCreators)
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const syncRoute = () => {
      const nextRoute = window.location.hash
      if (!isPublicRoute(nextRoute) && !hasAuthToken()) {
        window.location.hash = '#login/influencer'
        setRoute('#login/influencer')
        return
      }
      setRoute(nextRoute || '#top')
    }

    if (!window.location.hash) {
      window.location.hash = hasAuthToken() ? '#top' : '#login/influencer'
    }
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  useEffect(() => {
    if (topInfluencers.length < 2) return undefined

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % topInfluencers.length)
    }, 3200)

    return () => window.clearInterval(timer)
  }, [topInfluencers.length])

  const currentInfluencer = topInfluencers[activeSlide] ?? topInfluencers[0]

  const selectedInfluencer =
    filteredInfluencers.find((influencer) => influencer.id === selectedId) ??
    filteredInfluencers[0] ??
    null

  const instagramLink = selectedInfluencer?.socialLinks?.find((link) =>
    link.name.toLowerCase().includes('instagram'),
  )

  const openProfile = (id) => {
    setSelectedId(id)
    setIsModalOpen(true)
  }

  const toggleShortlist = (id) => {
    setShortlistedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    )
  }

  const closeProfile = () => setIsModalOpen(false)

  if (route.startsWith('#login')) {
    return <LoginPage key={route} initialRole={route.includes('sponsor') ? 'Sponsor' : 'Influencer'} />
  }

  if (route === '#register/sponsor') return <SponsorRegisterPage />

  if (route === '#profile') return <ProfileSetupPage />

  if (route === '#dashboard') return <CreatorDashboard />

  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand-mark" href="#top" aria-label="Infls home">
          I
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#discover">Discover</a>
          {/* <a href="#pricing">Pricing</a> */}
        </nav>
        <div className="nav-actions">
          <a className="secondary-btn small-btn" href="#dashboard">My profile</a>
          <button
            type="button"
            className="primary-btn small-btn"
            onClick={() => {
              logoutAccount()
              window.location.hash = '#login/influencer'
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main id="top">
        {isLoadingCreators && <p className="creator-data-notice" role="status">Loading live creator profiles...</p>}
        {creatorApiError && <p className="creator-data-notice" role="alert">{creatorApiError}</p>}

        <section className="hero-section hero-section--top">
          <div className="hero-panel top-influencers-panel top-influencers-panel--featured">
            <div className="panel-top">
              <div>
                <span className="eyebrow alt">Top influencers</span>
                <h2>Creators brands trust most</h2>
              </div>
              <div className="panel-actions">
                <button
                  type="button"
                  className="carousel-btn"
                  aria-label="Previous creator"
                  onClick={() =>
                    setActiveSlide(
                      (current) => (current - 1 + topInfluencers.length) % topInfluencers.length,
                    )
                  }
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="carousel-btn"
                  aria-label="Next creator"
                  onClick={() => setActiveSlide((current) => (current + 1) % topInfluencers.length)}
                >
                  ›
                </button>
              </div>
            </div>

            {currentInfluencer && (
              <div className="carousel-stage">
                <div className="carousel-card carousel-card--featured">
                  <div className="carousel-image-wrap">
                    <img
                      src={currentInfluencer.image || defaultCreatorImage}
                      alt={currentInfluencer.name}
                      className="carousel-image"
                    />
                    <span className="carousel-badge">{currentInfluencer.category}</span>
                  </div>

                  <div className="carousel-content">
                    <div className="carousel-header">
                      <div>
                        <strong>{currentInfluencer.name}</strong>
                        <small>{currentInfluencer.city}</small>
                      </div>
                      <span className="carousel-engagement">{currentInfluencer.engagement}%</span>
                    </div>

                    <p>{currentInfluencer.bio}</p>

                    <div className="carousel-meta">
                      <span>{formatCompact(currentInfluencer.followers)} followers</span>
                      <span>{formatCompact(currentInfluencer.views)} views</span>
                    </div>

                    <button
                      type="button"
                      className="primary-btn wide-btn"
                      onClick={() => openProfile(currentInfluencer.id)}
                    >
                      View profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="carousel-dots" aria-label="Creator carousel navigation">
              {topInfluencers.map((influencer, index) => (
                <button
                  key={influencer.id}
                  type="button"
                  className={index === activeSlide ? 'dot-btn active' : 'dot-btn'}
                  aria-label={`Show ${influencer.name}`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>

            <div className="leaderboard-list">
              {topInfluencers.map((influencer, index) => (
                <button
                  key={influencer.id}
                  type="button"
                  className="leaderboard-item"
                  onClick={() => openProfile(influencer.id)}
                >
                  <span className="leaderboard-rank">0{index + 1}</span>
                  <img src={influencer.image || defaultCreatorImage} alt="" className="avatar" />
                  <span className="leaderboard-name">
                    <strong>{influencer.name}</strong>
                    <small>{influencer.category} · {influencer.city}</small>
                  </span>
                  <span className="leaderboard-rate">
                    <strong>{influencer.engagement}%</strong>
                    <small>engagement</small>
                  </span>
                </button>
              ))}
            </div>

            <a className="leaderboard-link" href="#discover">Explore all creators <span aria-hidden="true">→</span></a>
          </div>
        </section>

        <section id="discover" className="discover-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow alt">Discover creators</span>
              <h2>Find the right match for your brand</h2>
            </div>

            <div className="sort-wrap">
              <label htmlFor="sortBy">Sort by</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="engagement">Engagement</option>
                <option value="views">Views</option>
                <option value="likes">Likes</option>
                <option value="followers">Followers</option>
              </select>
            </div>
          </div>

          <div className="filter-row">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={selectedCategory === category ? 'filter-chip active' : 'filter-chip'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="sponsor-filters">
            <label className="sponsor-search" htmlFor="creatorSearch">
              <span aria-hidden="true">⌕</span>
              <input
                id="creatorSearch"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search creators, niches, or cities"
              />
            </label>
            <label className="budget-filter" htmlFor="maxRate">
              <span>Max rate</span>
              <span className="budget-input-wrap">
                <span aria-hidden="true">₹</span>
                <input
                  id="maxRate"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={maxRate}
                  onChange={(event) => setMaxRate(event.target.value)}
                  placeholder="Any"
                />
              </span>
            </label>
          </div>

          {shortlistedInfluencers.length > 0 && (
            <section className="shortlist-panel" aria-labelledby="shortlist-title">
              <div className="shortlist-heading">
                <div>
                  <span className="eyebrow alt">Your shortlist</span>
                  <h3 id="shortlist-title">Compare saved creators</h3>
                </div>
                <span className="shortlist-count">{shortlistedInfluencers.length} saved</span>
              </div>
              <div className="shortlist-list">
                {shortlistedInfluencers.map((influencer) => (
                  <div className="shortlist-item" key={influencer.id}>
                    <button
                      className="shortlist-profile"
                      type="button"
                      onClick={() => openProfile(influencer.id)}
                    >
                      <img src={influencer.image || defaultCreatorImage} alt="" />
                      <span>
                        <strong>{influencer.name}</strong>
                        <small>{influencer.category} · {influencer.city}</small>
                      </span>
                    </button>
                    <span className="shortlist-metric">
                      <small>Reach</small><strong>{formatCompact(influencer.followers)}</strong>
                    </span>
                    <span className="shortlist-metric">
                      <small>Engagement</small><strong>{influencer.engagement}%</strong>
                    </span>
                    <span className="shortlist-metric">
                      <small>Rate</small><strong>{formatCurrency(influencer.price)}</strong>
                    </span>
                    {influencer.contactEmail ? (
                      <a
                        className="shortlist-contact"
                        href={`mailto:${influencer.contactEmail}?subject=${encodeURIComponent(`Collaboration inquiry for ${influencer.name}`)}`}
                        aria-label={`Email ${influencer.name}`}
                        title={`Email ${influencer.name}`}
                      >
                        ↗
                      </a>
                    ) : (
                      <span className="shortlist-contact unavailable" aria-label="Email unavailable">—</span>
                    )}
                    <button
                      className="shortlist-remove"
                      type="button"
                      onClick={() => toggleShortlist(influencer.id)}
                      aria-label={`Remove ${influencer.name} from shortlist`}
                      title="Remove from shortlist"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="creator-grid">
            {filteredInfluencers.map((influencer) => (
              <div className="discover-card-wrap" key={influencer.id}>
                <button
                  type="button"
                  className={selectedId === influencer.id ? 'discover-card active' : 'discover-card'}
                  onClick={() => openProfile(influencer.id)}
                >
                  <img src={influencer.image || defaultCreatorImage} alt={influencer.name} className="discover-card-image" />

                  <div className="discover-card-body">
                    <div className="discover-card-top">
                      <div className="discover-card-meta">
                        <strong>{influencer.name}</strong>
                        <span>
                          {influencer.category} • {influencer.city}
                        </span>
                      </div>
                      <span className="discover-rating">★ {influencer.rating}</span>
                    </div>

                    <p>{influencer.bio}</p>

                    <div className="discover-metrics">
                      <span>{formatCompact(influencer.followers)} followers</span>
                      <span>{formatCompact(influencer.views)} views</span>
                    </div>

                    <div className="discover-platforms" aria-label={influencer.platforms.join(', ')}>
                      {influencer.platforms.map((platform) => (
                        <span key={platform} className="platform-pill" title={platformMeta[platform].label}>
                          {platformMeta[platform].icon} {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  className={shortlistedIds.includes(influencer.id) ? 'shortlist-toggle saved' : 'shortlist-toggle'}
                  onClick={() => toggleShortlist(influencer.id)}
                  aria-label={`${shortlistedIds.includes(influencer.id) ? 'Remove from' : 'Add to'} shortlist: ${influencer.name}`}
                  aria-pressed={shortlistedIds.includes(influencer.id)}
                  title={shortlistedIds.includes(influencer.id) ? 'Remove from shortlist' : 'Add to shortlist'}
                >
                  {shortlistedIds.includes(influencer.id) ? '✓' : '+'}
                </button>
              </div>
            ))}
            {!isLoadingCreators && filteredInfluencers.length === 0 && (
              <p className="empty-results">No creator profiles found.</p>
            )}
          </div>
        </section>

        <section className="hero-section hero-section--full">
          <div className="hero-copy">
            <h1>Connect brands with creators who actually convert.</h1>
            <p>
              Influencers build their profile for just ₹100 and get discovered by brands
              searching by category, views, likes, engagement, and audience reach.
            </p>

            <div className="cta-row">
              <a href="#discover" className="primary-btn large-btn">
                Browse influencers
              </a>
            </div>

            <div className="stats-grid">
              <div>
                <strong>4.8k+</strong>
                <span>Profiles</span>
              </div>
              <div>
                <strong>1.2k+</strong>
                <span>Brands</span>
              </div>
              <div>
                <strong>Free</strong>
                <span>Starter fee</span>
              </div>
            </div>
          </div>

        </section>

        {isModalOpen && selectedInfluencer && (
          <div className="modal-overlay" onClick={closeProfile}>
            <div className="detail-modal" onClick={(event) => event.stopPropagation()}>
              <div className="detail-modal-toolbar">
                <button type="button" className="close-modal" onClick={closeProfile} aria-label="Close profile">
                  ×
                </button>
              </div>

              <div className="detail-content">
                <div className="detail-visual">
                  <img
                    src={selectedInfluencer.image || defaultCreatorImage}
                    alt={selectedInfluencer.name}
                    className="detail-image"
                  />
                </div>

                <div className="detail-body">
                  <div className="detail-header">
                    <div className="detail-meta">
                      <span className="detail-category">{selectedInfluencer.category}</span>
                      <h3>{selectedInfluencer.name}</h3>
                      <p>
                        {selectedInfluencer.city} • {selectedInfluencer.handle}
                      </p>
                    </div>
                    <span className="detail-score">★ {selectedInfluencer.rating}</span>
                  </div>

                  <div className="detail-summary-row">
                    <div>
                      <span>Engagement</span>
                      <strong>{selectedInfluencer.engagement}%</strong>
                    </div>
                    <div>
                      <span>Followers</span>
                      <strong>{formatCompact(selectedInfluencer.followers)}</strong>
                    </div>
                    <div>
                      <span>Rate</span>
                      <strong>{formatCurrency(selectedInfluencer.price)}</strong>
                    </div>
                  </div>

                  <p className="detail-bio">{selectedInfluencer.bio}</p>

                  <div className="mini-stats detail-stats">
                    <div>
                      <span>Followers</span>
                      <strong>{formatCompact(selectedInfluencer.followers)}</strong>
                    </div>
                    <div>
                      <span>Likes</span>
                      <strong>{formatCompact(selectedInfluencer.likes)}</strong>
                    </div>
                    <div>
                      <span>Views</span>
                      <strong>{formatCompact(selectedInfluencer.views)}</strong>
                    </div>
                  </div>

                  <div className="social-links">
                    {selectedInfluencer.socialLinks
                      .filter((link) => !link.name.toLowerCase().includes('instagram'))
                      .map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="social-link"
                      >
                        {link.name}
                      </a>
                      ))}
                  </div>

                  {(selectedInfluencer.contactEmail || instagramLink) && (
                    <div className="contact-block">
                      <span className="contact-actions-label">Contact by</span>
                      <div className="contact-actions">
                        {selectedInfluencer.contactEmail && (
                          <a
                            className="contact-action contact-action--email"
                            href={`mailto:${selectedInfluencer.contactEmail}?subject=${encodeURIComponent(`Collaboration inquiry for ${selectedInfluencer.name}`)}`}
                          >
                            Email
                          </a>
                        )}
                        {instagramLink && (
                          <a
                            className="contact-action contact-action--instagram"
                            href={instagramLink.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Instagram
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <section id="pricing" className="creator-cta">
          <div className="cta-copy">
            <span className="eyebrow alt">Creator subscription</span>
            <h2>Get discovered by brands.</h2>
            <p>
              Start with a Free creator subscription to set up your profile, connect your
              social accounts, and appear in brand searches.
            </p>
          </div>

          {/* <div className="pricing-card">
            <div className="pricing-head">
              <span>Creator subscription</span>
              <strong>₹100<span className="price-starting"> starting</span></strong>
            </div>
            <ul>
              <li>Create and customize your creator profile</li>
              <li>Connect Instagram and other social accounts</li>
              <li>Appear in category-based brand discovery</li>
              <li>Showcase audience and engagement metrics</li>
            </ul>
            <a href="#profile" className="primary-btn wide-btn">
              Create your profile
            </a>
          </div> */}
        </section>

        <section id="how-it-works" className="how-it-works-card">
          <span className="eyebrow alt">How it works</span>
          <h2>Good partnerships start with the right match.</h2>
          <p>
            Creators build a profile, brands discover and compare talent, then both sides
            connect to start a collaboration.
          </p>
        </section>
      </main>

      <footer className="footer">
        <div>
          <span className="brand-mark small">I</span>
          <span>Influs</span>
        </div>
        <p>Built for creators and sponsors who want faster collaborations.</p>
      </footer>
    </div>
  )
}

export default App
