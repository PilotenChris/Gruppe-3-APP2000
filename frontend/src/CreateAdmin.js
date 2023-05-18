import React, { useState } from 'react'
import './AdminPage.css'

const CreateAdmin = () => {
    
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSignin = () => {

  }


    return(
        <div className='createAdmin'>
            <h1>Create Admin</h1>
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
      <label for="vehicle1">Super Admin </label>
        <input type="checkbox" id="vehicle2" name="vehicle2" value="Car"></input>
      <button id='createAdminBtn' onClick={handleSignin}>
        Create
      </button>
        </div>
    )
}

export default CreateAdmin