import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./Style.css";
import React, { useState, useEffect } from 'react';

const Update = () => {
  const navigate = useNavigate();
  const [companyNames, setCompanyNames] = useState('');
  const [companies, setCompanies] = useState([]);
  const [carName, setCarName] = useState([]);
  const [versionName, setVersionName] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [selectedNewCar, setSelectedNewCar] = useState('');
  const [selectedNewVersion, setSelectedNewVersion] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseMessage2, setResponseMessage2] = useState('');

  useEffect(() => {
    // Fetching list of companies from the database
    fetch("http://localhost:3030/ElCars")
      .then((response) => response.json())
      .then((data) => setCompanies(data))
      .catch((error) => console.error('Error fetching companies:', error));
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetch(`http://localhost:3030/ElCars/${selectedCompany}`)
        .then((response) => response.json())
        .then((data) => setCarName(data))
        .catch((error) => console.error('Error fetching cars:', error));
    }
  }, [selectedCompany]);

  useEffect(() => {
    setVersionName([]);
    if (selectedCompany && selectedCar) {
      fetch(`http://localhost:3030/ElCars/${selectedCompany}/${selectedCar}`)
        .then((response) =>  response.json())
        .then((data) => setVersionName(data[0].Versions))
        .catch((error) => console.error('Error fetching versions:', error));
    }
  }, [selectedCompany, selectedCar]);
  

  const createAdmin = () => {
    navigate('/admin-page/create-admin');
  };

  const handleSubmitComp = (event) => {
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

  const handleSubmitCar = (event) => {
    event.preventDefault();
  
    const data = {
      range_km: updatedDetails.range_km || '',
      battery_capacity_kWh: updatedDetails.battery_capacity_kWh || '',
      charging_speed_kW: updatedDetails.charging_speed_kW || ''
    };
    // Extracting company, car and version names from dropdown. New names and details from textboxes
    // Making PUT request to edit names and details of a car
    fetch(`http://localhost:3030/ElCars/${selectedCompany}/${selectedCar}/${selectedNewCar}/${selectedVersion}/${selectedNewVersion}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          setResponseMessage2('Car details updated in the database.');
        } else {
          setResponseMessage2('Failed to update car details.');
        }
      })
      .catch((error) => {
        console.error('Error updating car details:', error);
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
            <form id='selskapForm' onSubmit={handleSubmitComp}>
              <div className='form-row'>
                <label>Insert old and new company names (separated by ";"): </label>
                <input type="text" value={companyNames} onChange={(e) => setCompanyNames(e.target.value)} />
                <button id='KnpUpdate'>Update</button>
              </div>
              <p>{responseMessage}</p>
            </form>
          </div>

          <div className="bil">
              <h2 className="headline">Bil</h2>
              <form id='bilForm' onSubmit={handleSubmitCar}>
                <select id='companyDropdown' value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
                  <option value=''>Velg selskap</option>
                  {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
              <select id='carDropdown' value={selectedCar} onChange={(e) => setSelectedCar(e.target.value)}>
                <option value=''>Velg bilmodell</option>
                {carName.map((car) => (
                  <option key={car} value={car}>
                    {car}
                  </option>
                ))}
              </select>
              <label id="Lbl">Bilmodell: </label>
              <input type="text" value={selectedNewCar} onChange={(e) => setSelectedNewCar(e.target.value)} />
                <select id='versionDropdown' value={selectedVersion} onChange={(e) => setSelectedVersion(e.target.value)}>
                  <option value=''>Velg versjon</option>
                  {versionName.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
                <center className='center'>
                  <div className='version'>
                <label id="Lbl">Versjon: </label>
                <input type="text" value={selectedNewVersion} onChange={(e) => setSelectedNewVersion(e.target.value)} />
                </div>
                  <div className='rekkevidde'>
                    <label>Rekkevidde: </label>
                   <input type="text" value={updatedDetails.range_km || ''} onChange={(e) => setUpdatedDetails({ ...updatedDetails, range_km: e.target.value })} />
                  </div>
                  <div className='kapasitet'>
                    <label >Batterikapasitet: </label>
                    <input type="text" id='kapasitetInput' value={updatedDetails.battery_capacity_kWh || ''} onChange={(e) => setUpdatedDetails({ ...updatedDetails, battery_capacity_kWh: e.target.value })} />
                  </div>
                  <div className='ladefart'>
                    <label>Ladefart: </label>
                   <input type="text" value={updatedDetails.charging_speed_kW || ''} onChange={(e) => setUpdatedDetails({ ...updatedDetails, charging_speed_kW: e.target.value })} />
                  </div>
                  <button id="knapp">Submit</button>
                  <p>{responseMessage2}</p>
                </center>
              </form>
            </div>
        </header>
      </div>
      <footer className='footer'> 
        <p> Copyright &#169; 2023 Gruppe 3 USN
        </p>
      </footer>
    </body>
  );
};

export default Update;