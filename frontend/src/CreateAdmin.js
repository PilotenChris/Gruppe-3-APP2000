import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './AdminPage.css'

const CreateAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');


  const handleSignin = () => {
    // Creating request body
    const requestBody = {
      email: username,
      password: password,
      isSuperAdmin: isSuperAdmin
    };

    // POST requests to create the account
    fetch("http://localhost:3030/Admin", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => {
        if (response.ok) {
          console.log('Account created.');
          setResponseMessage('Account created.');
        } else {
          console.error('Failed to create account.');
          setResponseMessage('Failed to create account.');
        }
      })
      .catch(error => {
        console.error('Error creating account:', error);
      });
  };

  const handleSuperAdminCheckboxChange = (event) => {
    setIsSuperAdmin(event.target.checked);
  };

  return (
    <body>
      <nav className='nav'>
          <Link to="/" className="back-to-home">
            Home
          </Link>
          <ul>
            <li> <Link to="/admin-page/insert">Insert bil/selskap</Link> </li>
            <li> <Link to="/admin-page/update">Update bil/selskap</Link></li>
            <li> <Link to="/admin-page/delete">Delete bil/selskap</Link></li>
            <li> <Link to="/admin-page/show-database">Show database</Link></li>
          </ul>
        </nav>
      <header>
    <div className='createAdmin'>
      <h1>Create Admin</h1>
      <input
        type="text"
        placeholder="Epost"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Passord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label htmlFor="superAdminCheckbox">Super Admin</label>
      <input
        type="checkbox"
        id="superAdminCheckbox"
        name="superAdminCheckbox"
        checked={isSuperAdmin}
        onChange={handleSuperAdminCheckboxChange}
      />
      <button id='createAdminBtn' onClick={handleSignin}>
        Create
      </button>
      <p>{responseMessage}</p>
    </div>
    </header>
    <footer className='footerLoginCreate'> 
            <p> Copyright &#169; 2023 Gruppe 3 USN</p>
        </footer>
    </body>
  );
}

export default CreateAdmin;
