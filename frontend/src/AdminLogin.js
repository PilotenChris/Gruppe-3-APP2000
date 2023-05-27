import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3030/Admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
  
      if (response.status === 200) {
        navigate('/admin-page');
        const data = await response.json();
        const token = data.token;
        sessionStorage.setItem('accessToken', token);
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
      <footer className='footerLoginCreate'>
        <p>&#169; 2023 Gruppe 3 USN</p>
      </footer>
    </body>
  );
};

export default AdminLogin;
