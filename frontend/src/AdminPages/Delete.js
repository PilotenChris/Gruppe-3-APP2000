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

   useEffect(() => {
    const authenticationCheck = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
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
    
    const createAdmin = () => {

        navigate('/admin-page/create-admin')
    }

    useEffect(() => {
        fetchCompanies();
        fetchCarModels();
      }, []);

      const fetchCompanies = () => {
        fetch('http://localhost:3030/ElCars')
          .then((response) => response.json())
          .then((data) => {
            setCompanies(data);
          })
          .catch((error) => {
            console.error('Error fetching companies:', error);
          });
      };

      const fetchCarModels = (selectedCompany) => {
        fetch(`http://localhost:3030/ElCars/${selectedCompany}`)
          .then((response) => response.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setCarModels(data);
            } else {
              setCarModels([]);
            }
          })
          .catch((error) => {
            console.error('Error fetching car models:', error);
          });
      };
      
    

    const handleDeleteCompany = (event) => {
        event.preventDefault();
        const selectedCompany = document.getElementById('deleteSelskap').value;
        // Make DELETE request to delete a company
        fetch(`http://localhost:3030/ElCars/${selectedCompany}`, {
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

      const handleDeleteCar = (event) => {
        event.preventDefault();
        const selectedCompany = document.getElementById('deleteSelskap').value;
        const selectedCar = document.getElementById('deleteBil').value;
    
        // Make DELETE request to delete a car model
        fetch(`http://localhost:3030/ElCars/${selectedCompany}/${selectedCar}`, {
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
           <select id='deleteSelskap' onChange={(e) => fetchCarModels(e.target.value)}>
           <option value=''>Velg selskap</option>
              {companies.map((company) => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select> 
            <button id='deleteBtnSelskap' onClick={handleDeleteCompany}>Delete</button>  
                <p>{responseMessage1}</p>
            </div>
            <div className='bil'>
                <h2 className='headline'>Bil</h2>
                <select id='deleteBil'>
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
        <footer className='footer'> 
          <p> Copyright &#169; 2023 Gruppe 3 USN</p>
        </footer>
        </body>
    )

}
export default Delete