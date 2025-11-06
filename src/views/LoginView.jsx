import React, { useState, useEffect } from 'react'
import {useAuth} from '../contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { testBackendConnection } from '../utils/backendTest.js'
import { testBackendAndCreateAdmin } from '../utils/backendDiagnostic.js'
import './LoginView.css'

const LoginView = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Test backend connectivity on component mount
    testBackendConnection();
    // Run comprehensive backend diagnostic
    testBackendAndCreateAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const result = await login(email, password)
    
    setLoading(false)
    
    if (result?.success) {
      // Redirect based on user role
      if (result.user?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } else {
      const errorMessage = result?.error || 'Login failed. Please check your credentials.'
      setError(errorMessage)
      console.log('Login failed:', errorMessage)
    }
  }

  return (
    <div className="login">
      <h1>Login</h1>
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input 
            type="email" 
            placeholder="Email" 
            name='email' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            autoComplete="email"
            required
          />
        </div>
        <div className="input-container">
          <input 
            type="password" 
            placeholder="Password" 
            name='password' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            autoComplete="current-password"
            required
          />
        </div>
        <button className='login-button' type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div style={{marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px'}}>
        <h3>Debug Tools</h3>
        <button 
          type="button" 
          onClick={() => testBackendAndCreateAdmin()}
          style={{marginRight: '10px', padding: '5px 10px'}}
        >
          Test Common Passwords
        </button>
        <button 
          type="button" 
          onClick={() => {
            setEmail('admin@email.com');
            setPassword('admin');
          }}
          style={{marginRight: '10px', padding: '5px 10px'}}
        >
          Try admin/admin
        </button>
        <button 
          type="button" 
          onClick={() => {
            setEmail('admin@email.com');
            setPassword('password');
          }}
          style={{marginRight: '10px', padding: '5px 10px'}}
        >
          Try admin/password
        </button>
        <p style={{fontSize: '12px', color: '#666'}}>
          Click "Test Common Passwords" to find the correct password, or try the preset buttons
        </p>
      </div>
      <img className="login-illustration" src="/Grace-Collage3.png" alt="Login Illustration" />
    </div>
  )
}

export default LoginView

