import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./Style.css";
import React, { useState } from 'react';

const Update = () => {
  const navigate = useNavigate();
  const [companyNames, setCompanyNames] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const createAdmin = () => {
    navigate('/admin-page/create-admin');
  };

  const handleTextSubmit = (event) => {
    event.preventDefault();

    // Extracting old and new company names from textbox
    const [oldCompany, newCompany] = companyNames.split(';');

    // Making the PUT request to edit the company name
    fetch(`http://localhost:3030/ElCars/${oldCompany}/${newCompany}`, {
      method: 'PUT',
    })
      .then((response) => {
        if (response.ok) {
          setResponseMessage('Company name edited.');
        } else {
          setResponseMessage('Failed to edit company name.');
        }
      })
      .catch((error) => {
        console.error('Error editing company name:', error);
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
                <form id='selskapForm'>
                    <div className='form-row'>
                <label>Insert old and new company names (separated by ";"): </label>
                <input type="text" value={companyNames} onChange={(e) => setCompanyNames(e.target.value)} />
                <button id='KnpUpdate'>Update</button> </div>
                <p>{responseMessage}</p>
                </form>
            </div>
            <div className='bil'>
                <h2 className='headline'>Bil</h2>
                <form>
                    <select className='selectBil'>
                        <option>Bilnavn</option>
                    </select >
                      <center>
                        <div>
                        <div className='labels'>
                      <label >Navn: </label>
                      <input type="text"/> <br></br>
                      </div>
                      <div className='labels'>
                      <label>Version: </label> 
                      <input type="text"/><br></br>
                      </div>
                      <div className='labels'>
                      <label>Version: </label>
                      <input type="text"/>
                      </div>
                      </div>
                      </center>
                      <center>
                      <h2>Range:</h2>
                      <label>Name of version: </label>
                      <input type="text"/>
                      <h2>Battery Capacity:</h2>
                      <label>Name of version: </label>
                      <input type="text"/>
                      <h2>Charging speed:</h2>
                      <label>Name of version: </label>
                      <input type="text"/>
                      <button id='updateKnapp'>Update</button>
                      </center>

                </form>
            </div>
        </header>
        </div>
        <footer className='footer'> 
              <p> Copyright &#169; 2023 Gruppe 3 USN</p>
        </footer>
        </body>
    );
  };
    export default Update;
