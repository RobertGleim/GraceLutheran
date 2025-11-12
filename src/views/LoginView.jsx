import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import './LoginView.css'

const LoginView = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, register } = useAuth()

  // New: toggle inline register mode + register fields
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setShowPassword(false)

    try {
      const result = await login(email.trim().toLowerCase(), password)
      setLoading(false)
      if (result?.success) {
        // context user is set by login(), navigate now
        if (result.user?.role === 'admin') navigate('/admin')
        else navigate('/')
      } else {
        setError(result?.error || 'Login failed')
      }
    } catch  {
      setLoading(false)
      setError('Network error. Please try again.')
    }
  }

  // Register submit handler (copied/adapted from RegisterView)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setShowPassword(false)
    setShowConfirm(false)
    try {
      const result = await register({ username: name.trim(), email: email.trim().toLowerCase(), password })
      setLoading(false)
      if (result?.success) {
        navigate('/')
      } else {
        setError(result?.error || 'Registration failed')
      }
    } catch {
      setLoading(false)
      setError('Network error. Please try again.')
    }
  }

  const holdShowStart = (e) => {
    // prevent focusing quirks on touch
    if (e && e.type === 'touchstart') e.preventDefault()
    setShowPassword(true)
  }
  const holdShowEnd = () => setShowPassword(false)

  // register confirm show/hide handlers
  const holdShowConfirmStart = (e) => {
    if (e && e.type === 'touchstart') e.preventDefault()
    setShowConfirm(true)
  }
  const holdShowConfirmEnd = () => setShowConfirm(false)

  return (
    <div className="auth-background">
      {/* loading overlay */}
      {loading && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="loading-card">
            <div className="spinner" />
            <div className="loading-text">Signing you in…</div>
          </div>
        </div>
      )}

      {/* add swapped class when the register form should occupy the hero spot */}
      <div className={`auth-card ${isRegister ? 'swapped' : ''}`}>
        <div className="auth-hero">
          <div className="hero-content">
            {isRegister ? (
              <>
                <h1>Create Account</h1>
                <p>Join the community — quick setup and access.</p>
              </>
            ) : (
              <>
                <h1>Welcome Back</h1>
                <p>Sign in to continue to the community portal</p>
              </>
            )}
            <img
              src="/Grace-Collage3.png"
              alt={isRegister ? 'Register Hero' : 'Hero'}
              className="hero-img"
            />
          </div>
        </div>

        <div className="auth-form-container">
          {/* Render login form or register form in-place */}
          {!isRegister ? (
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <h2 className="form-title">Login</h2>

              {error && <div className="form-error" role="alert">{error}</div>}

              <label className="input-group">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="input-group">
                <span className="input-icon">🔒</span>
                <div className="password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onMouseDown={holdShowStart}
                    onMouseUp={holdShowEnd}
                    onMouseLeave={holdShowEnd}
                    onTouchStart={holdShowStart}
                    onTouchEnd={holdShowEnd}
                    onKeyDown={(ev) => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); setShowPassword(true) } }}
                    onKeyUp={(ev) => { if (ev.key === ' ' || ev.key === 'Enter') setShowPassword(false) }}
                  >👁</button>
                </div>
              </label>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="form-footer">
                <span>Don't have an account?</span>
                {/* toggle inline register instead of navigating away */}
                <button type="button" className="link-button" onClick={() => setIsRegister(true)}>Register</button>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegisterSubmit} noValidate>
              <h2 className="form-title">Create account</h2>

              {error && <div className="form-error" role="alert">{error}</div>}

              <label className="input-group">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label className="input-group">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="input-group">
                <span className="input-icon">🔒</span>
                <div className="password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onMouseDown={holdShowStart}
                    onMouseUp={holdShowEnd}
                    onMouseLeave={holdShowEnd}
                    onTouchStart={holdShowStart}
                    onTouchEnd={holdShowEnd}
                    onKeyDown={(ev) => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); setShowPassword(true) } }}
                    onKeyUp={(ev) => { if (ev.key === ' ' || ev.key === 'Enter') setShowPassword(false) }}
                  >👁</button>
                </div>
              </label>

              <label className="input-group">
                <span className="input-icon">🔒</span>
                <div className="password-wrap">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    onMouseDown={holdShowConfirmStart}
                    onMouseUp={holdShowConfirmEnd}
                    onMouseLeave={holdShowConfirmEnd}
                    onTouchStart={holdShowConfirmStart}
                    onTouchEnd={holdShowConfirmEnd}
                    onKeyDown={(ev) => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); setShowConfirm(true) } }}
                    onKeyUp={(ev) => { if (ev.key === ' ' || ev.key === 'Enter') setShowConfirm(false) }}
                  >👁</button>
                </div>
              </label>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create account'}
              </button>

              <div className="form-footer">
                <span>Already have an account?</span>
                <button type="button" className="link-button" onClick={() => setIsRegister(false)}>Back to Login</button>
              </div>
            </form>
          )}
         </div>
       </div>
     </div>
   )
 }

 export default LoginView

