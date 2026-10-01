import { useEffect, useMemo, useState } from 'react'
import { LoginPage, ProfileSetupPage, SponsorRegisterPage } from './AuthPages'
import './App.css'

const platformMeta = {
  Instagram: { icon: '◎', label: 'Instagram' },
  YouTube: { icon: '▶', label: 'YouTube' },
  TikTok: { icon: '♪', label: 'TikTok' },
  Blog: { icon: '✎', label: 'Blog' },
  Reels: { icon: '◉', label: 'Reels' },
  Podcast: { icon: '◌', label: 'Podcast' },
}

const influencers = [
  {
    id: 1,
    name: 'Aisha Kapoor',
    category: 'Fashion',
    city: 'Delhi',
    followers: 185000,
    engagement: 7.8,
    likes: 18800,
    views: 2400000,
    price: 3500,
    rating: 4.9,
    handle: '@aishakapoor',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    bio: 'Style-forward creator with premium fashion edits and reels.',
    platforms: ['Instagram', 'YouTube', 'TikTok'],
    socialLinks: [
      { name: 'Instagram', url: 'https://instagram.com/aishakapoor' },
      { name: 'YouTube', url: 'https://youtube.com/@aishakapoor' },
      { name: 'TikTok', url: 'https://www.tiktok.com/@aishakapoor' },
    ],
  },
  {
    id: 2,
    name: 'Rohan Menon',
    category: 'Travel',
    city: 'Bengaluru',
    followers: 260000,
    engagement: 6.4,
    likes: 24300,
    views: 3200000,
    price: 4200,
    rating: 4.8,
    handle: '@travelwithrohan',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    bio: 'Travel documentary creator blending city stories and adventure.',
    platforms: ['Instagram', 'Blog'],
    socialLinks: [
      { name: 'Instagram', url: 'https://instagram.com/travelwithrohan' },
      { name: 'Blog', url: 'https://travelwithrohan.com' },
    ],
  },
  {
    id: 3,
    name: 'Naina Shah',
    category: 'Beauty',
    city: 'Mumbai',
    followers: 132000,
    engagement: 8.9,
    likes: 17100,
    views: 1800000,
    price: 3000,
    rating: 4.9,
    handle: '@nainabeauty',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    bio: 'Skincare and glam tutorials with strong community trust.',
    platforms: ['Instagram', 'Reels'],
    socialLinks: [
      { name: 'Instagram', url: 'https://instagram.com/nainabeauty' },
      { name: 'Reels', url: 'https://instagram.com/nainabeauty/reels' },
    ],
  },
  {
    id: 4,
    name: 'Kabir Sethi',
    category: 'Fitness',
    city: 'Hyderabad',
    followers: 320000,
    engagement: 5.9,
    likes: 28700,
    views: 4100000,
    price: 5000,
    rating: 4.7,
    handle: '@kabirstrong',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    bio: 'Strength and wellness coach promoting performance-based lifestyle.',
    platforms: ['Instagram', 'YouTube'],
    socialLinks: [
      { name: 'Instagram', url: 'https://instagram.com/kabirstrong' },
      { name: 'YouTube', url: 'https://youtube.com/@kabirstrong' },
    ],
  },
  {
    id: 5,
    name: 'Meher Ali',
    category: 'Food',
    city: 'Lucknow',
    followers: 98000,
    engagement: 9.2,
    likes: 14600,
    views: 1200000,
    price: 2600,
    rating: 4.8,
    handle: '@meherbites',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
    bio: 'Food storytelling through creator-led restaurant reviews.',
    platforms: ['Instagram', 'TikTok'],
    socialLinks: [
      { name: 'Instagram', url: 'https://instagram.com/meherbites' },
      { name: 'TikTok', url: 'https://www.tiktok.com/@meherbites' },
    ],
  },
  {
    id: 6,
    name: 'Vihaan Roy',
    category: 'Lifestyle',
    city: 'Pune',
    followers: 214000,
    engagement: 7.1,
    likes: 21200,
    views: 2800000,
    price: 3900,
    rating: 4.9,
    handle: '@vihaanlives',
    image:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
    bio: 'Lifestyle and daily vlogs with polished storytelling.',
    platforms: ['Instagram', 'YouTube', 'Podcast'],
    socialLinks: [
      { name: 'Instagram', url: 'https://instagram.com/vihaanlives' },
      { name: 'YouTube', url: 'https://youtube.com/@vihaanlives' },
      { name: 'Podcast', url: 'https://open.spotify.com/user/vihaanlives' },
    ],
  },
]

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
  const [route, setRoute] = useState(window.location.hash)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('engagement')
  const [selectedId, setSelectedId] = useState(influencers[0].id)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  const categories = ['All', ...new Set(influencers.map((item) => item.category))]

  const filteredInfluencers = useMemo(() => {
    const list =
      selectedCategory === 'All'
        ? influencers
        : influencers.filter((influencer) => influencer.category === selectedCategory)

    return [...list].sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views
      if (sortBy === 'likes') return b.likes - a.likes
      if (sortBy === 'followers') return b.followers - a.followers
      return b.engagement - a.engagement
    })
  }, [selectedCategory, sortBy])

  const topInfluencers = useMemo(
    () => [...influencers].sort((a, b) => b.engagement - a.engagement).slice(0, 3),
    [],
  )

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % topInfluencers.length)
    }, 3200)

    return () => window.clearInterval(timer)
  }, [topInfluencers.length])

  useEffect(() => {
    const syncRoute = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  const currentInfluencer = topInfluencers[activeSlide] ?? topInfluencers[0]

  const selectedInfluencer =
    filteredInfluencers.find((influencer) => influencer.id === selectedId) ??
    filteredInfluencers[0] ??
    null

  const openProfile = (id) => {
    setSelectedId(id)
    setIsModalOpen(true)
  }

  const closeProfile = () => setIsModalOpen(false)

  if (route.startsWith('#login')) {
    return <LoginPage key={route} initialRole={route.includes('sponsor') ? 'Sponsor' : 'Influencer'} />
  }

  if (route === '#register/sponsor') return <SponsorRegisterPage />

  if (route === '#profile') return <ProfileSetupPage />

  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand-mark" href="#top" aria-label="Infls home">
          I
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#discover">Discover</a>
          <a href="#pricing">Pricing</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <div className="nav-actions">
          <a className="secondary-btn small-btn" href="#login/influencer">
            Sign in
          </a>
          <a className="primary-btn small-btn" href="#profile">
            Create profile
          </a>
        </div>
      </header>

      <main id="top">
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
                      src={currentInfluencer.image}
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
                  <img src={influencer.image} alt="" className="avatar" />
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

          <div className="creator-grid">
            {filteredInfluencers.map((influencer) => (
              <button
                key={influencer.id}
                type="button"
                className={selectedId === influencer.id ? 'discover-card active' : 'discover-card'}
                onClick={() => openProfile(influencer.id)}
              >
                <img src={influencer.image} alt={influencer.name} className="discover-card-image" />

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
            ))}
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
              <a href="#profile" className="secondary-btn large-btn">
                List my profile
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
                <strong>₹100</strong>
                <span>Starter fee</span>
              </div>
            </div>
          </div>

        </section>

        {isModalOpen && selectedInfluencer && (
          <div className="modal-overlay" onClick={closeProfile}>
            <div className="detail-modal" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="close-modal" onClick={closeProfile} aria-label="Close profile">
                ×
              </button>

              <div className="detail-content">
                <div className="detail-visual">
                  <img
                    src={selectedInfluencer.image}
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

                  <div className="platform-row modal-platforms">
                    {selectedInfluencer.platforms.map((platform) => (
                      <span key={platform} className="platform-pill">
                        {platform}
                      </span>
                    ))}
                  </div>

                  <div className="social-links">
                    {selectedInfluencer.socialLinks.map((link) => (
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
              Start with a ₹100 creator subscription to set up your profile, connect your
              social accounts, and appear in brand searches.
            </p>
          </div>

          <div className="pricing-card">
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
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <span className="brand-mark small">I</span>
          <span>Infls</span>
        </div>
        <p>Built for creators and sponsors who want faster collaborations.</p>
      </footer>
    </div>
  )
}

export default App
