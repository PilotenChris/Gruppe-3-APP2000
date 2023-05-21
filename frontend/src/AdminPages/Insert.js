import {Link} from 'react-router-dom'
import {useNavigate } from 'react-router-dom'
import "./Style.css"
import React, { useEffect, useState } from 'react';


const Insert = () => {

    const navigate = useNavigate()
    const [companyName, setCompanyName] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const createAdmin = () => {

        navigate('/admin-page/create-admin')
    }

    const handleTextSubmit = (event) => {
        event.preventDefault();
        // Making the POST request to insert the company
        fetch(`http://localhost:3030/ElCars/${companyName}`, {
          method: 'POST',
        })
          .then((response) => {
            if (response.ok) {
              setResponseMessage('Company added to database.');
            } else {
                setResponseMessage('Failed to add company.'); 
            }
          })
          .catch((error) => {
            console.error('Error adding company:', error); 
          });
      };
      

    return (
        <body className='adminSider'>
        <div>
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
        <div className='adminPage'>
            <button id='adminKnp' onClick={createAdmin}>Create Admin</button>
        </div>
        <header className='header'>
            <div className='selskap'>
                <h2 className='headline'>Selskap</h2>
                <form id='selskapForm' onSubmit={handleTextSubmit}>
                <label>Navn: </label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />

                <button id='KnpUpdate'>Update</button>
                <p>{responseMessage}</p>
                </form>
            </div>
            <div className='bil'>
                <h2 className='headline'>Bil</h2>
            </div>
        </header>
        </div>
        <footer className='footer'> 
            <p> &#169; Gruppe 1 USN 2023</p>
        </footer>
        </body>
        
    )

}
export default Insert