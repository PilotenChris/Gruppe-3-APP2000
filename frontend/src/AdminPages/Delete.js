import {Link} from 'react-router-dom'
import {useNavigate } from 'react-router-dom'
import "./Style.css"




const Delete = () => {

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
        <div className='selskap'>
           <h2 className='headline'>Selskap</h2>
            <select id='deleteSelskap'>
                <option>selskap1</option>
                <option>selskap2</option>
            </select> 
            <button id='deleteBtnSelskap'>Delete</button>  
            </div>
            <div className='bil'>
                <h2 className='headline'>Bil</h2>
                <select id='deleteBil'>
                <option>bil1</option>
                <option>bil2</option>
            </select> 
            <button id='deleteBtnBil'>Delete</button>  
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