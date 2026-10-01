import { useState } from 'react'
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
  const [submitted, setSubmitted] = useState(false)

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
            {['Influencer', 'Sponsor'].map((option) => <button key={option} type="button" className={role === option ? 'selected' : ''} onClick={() => { setRole(option); setSubmitted(false) }}><span>{option === 'Influencer' ? '✦' : '▧'}</span>{option}</button>)}
          </div>
          <form className="login-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
            <label>Email address<input type="email" placeholder={role === 'Influencer' ? 'you@example.com' : 'name@company.com'} required /></label>
            <label>Password<span className="password-field"><input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" required minLength="6" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></span></label>
            <div className="form-options"><label className="remember-option"><input type="checkbox" /> Remember me</label><a href="#forgot-password">Forgot password?</a></div>
            <button className="auth-submit" type="submit">Sign in <span>↗</span></button>
            {submitted && <p className="form-feedback">Sign-in UI is ready. Connect an authentication service to continue.</p>}
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

  return (
    <main className="profile-page">
      <header className="profile-topbar"><Brand /><div className="profile-topbar-right"><span>Already registered?</span><a href="#login/sponsor">Sponsor sign in</a></div></header>
      <div className="profile-layout sponsor-register-layout">
        <aside className="profile-sidebar"><span className="auth-kicker"><span className="status-dot" /> SPONSOR ONBOARDING</span><h1>Find your<br /><em>next standout.</em></h1><p>Meet creators who know how to move people. Set up your brand account and start building better partnerships.</p><div className="profile-sidebar-art"><div className="art-sun" /><div className="art-card"><span>GOOD IDEAS<br />TRAVEL FAR</span><strong>BRAND × CREATOR</strong></div><span className="art-caption">YOUR NEXT COLLAB STARTS HERE</span></div><div className="sidebar-note"><span>✳</span><p><strong>Made for real collaboration.</strong><br />Find the right voices for your next campaign.</p></div></aside>
        <section className="profile-form-panel sponsor-register-panel">
          <div className="profile-form-head"><div><span className="form-step">SPONSOR ACCOUNT</span><h2>{submitted ? 'You’re on your way.' : 'Create your brand account.'}</h2><p>{submitted ? 'Your registration details are ready for account setup.' : 'A few details to get your team started.'}</p></div></div>
          {submitted ? <div className="profile-success"><span className="success-icon">✓</span><h3>Thanks for joining Infls.</h3><p>Your sponsor account preview is ready. Connect an authentication service to complete registration.</p><a className="auth-submit" href="#login/sponsor">Go to sponsor sign in <span>↗</span></a></div> : <form className="creator-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
            <label>Company or brand name<input placeholder="e.g. Northstar Studio" required /></label>
            <label>Work email<input type="email" placeholder="you@yourcompany.com" required /></label>
            <label>Create password<input type="password" placeholder="At least 8 characters" minLength="8" required /></label>
            <div className="form-two-col"><label>Industry<select defaultValue=""><option value="" disabled>Select industry</option><option>Fashion & beauty</option><option>Food & beverage</option><option>Travel & hospitality</option><option>Technology</option><option>Health & wellness</option><option>Retail & lifestyle</option><option>Other</option></select></label><label>Company size<select defaultValue=""><option value="" disabled>Select size</option><option>Just me</option><option>2–10</option><option>11–50</option><option>51–200</option><option>201+</option></select></label></div>
            <label>Company website <span className="optional-label">Optional</span><input type="url" placeholder="https://yourcompany.com" /></label>
            <button className="auth-submit" type="submit">Create sponsor account <span>↗</span></button>
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
  const [form, setForm] = useState({ name: '', handle: '', email: '', city: '', niche: 'Fashion & style', bio: '', instagram: '', youtube: '', rate: '' })
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value })

  return (
    <main className="profile-page">
      <header className="profile-topbar"><Brand /><div className="profile-topbar-right"><span>Already have an account?</span><a href="#login/influencer">Sign in</a></div></header>
      <div className="profile-layout">
        <aside className="profile-sidebar"><span className="auth-kicker"><span className="status-dot" /> CREATOR ONBOARDING</span><h1>Your story.<br /><em>Your next chapter.</em></h1><p>Build a profile that helps the right brands find you and picture what you can create together.</p><div className="profile-sidebar-art"><div className="art-sun" /><div className="art-card"><span>CREATOR<br />PROFILE</span><strong>INFLS&nbsp; ✳</strong></div><span className="art-caption">MAKE YOUR<br />INTRODUCTION</span></div><div className="sidebar-note"><span>✳</span><p><strong>Show up as you.</strong><br />Your voice is what makes your profile memorable.</p></div></aside>
        <section className="profile-form-panel">
          <div className="profile-form-head"><div><span className="form-step">STEP {step} OF 2</span><h2>{saved ? 'Your profile is taking shape.' : step === 1 ? 'Let’s get to know you.' : 'Show brands what you do.'}</h2><p>{saved ? 'Your details are saved in this preview.' : step === 1 ? 'Start with the details brands will see first.' : 'Add your platforms and collaboration details.'}</p></div><div className="profile-progress"><span style={{ width: step === 1 ? '50%' : '100%' }} /></div></div>
          {saved ? <div className="profile-success"><span className="success-icon">✓</span><h3>Looking good, {form.name || 'creator'}!</h3><p>Your creator profile preview is ready. Connect Infls to save it and get discovered.</p><div className="profile-preview"><span className="preview-avatar">{form.name ? form.name.slice(0, 1).toUpperCase() : '✦'}</span><div><strong>{form.name || 'Your name'} {form.handle && <small>{form.handle}</small>}</strong><span>{form.niche} · {form.city || 'Your city'}</span></div><b>DRAFT</b></div><button className="auth-submit" onClick={() => setSaved(false)}>Edit your details <span>↗</span></button></div> : <form className="creator-form" onSubmit={(event) => { event.preventDefault(); if (step === 1) setStep(2); else setSaved(true) }}>
            {step === 1 ? <>
              <div className="form-two-col"><label>Your name<input value={form.name} onChange={update('name')} placeholder="e.g. Aisha Kapoor" required /></label><label>Creator handle<input value={form.handle} onChange={update('handle')} placeholder="@yourhandle" /></label></div>
              <label>Email address<input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required /></label>
              <div className="form-two-col"><label>City<input value={form.city} onChange={update('city')} placeholder="Where are you based?" /></label><label>Your niche<select value={form.niche} onChange={update('niche')}><option>Fashion & style</option><option>Beauty & skincare</option><option>Food & drink</option><option>Travel</option><option>Fitness & wellness</option><option>Technology</option><option>Art & lifestyle</option><option>Other</option></select></label></div>
              <label>Your bio <span className="optional-label">A little about your work</span><textarea value={form.bio} onChange={update('bio')} placeholder="Tell brands what you create and who you create it for…" rows="4" maxLength="240" /></label>
              <button className="auth-submit" type="submit">Continue <span>→</span></button>
            </> : <>
              <div className="social-connect-heading"><span>✳</span><div><strong>Connect your socials</strong><small>Add your public profile links so brands can get to know your work.</small></div></div>
              <label>Instagram profile<div className="input-prefix"><span>instagram.com/</span><input value={form.instagram} onChange={update('instagram')} placeholder="yourhandle" /></div></label>
              <label>YouTube channel <span className="optional-label">Optional</span><div className="input-prefix"><span>youtube.com/@</span><input value={form.youtube} onChange={update('youtube')} placeholder="yourchannel" /></div></label>
              <label>Starting rate <span className="optional-label">INR · optional</span><div className="input-prefix"><span>₹</span><input type="number" min="0" value={form.rate} onChange={update('rate')} placeholder="Your starting price" /></div></label>
              <div className="profile-form-actions"><button type="button" className="back-step" onClick={() => setStep(1)}>← Back</button><button className="auth-submit" type="submit">Preview profile <span>↗</span></button></div>
            </>}
            <p className="profile-footnote"><span>♧</span> Your details stay in your control. You can update your profile anytime.</p>
          </form>}
        </section>
      </div>
      <footer className="auth-footer"><span>© 2026 Infls</span><span>Made for meaningful partnerships&nbsp; ✳</span></footer>
    </main>
  )
}
