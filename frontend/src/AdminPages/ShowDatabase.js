import {Link} from 'react-router-dom'
import {useNavigate } from 'react-router-dom'
import "./Style.css"
const ShowDatabase = () => {

    const navigate = useNavigate()

    const createAdmin = () => {

        navigate('/admin-page/create-admin')
    }

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
           <div className='showData'>

           </div>
        </header>

        </div>
        <footer className='footer'> 
            <p> Copyright &#169; 2023 Gruppe 1 USN</p>
        </footer>
        </body>
    )

}
export default ShowDatabase