import { Link} from 'react-router-dom';
import {useNavigate } from 'react-router-dom'
import './AdminPage.css'
 
const AdminPage = () => { 
    const navigate = useNavigate()

    const createAdmin = () => {

        navigate('/admin-page/create-admin')
    }

    return (
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
        /</div>
    )

}


export default AdminPage