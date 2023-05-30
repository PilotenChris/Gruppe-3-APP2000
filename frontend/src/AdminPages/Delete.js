import {Link} from 'react-router-dom'
import {useNavigate } from 'react-router-dom'
import "./Style.css"
import React, { useState, useEffect } from 'react';




const Delete = () => {

    const navigate = useNavigate()
    const [companies, setCompanies] = useState([]);
    const [carModels, setCarModels] = useState([]);
    const [responseMessage1, setResponseMessage1] = useState('');
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
          method: 'POST',
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
    
    const createAdmin = () => {

        navigate('/admin-page/create-admin')
    }

      // Fetching all companies from the database
      // Helge
      useEffect(() => {
        fetch("https://testgruppe3usnexpress.onrender.com/ElCars")
          .then((response) => response.json())
          .then((data) => setCompanies(data))
          .catch((error) => console.error('Error fetching companies:', error));
      }, []);
      
      // Fetching all car models of a company from the database
      // Helge
      useEffect(() => {
        if (selectedCompany) {
          fetch(`https://testgruppe3usnexpress.onrender.com/ElCars/${selectedCompany}`)
            .then((response) => response.json())
            .then((data) => setCarName(data))
            .catch((error) => console.error('Error fetching cars:', error));
        }
      }, [selectedCompany]);
      
    
    // Deleting a company from database
    // Helge
    const handleDeleteCompany = (event) => {
        event.preventDefault();
        const selectedCompany = document.getElementById('deleteSelskap').value;
        // Make DELETE request to delete a company
        fetch(`https://testgruppe3usnexpress.onrender.com/ElCars/${selectedCompany}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (response.ok) {
                setResponseMessage1('Company deleted.');
            } else {
                setResponseMessage1('Failed to delete company.');
            }
          })
          .catch((error) => {
            console.error('Error deleting company:', error);
          });
      };

      // Deleting a car model from the database
      // Helge
      const handleDeleteCar = (event) => {
        event.preventDefault();
        const selectedCompany = document.getElementById('deleteSelskap').value;
        const selectedCar = document.getElementById('deleteBil').value;
    
        // Make DELETE request to delete a car model
        fetch(`https://testgruppe3usnexpress.onrender.com/ElCars/${selectedCompany}/${selectedCar}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (response.ok) {
              setResponseMessage2('Car deleted.');
              fetchCarModels(selectedCompany);
            } else {
              setResponseMessage2('Failed to delete car.');
            }
          })
          .catch((error) => {
            console.error('Error deleting car model:', error);
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
         {/* Omar & Truls added create admin button */}
        <div className='adminPage'>
            <button id='adminKnp' onClick={createAdmin}>Create Admin</button>
        </div>
         {/* Omar & Truls added header */}
        <header className='header'>

        <div className='selskap'>
          {/* Omar & Truls added dropdown options for company and deletee button*/}
           <h2 className='headline'>Selskap</h2>
           <select id='companyDropdown' value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
           <option value=''>Velg selskap</option>
              {companies.map((company) => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select> 
            <button id='deleteBtnSelskap' onClick={handleDeleteCompany}>Delete</button>  
                <p>{responseMessage1}</p>
            </div>

            <div className='bil'>
               {/* Omar & Truls added dropdown options for cars and deletee button*/}
                <h2 className='headline'>Bil</h2>
                <select id='carDropdown' value={selectedCar} onChange={(e) => setSelectedCar(e.target.value)}>
                <option value=''>Velg bil</option>
                  {carModels.map((carModel) => (
                  <option key={carModel} value={carModel}>{carModel}</option>
                ))}
            </select> 
            <button id='deleteBtnBil' onClick={handleDeleteCar}>Delete</button>  
            <p>{responseMessage2}</p>
            </div>
        </header>
        </div>
         {/* Omar & Truls added footer*/}
        <footer className='footer'> 
          <p> Copyright &#169; 2023 Gruppe 3 USN</p>
        </footer>
        </body>
    )

}
export default Delete