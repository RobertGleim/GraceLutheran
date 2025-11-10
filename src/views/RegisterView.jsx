import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../utils/api.js'
import './AuthForm.css'

const RegisterView = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({
          username: name.trim(),
          email: email.trim().toLowerCase(),
          password
        })
      })
      const body = await res.json().catch(() => null)
      setLoading(false)

      if (!res.ok) {
        setError(body?.message || (body?.errors && JSON.stringify(body.errors)) || 'Registration failed')
        return
      }

      // If backend returns token+user use them, otherwise fallback to logging in
      if (body?.token && body?.user) {
        localStorage.setItem('token', body.token)
        localStorage.setItem('user', JSON.stringify(body.user))
        navigate('/')
        return
      }

      // Fallback: attempt login if token wasn't returned
      const loginRes = await apiFetch('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      })
      const loginBody = await loginRes.json().catch(() => null)
      if (loginRes.ok && loginBody?.token) {
        localStorage.setItem('token', loginBody.token)
        localStorage.setItem('user', JSON.stringify(loginBody.user))
        navigate('/')
      } else {
        navigate('/login')
      }
    } catch {
      setLoading(false)
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className="auth-background">
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
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <label className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
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
