import React, { useState } from 'react'
import {useNavigate } from 'react-router-dom'
import './AdminLogin.css'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignin = () => {

    navigate('/admin-page')
  }

  return(
    <div className='loginSide' >
    <h1>Innlogging</h1>
    <input
      type="text" placeholder='Epost'
      value={username}
      onChange={(e) => setUsername(e.target.getValue)}
      />
      <input
      type="password" placeholder='Passord'
      value={password}
      onChange={(e) => setPassword(e.target.getValue)}
      />
      <button onClick={handleSignin}>
        Login
      </button>

    </div>



  )

}

export default AdminLogin