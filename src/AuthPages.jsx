import { useEffect, useState } from 'react'
import {
  getMyProfile,
  loginAccount,
  logoutAccount,
  registerInfluencer,
  registerSponsor,
  updateMyProfile,
} from './services/creators'
import './AuthPages.css'

const Brand = () => (
  <a className="auth-brand" href="#top" aria-label="Infls home">
    <span className="auth-brand-mark">i</span>
    <span>infls<span className="brand-period">.</span></span>
  </a>
)

export function LoginPage({ initialRole = 'Influencer' }) {
  const [role, setRole] = useState(initialRole)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState('')

  const submitLogin = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setLoginError('')
    const formData = new FormData(event.currentTarget)

    try {
      await loginAccount(role.toLowerCase(), formData.get('email'), formData.get('password'))
      window.location.hash = '#top'
    } catch (error) {
      setLoginError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-topbar"><Brand /><a href="#top" className="back-link">← Back to home</a></div>
      <div className="auth-layout">
        <section className="auth-story">
          <span className="auth-kicker"><span className="status-dot" /> THE CREATOR–BRAND NETWORK</span>
          <h1>Good things happen<br />when <em>you connect.</em></h1>
          <p>One home for ambitious creators and the brands ready to work with them.</p>
          <div className="story-proof">
            <div className="proof-avatars"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80" alt="" /><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80" alt="" /><img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=96&q=80" alt="" /><span>+</span></div>
            <div><strong>Made for the next big thing</strong><small>Creators and sponsors, together.</small></div>
          </div>
          <div className="auth-decoration"><span>CREATIVE<br />PARTNERSHIPS</span><span className="decoration-star">✳</span><span>START HERE&nbsp; ↗</span></div>
        </section>

        <section className="login-card">
          <div className="login-heading"><span className="form-step">WELCOME BACK</span><h2>Sign in to Infls</h2><p>Your next great collaboration is waiting.</p></div>
          <div className="role-switch" aria-label="Choose account type">
            {['Influencer', 'Sponsor'].map((option) => <button key={option} type="button" className={role === option ? 'selected' : ''} onClick={() => { setRole(option); setLoginError('') }}><span>{option === 'Influencer' ? '✦' : '▧'}</span>{option}</button>)}
          </div>
          <form className="login-form" onSubmit={submitLogin}>
            <label>Email address<input name="email" type="email" placeholder={role === 'Influencer' ? 'you@example.com' : 'name@company.com'} required /></label>
            <label>Password<span className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" required minLength="8" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></span></label>
            <div className="form-options"><label className="remember-option"><input type="checkbox" /> Remember me</label><a href="#forgot-password">Forgot password?</a></div>
            {loginError && <p className="registration-error" role="alert">{loginError}</p>}
            <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'} <span>↗</span></button>
          </form>
          <div className="login-divider"><span />or<span /></div>
          <button type="button" className="google-button"><b>G</b> Continue with Google</button>
          <p className="signup-prompt">New to Infls? <a href={role === 'Sponsor' ? '#register/sponsor' : '#profile'}>{role === 'Sponsor' ? 'Create a sponsor account' : 'Create your creator profile'} <span>↗</span></a></p>
          <small className="terms-note">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</small>
        </section>
      </div>
      <footer className="auth-footer"><span>© 2026 Infls</span><span>Made for meaningful partnerships&nbsp; ✳</span></footer>
    </main>
  )
}

