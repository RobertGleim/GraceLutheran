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
  const { login } = useAuth()

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

  const holdShowStart = (e) => {
    // prevent focusing quirks on touch
    if (e && e.type === 'touchstart') e.preventDefault()
    setShowPassword(true)
  }
  const holdShowEnd = () => setShowPassword(false)

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

      <div className="auth-card">
        <div className="auth-hero">
          <div className="hero-content">
            <h1>Welcome Back</h1>
            <p>Sign in to continue to the community portal</p>
            <img src="/Grace-Collage3.png" alt="Hero" className="hero-img" />
          </div>
        </div>

        <div className="auth-form-container">
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
              <Link to="/register" className="link-button">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginView

