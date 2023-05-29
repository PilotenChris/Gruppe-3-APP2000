import {Link} from 'react-router-dom'
import {useNavigate } from 'react-router-dom'
import "./Style.css"
import React, { useState, useEffect } from 'react';


const Insert = () => {

    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [carName, setCarName] = useState('');
    const [versionName, setVersionName] = useState('');
    const [range, setRange] = useState('');
    const [batteryCapacity, setBatteryCapacity] = useState('');
    const [chargingSpeed, setChargingSpeed] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [responseMessage2, setResponseMessage2] = useState('');

    // Checking if user is logged in before accessing the page
    // Helge
    useEffect(() => {
      const authenticationCheck = async () => {
        try {
          const accessToken = sessionStorage.getItem('accessToken');
          if (!accessToken) {
            navigate('/login');
            return;
          }
          
          const response = await fetch('/Admin/login', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + accessToken
            }
          });
    
          if (!response.ok) {
            navigate('/login');
          }
        } catch (error) {
          console.error('Error checking admin authentication:', error);
          navigate('/login', { replace: true });
        }
      };
    
      authenticationCheck();
    }, [navigate]);

    // Fetching all companies from the database
    // Helge
    useEffect(() => {
      fetch("http://localhost:3030/ElCars")
        .then((response) => response.json())
        .then((data) => setCompanies(data))
        .catch((error) => console.error('Error fetching companies:', error));
    }, []);
  

    const createAdmin = () => {
        navigate('/admin-page/create-admin')
    }

    // Handle for inserting a company name into the database
    // Helge
    const handleTextSubmit = (event) => {
        event.preventDefault();
        // Making the POST request to insert a company
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

      // Handle submitting a car model, version and details into database
      // Helge
      const handleCarSubmit = (event) => {
        event.preventDefault();
    
        // Making the POST request to insert all car details
        fetch(`http://localhost:3030/ElCars/${companyName}/${carName}/${versionName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            range: range,
            batteryCapacity: batteryCapacity,
            chargingSpeed: chargingSpeed,
          }),
        })
          .then((response) => {
            if (response.ok) {
              setResponseMessage2('Car details added to database.');
            } else {
              setResponseMessage2('Failed to add car details.');
            }
          })
          .catch((error) => {
            console.error('Error adding car details:', error);
          });
      };
      

    return (
        <body className='adminSider'>
        <div>
          {/* Omar & Truls added navigation */}
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
           {/* Omar & Truls added create admin button */}
            <button id='adminKnp' onClick={createAdmin}>Create Admin</button>
        </div>
         {/* Omar & Truls added header */}
        <header className='header'>
          {/* Omar & Truls added form to type inn car name and submit button*/}
            <div className='selskap'>
                <h2 className='headline'>Selskap</h2>
                <form id='selskapForm' onSubmit={handleTextSubmit}>

                <label>Navn: </label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />

                <button id='KnpUpdate'>Submit</button> 
                <p>{responseMessage}</p>
                </form>
            </div>
            {/* Omar & Truls added form for user to choose, input and button to submit  */}
              <div className="bil">
              <h2 className="headline">Bil</h2>
              <form id='bilForm' onSubmit={handleCarSubmit}>
                <select id='bilDropdown' value={companyName} onChange={(e) => setCompanyName(e.target.value)}>
                  <option value=''>Velg selskap</option>
                  {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
                </select>
                <center>
                  <div className='modell'>
                     <label id="Lbl">Bilmodell: </label>
                     <input type="text" onChange={(e) => setCarName(e.target.value)}/>
                  </div>
                  <div className='version'>
                     <label id="Lbl">Versjon: </label>
                     <input type="text" onChange={(e) => setVersionName(e.target.value)} />
                 </div>
                  <div className='rekkevidde'>
                     <label>Rekkevidde: </label>
                     <input type="text" onChange={(e) => setRange(e.target.value)} />
                  </div>
                  <div className='kapasitet'>
                     <label>Batterikapasitet: </label>
                     <input type="text" onChange={(e) => setBatteryCapacity(e.target.value)}/>
                  </div>
                  <div className='ladefart'>
                     <label>Ladefart: </label>
                     <input type="text" onChange={(e) => setChargingSpeed(e.target.value)} />
                  </div>
                  <button id="knapp">Submit</button>
                  <p>{responseMessage2}</p>
                </center>
                </form>
            </div>
        </header>
        </div>
        {/* Omar & Truls added footer */}
        <footer className='footer'> 
          <p> Copyright &#169; 2023 Gruppe 3 USN</p>
        </footer>
        </body>
        
    )

}
export default Insert