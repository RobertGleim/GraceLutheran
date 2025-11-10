import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../utils/api.js'
import './AuthForm.css'

const LoginView = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await apiFetch('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      })
      const body = await res.json().catch(()=>null)
      setLoading(false)

      if (!res.ok) {
        setError(body?.message || (body?.errors && JSON.stringify(body.errors)) || 'Login failed')
        return
      }

      if (body?.token) {
        localStorage.setItem('token', body.token)
      }
      if (body?.user?.role === 'admin') navigate('/admin')
      else navigate('/')
    } catch {
      setLoading(false)
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className="auth-background">
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
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
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