export function SponsorRegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [registeredWithApi, setRegisteredWithApi] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const submitRegistration = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    const payload = Object.fromEntries(new FormData(event.currentTarget))
    try {
      const result = await registerSponsor(payload)
      if (result.configured) {
        window.location.hash = '#login/sponsor'
        return
      }
      setRegisteredWithApi(result.configured)
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="profile-page">
      <header className="profile-topbar"><Brand /><div className="profile-topbar-right"><span>Already registered?</span><a href="#login/sponsor">Sponsor sign in</a></div></header>
      <div className="profile-layout sponsor-register-layout">
        <aside className="profile-sidebar"><span className="auth-kicker"><span className="status-dot" /> SPONSOR ONBOARDING</span><h1>Find your<br /><em>next standout.</em></h1><p>Meet creators who know how to move people. Set up your brand account and start building better partnerships.</p><div className="profile-sidebar-art"><div className="art-sun" /><div className="art-card"><span>GOOD IDEAS<br />TRAVEL FAR</span><strong>BRAND × CREATOR</strong></div><span className="art-caption">YOUR NEXT COLLAB STARTS HERE</span></div><div className="sidebar-note"><span>✳</span><p><strong>Made for real collaboration.</strong><br />Find the right voices for your next campaign.</p></div></aside>
        <section className="profile-form-panel sponsor-register-panel">
          <div className="profile-form-head"><div><span className="form-step">SPONSOR ACCOUNT</span><h2>{submitted ? 'You’re on your way.' : 'Create your brand account.'}</h2><p>{submitted ? 'Your registration details are ready.' : 'A few details to get your team started.'}</p></div></div>
          {submitted ? <div className="profile-success"><span className="success-icon">✓</span><h3>Thanks for joining Infls.</h3><p>{registeredWithApi ? 'Your sponsor account has been registered.' : 'Your registration preview is ready. Set VITE_API_BASE_URL to save it to the backend.'}</p><a className="auth-submit" href="#login/sponsor">Go to sponsor sign in <span>↗</span></a></div> : <form className="creator-form" onSubmit={submitRegistration}>
            <label>Company or brand name<input name="companyName" placeholder="e.g. Northstar Studio" required /></label>
            <label>Work email<input name="email" type="email" placeholder="you@yourcompany.com" required /></label>
            <label>Create password<input name="password" type="password" placeholder="At least 8 characters" minLength="8" required /></label>
            <div className="form-two-col"><label>Industry<select name="industry" defaultValue="" required><option value="" disabled>Select industry</option><option>Fashion & beauty</option><option>Food & beverage</option><option>Travel & hospitality</option><option>Technology</option><option>Health & wellness</option><option>Retail & lifestyle</option><option>Other</option></select></label><label>Company size<select name="companySize" defaultValue="" required><option value="" disabled>Select size</option><option>Just me</option><option>2–10</option><option>11–50</option><option>51–200</option><option>201+</option></select></label></div>
            <label>Company website <span className="optional-label">Optional</span><input name="website" type="url" placeholder="https://yourcompany.com" /></label>
            {submitError && <p className="registration-error" role="alert">{submitError}</p>}
            <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create sponsor account'} <span>↗</span></button>
            <p className="profile-footnote"><span>♧</span> By creating an account, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
          </form>}
        </section>
      </div>
      <footer className="auth-footer"><span>© 2026 Infls</span><span>Made for meaningful partnerships&nbsp; ✳</span></footer>
    </main>
  )
}

