import React, { useState } from 'react'
import {useAuth} from '../contexts/AuthContext.jsx'
import './LoginView.css'

const LoginView = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()


  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
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

