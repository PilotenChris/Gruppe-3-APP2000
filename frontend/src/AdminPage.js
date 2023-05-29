import {Link} from 'react-router-dom'
import {useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react';
import './AdminPage.css'
 
const AdminPage = () => { 
    const navigate = useNavigate()

    const createAdmin = () => {

        navigate('/admin-page/create-admin')
    }

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
          
          const response = await fetch("https://testgruppe3usnexpress.onrender.com/Admin/login2", {
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
           <div className='emptyPage'>
           </div>
        </header>
        <footer className='footer'> 
            <p> Copyright &#169; 2023 Gruppe 3 USN</p>
        </footer>
        </div>
        </body>
        
        
    )

}
export default AdminPage