import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import './AuthForm.css'

const RegisterView = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSubmit = async (e) => {
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
        // context populated by register(); navigate immediately
        navigate('/')
      } else {
        setError(result?.error || 'Registration failed')
      }
    } catch  {
      setLoading(false)
      setError('Network error. Please try again.')
    }
  }

  const holdShowPasswordStart = (e) => {
    if (e && e.type === 'touchstart') e.preventDefault()
    setShowPassword(true)
  }
  const holdShowPasswordEnd = () => setShowPassword(false)

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
            <div className="loading-text">Creating your account…</div>
          </div>
        </div>
      )}

      <div className="auth-card">
        <div className="auth-hero small-hero">
          <div className="hero-content">
            <h1>Create Account</h1>
            <p>Join the community — quick setup and access.</p>
            <img src="/Grace-Collage3.png" alt="Hero" className="hero-img" />
          </div>
        </div>

        <div className="auth-form-container">
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <h2 className="form-title">Register</h2>

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
                  onMouseDown={holdShowPasswordStart}
                  onMouseUp={holdShowPasswordEnd}
                  onMouseLeave={holdShowPasswordEnd}
                  onTouchStart={holdShowPasswordStart}
                  onTouchEnd={holdShowPasswordEnd}
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
              <Link to="/login" className="link-button">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterView
