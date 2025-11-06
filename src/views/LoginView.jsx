import React, { useState } from 'react'
import {useAuth} from '../contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import './LoginView.css'

const LoginView = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(email, password)
    
    if (result?.success) {
      // Redirect based on user role
      if (result.user?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } else {
      alert('Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input type="email" placeholder="Email" name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-container">
          <input type="password" placeholder="Password" name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className='login-button' type="submit">Login</button>
      </form>
      <img className="login-illustration" src="/Grace-Collage3.png" alt="Login Illustration" />
    </div>
  )
}

export default LoginView