export function ProfileSetupPage() {
  const [step, setStep] = useState(1)
  const [saved, setSaved] = useState(false)
  const [registeredWithApi, setRegisteredWithApi] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({ name: '', handle: '', email: '', password: '', city: '', niche: 'Fashion & style', bio: '', instagram: '', youtube: '', image: '', followers: '', likes: '', views: '', engagement: '', rate: '' })
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const submitProfile = async (event) => {
    event.preventDefault()
    if (step === 1) {
      setStep(2)
      return
    }

    setIsSubmitting(true)
    setSubmitError('')
    try {
      const result = await registerInfluencer(form)
      if (result.configured) {
        window.location.hash = '#login/influencer'
        return
      }
      setRegisteredWithApi(result.configured)
      setSaved(true)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="profile-page">
      <header className="profile-topbar"><Brand /><div className="profile-topbar-right"><span>Already have an account?</span><a href="#login/influencer">Sign in</a></div></header>
      <div className="profile-layout">
        <aside className="profile-sidebar"><span className="auth-kicker"><span className="status-dot" /> CREATOR ONBOARDING</span><h1>Your story.<br /><em>Your next chapter.</em></h1><p>Build a profile that helps the right brands find you and picture what you can create together.</p><div className="profile-sidebar-art"><div className="art-sun" /><div className="art-card"><span>CREATOR<br />PROFILE</span><strong>INFLS&nbsp; ✳</strong></div><span className="art-caption">MAKE YOUR<br />INTRODUCTION</span></div><div className="sidebar-note"><span>✳</span><p><strong>Show up as you.</strong><br />Your voice is what makes your profile memorable.</p></div></aside>
        <section className="profile-form-panel">
          <div className="profile-form-head"><div><span className="form-step">STEP {step} OF 2</span><h2>{saved ? 'Your profile is taking shape.' : step === 1 ? 'Let’s get to know you.' : 'Show brands what you do.'}</h2><p>{saved ? 'Your details are saved in this preview.' : step === 1 ? 'Start with the details brands will see first.' : 'Add your platforms and collaboration details.'}</p></div><div className="profile-progress"><span style={{ width: step === 1 ? '50%' : '100%' }} /></div></div>
          {saved ? <div className="profile-success"><span className="success-icon">✓</span><h3>Looking good, {form.name || 'creator'}!</h3><p>{registeredWithApi ? 'Your creator account and profile are registered.' : 'Your profile preview is ready. Set VITE_API_BASE_URL to save it to the backend.'}</p><div className="profile-preview"><span className="preview-avatar">{form.name ? form.name.slice(0, 1).toUpperCase() : '✦'}</span><div><strong>{form.name || 'Your name'} {form.handle && <small>{form.handle}</small>}</strong><span>{form.niche} · {form.city || 'Your city'}</span></div><b>{registeredWithApi ? 'SAVED' : 'DRAFT'}</b></div><button className="auth-submit" type="button" onClick={() => setSaved(false)}>Edit your details <span>↗</span></button></div> : <form className="creator-form" onSubmit={submitProfile}>
            {step === 1 ? <>
              <div className="form-two-col"><label>Your name<input value={form.name} onChange={update('name')} placeholder="e.g. Aisha Kapoor" required /></label><label>Creator handle<input value={form.handle} onChange={update('handle')} placeholder="@yourhandle" /></label></div>
              <label>Email address<input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required /></label>
              <label>Create password<input type="password" value={form.password} onChange={update('password')} placeholder="At least 8 characters" minLength="8" required /></label>
              <div className="form-two-col"><label>City<input value={form.city} onChange={update('city')} placeholder="Where are you based?" /></label><label>Your niche<select value={form.niche} onChange={update('niche')}><option>Fashion & style</option><option>Beauty & skincare</option><option>Food & drink</option><option>Travel</option><option>Fitness & wellness</option><option>Technology</option><option>Art & lifestyle</option><option>Other</option></select></label></div>
              <label>Your bio <span className="optional-label">A little about your work</span><textarea value={form.bio} onChange={update('bio')} placeholder="Tell brands what you create and who you create it for…" rows="4" maxLength="240" /></label>
              <button className="auth-submit" type="submit">Continue <span>→</span></button>
            </> : <>
              <div className="social-connect-heading"><span>✳</span><div><strong>Connect your socials</strong><small>Add your public profile links so brands can get to know your work.</small></div></div>
              <label>Instagram profile<div className="input-prefix"><span>instagram.com/</span><input value={form.instagram} onChange={update('instagram')} placeholder="yourhandle" /></div></label>
              <label>YouTube channel <span className="optional-label">Optional</span><div className="input-prefix"><span>youtube.com/@</span><input value={form.youtube} onChange={update('youtube')} placeholder="yourchannel" /></div></label>
              <label>Profile image URL <span className="optional-label">Optional</span><input type="url" value={form.image} onChange={update('image')} placeholder="https://example.com/your-photo.jpg" /></label>
              <div className="social-connect-heading"><span>↗</span><div><strong>Your audience metrics</strong><small>Add your latest public stats. Your rating is earned on Infls after reviews.</small></div></div>
              <div className="form-two-col"><label>Followers<input type="number" min="0" step="1" value={form.followers} onChange={update('followers')} placeholder="e.g. 12500" required /></label><label>Likes<input type="number" min="0" step="1" value={form.likes} onChange={update('likes')} placeholder="e.g. 2400" required /></label></div>
              <div className="form-two-col"><label>Views<input type="number" min="0" step="1" value={form.views} onChange={update('views')} placeholder="e.g. 48000" required /></label><label>Engagement rate (%)<input type="number" min="0" max="100" step="0.1" value={form.engagement} onChange={update('engagement')} placeholder="e.g. 6.5" required /></label></div>
              <label>Starting rate <span className="optional-label">INR · optional</span><div className="input-prefix"><span>₹</span><input type="number" min="0" value={form.rate} onChange={update('rate')} placeholder="Your starting price" /></div></label>
              {submitError && <p className="registration-error" role="alert">{submitError}</p>}
              <div className="profile-form-actions"><button type="button" className="back-step" onClick={() => setStep(1)}>← Back</button><button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating profile…' : 'Create profile'} <span>↗</span></button></div>
            </>}
            <p className="profile-footnote"><span>♧</span> Your details stay in your control. You can update your profile anytime.</p>
          </form>}
        </section>
      </div>
      <footer className="auth-footer"><span>© 2026 Infls</span><span>Made for meaningful partnerships&nbsp; ✳</span></footer>
    </main>
  )
}

export function CreatorDashboard() {
  const [account, setAccount] = useState(null)
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getMyProfile()
      .then(({ account: currentAccount, profile: currentProfile }) => {
        if (!isMounted) return
        setAccount(currentAccount)
        setProfile(currentProfile)
        if (currentAccount.role === 'influencer') {
          const instagram = currentProfile.socialLinks.find((link) => link.name === 'Instagram')
          const youtube = currentProfile.socialLinks.find((link) => link.name === 'YouTube')
          setForm({
            name: currentProfile.name,
            handle: currentProfile.handle,
            category: currentProfile.category,
            city: currentProfile.city,
            bio: currentProfile.bio,
            image: currentProfile.image,
            followers: String(currentProfile.followers),
            likes: String(currentProfile.likes),
            views: String(currentProfile.views),
            engagement: String(currentProfile.engagement),
            price: String(currentProfile.price),
            instagram: instagram?.url ?? '',
            youtube: youtube?.url ?? '',
          })
        }
      })
      .catch((loadError) => {
        if (isMounted) setError(loadError.message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
    setMessage('')
  }

  const signOut = () => {
    logoutAccount()
    window.location.hash = account?.role === 'sponsor' ? '#login/sponsor' : '#login/influencer'
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')
    setError('')

    const socialLinks = profile.socialLinks.filter(
      (link) => link.name !== 'Instagram' && link.name !== 'YouTube',
    )
    const platforms = profile.platforms.filter(
      (platform) => platform !== 'Instagram' && platform !== 'YouTube',
    )
    if (form.instagram.trim()) {
      socialLinks.push({ name: 'Instagram', url: form.instagram.trim() })
      platforms.push('Instagram')
    }
    if (form.youtube.trim()) {
      socialLinks.push({ name: 'YouTube', url: form.youtube.trim() })
      platforms.push('YouTube')
    }

    try {
      const updatedProfile = await updateMyProfile({
        ...form,
        followers: Number(form.followers),
        likes: Number(form.likes),
        views: Number(form.views),
        engagement: Number(form.engagement),
        price: Number(form.price || 0),
        platforms: [...new Set(platforms)],
        socialLinks,
      })
      setProfile(updatedProfile)
      setMessage('Profile saved.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  const profileChecklist = form
    ? [
        { label: 'Profile photo', complete: Boolean(form.image.trim()) },
        { label: 'Creator bio', complete: Boolean(form.bio.trim()) },
        { label: 'Social account', complete: Boolean(form.instagram.trim() || form.youtube.trim()) },
        {
          label: 'Audience metrics',
          complete: Boolean(form.followers && form.views && form.engagement),
        },
        { label: 'Starting rate', complete: Number(form.price) > 0 },
        { label: 'Niche and location', complete: Boolean(form.category.trim() && form.city.trim()) },
      ]
    : []
  const profileCompleteness = profileChecklist.length
    ? Math.round((profileChecklist.filter((item) => item.complete).length / profileChecklist.length) * 100)
    : 0

  return (
    <main className="profile-page">
      <header className="profile-topbar">
        <Brand />
        <div className="profile-topbar-right">
          {account?.email && <span>{account.email}</span>}
          <button type="button" className="back-step" onClick={signOut}>Sign out</button>
        </div>
      </header>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <span className="auth-kicker"><span className="status-dot" /> YOUR ACCOUNT</span>
          <h1>{account?.role === 'sponsor' ? <>Your brand.<br /><em>Your partnerships.</em></> : <>Your profile.<br /><em>Your next chapter.</em></>}</h1>
          <p>{account?.role === 'sponsor' ? 'Your sponsor account details.' : 'Keep your creator profile and audience details current for brands.'}</p>
          {form && (
            <section className="creator-live-preview" aria-label="Live creator profile preview">
              <div className="creator-preview-label">SPONSOR PREVIEW</div>
              <div className="creator-preview-person">
                {form.image.trim() ? (
                  <img src={form.image} alt="" />
                ) : (
                  <span className="creator-preview-initial">{form.name.trim().charAt(0).toUpperCase() || '✦'}</span>
                )}
                <div>
                  <strong>{form.name || 'Your name'}</strong>
                  <small>{form.handle || '@yourhandle'}</small>
                </div>
              </div>
              <div className="creator-preview-niche">{form.category || 'Your niche'} · {form.city || 'Your city'}</div>
              <p className="creator-preview-bio">{form.bio || 'Your bio will appear here. Tell brands what you create and who you reach.'}</p>
              <div className="creator-preview-stats">
                <div><strong>{Number(form.followers || 0).toLocaleString('en-IN')}</strong><small>Followers</small></div>
                <div><strong>{form.engagement || '0'}%</strong><small>Engagement</small></div>
                <div><strong>{Number(form.price || 0) > 0 ? `₹${Number(form.price).toLocaleString('en-IN')}` : 'Add rate'}</strong><small>Starting rate</small></div>
              </div>
              {(form.instagram || form.youtube) && (
                <div className="creator-preview-links">
                  {form.instagram && <a href={form.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>}
                  {form.youtube && <a href={form.youtube} target="_blank" rel="noreferrer">YouTube ↗</a>}
                </div>
              )}
              <div className="creator-completeness">
                <div className="creator-completeness-heading"><strong>Profile strength</strong><span>{profileCompleteness}%</span></div>
                <div className="creator-completeness-track" role="progressbar" aria-label="Profile completeness" aria-valuenow={profileCompleteness} aria-valuemin="0" aria-valuemax="100">
                  <span style={{ width: `${profileCompleteness}%` }} />
                </div>
                <ul>
                  {profileChecklist.filter((item) => !item.complete).map((item) => (
                    <li key={item.label}>{item.label}</li>
                  ))}
                  {profileCompleteness === 100 && <li className="creator-checklist-complete">Ready for brand discovery</li>}
                </ul>
              </div>
            </section>
          )}
        </aside>

        <section className="profile-form-panel">
          {isLoading ? (
            <p className="profile-form-head">Loading your account…</p>
          ) : error && !profile ? (
            <div className="profile-success"><h2>Could not load your account</h2><p>{error}</p><a className="auth-submit" href="#login/influencer">Sign in again</a></div>
          ) : account?.role === 'sponsor' ? (
            <div className="profile-success">
              <div className="profile-form-head"><div><span className="form-step">SPONSOR ACCOUNT</span><h2>{profile.companyName}</h2><p>{profile.industry} · {profile.companySize}</p></div></div>
              {profile.website && <a className="social-link" href={profile.website} target="_blank" rel="noreferrer">Visit company website</a>}
            </div>
          ) : form ? (
            <>
              <a className="dashboard-back-link" href="#top">← Back to marketplace</a>
              <div className="profile-form-head"><div><span className="form-step">INFLUENCER PROFILE</span><h2>Edit your profile</h2><p>Changes are saved to your account and creator listing.</p></div></div>
              <form className="creator-form" onSubmit={saveProfile}>
                <div className="form-two-col"><label>Your name<input value={form.name} onChange={update('name')} required /></label><label>Creator handle<input value={form.handle} onChange={update('handle')} /></label></div>
                <div className="form-two-col"><label>City<input value={form.city} onChange={update('city')} required /></label><label>Your niche<input value={form.category} onChange={update('category')} required /></label></div>
                <label>Bio<textarea value={form.bio} onChange={update('bio')} rows="4" maxLength="240" /></label>
                <label>Profile image URL<input type="url" value={form.image} onChange={update('image')} /></label>
                <label>Instagram profile URL<input type="url" value={form.instagram} onChange={update('instagram')} placeholder="https://instagram.com/yourhandle" /></label>
                <label>YouTube channel URL<input type="url" value={form.youtube} onChange={update('youtube')} placeholder="https://youtube.com/@yourchannel" /></label>
                <div className="form-two-col"><label>Followers<input type="number" min="0" step="1" value={form.followers} onChange={update('followers')} required /></label><label>Likes<input type="number" min="0" step="1" value={form.likes} onChange={update('likes')} required /></label></div>
                <div className="form-two-col"><label>Views<input type="number" min="0" step="1" value={form.views} onChange={update('views')} required /></label><label>Engagement rate (%)<input type="number" min="0" max="100" step="0.1" value={form.engagement} onChange={update('engagement')} required /></label></div>
                <label>Starting rate (INR)<input type="number" min="0" value={form.price} onChange={update('price')} /></label>
                {message && <p className="form-feedback" role="status">{message}</p>}
                {error && <p className="registration-error" role="alert">{error}</p>}
                <div className="profile-form-actions">
                  <button className="back-step" type="button" onClick={() => { window.location.hash = '#top' }}>← Back to home</button>
                  <button className="auth-submit" type="submit" disabled={isSaving}>{isSaving ? 'Saving…' : 'Save profile'} <span>↗</span></button>
                </div>
              </form>
            </>
          ) : null}
        </section>
      </div>
      <footer className="auth-footer"><span>© 2026 Infls</span><span>Made for meaningful partnerships&nbsp; ✳</span></footer>
    </main>
  )
}
