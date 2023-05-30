import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthCheck } from './AuthCheck';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setAccessToken } = useContext(AuthCheck);

  // Handling login attempt from user
  // Helge
  const handleLogin = async () => {
    try {
      const response = await fetch('https://testgruppe3usnexpress.onrender.com/Admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
  
      // Navigates user to admin-page if login is succesfull
      if (response.status === 200) {
        navigate('/admin-page');
        const data = await response.json();
        const token = data.token;
        setAccessToken(token);
        navigate('/admin-page');
      } else if (response.status === 401) {
        alert('Feil brukernavn eller passord');
      } else {
        throw new Error('An error occurred during authentication');
      }
    } catch (error) {
      console.error('Error with authentication:', error);
      alert('Feil med å autentisere bruker. Prøv igjen.');
    }
  };

  return (
    <body>
      <div className='loginSide'>
        <header>
          {/* Omar & Truls added header and log in form for administrator */}
          <h1>Innlogging</h1>
          <input
            type="text"
            placeholder='Epost'
            value={username}
            onChange={(e) => setUsername(e.target.value)}/>
          <input
            type="password"
            placeholder='Passord'
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
          <button onClick={handleLogin}>
            Logg inn
          </button>
        </header>
      </div>
      {/* Omar & Truls added footer */}
      <footer className='footerLoginCreate'>
        <p>&#169; 2023 Gruppe 3 USN</p>
      </footer>
    </body>
  );
};

export default AdminLogin;
