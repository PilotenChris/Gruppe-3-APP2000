import React, { useState } from 'react'
import {useNavigate } from 'react-router-dom'
import './AdminPage.css'
 
const AdminPage = () => { 
    const navigate = useNavigate()

    const createAdmin = () => {

        navigate('/admin-page/create-admin')
    }

    return (
        <div className='adminPage'>
            <button id='adminKnp' onClick={createAdmin}>Create Admin</button>
        </div>
    )

}


export default AdminPage