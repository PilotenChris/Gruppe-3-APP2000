import React, { useState, useEffect } from "react";
import {useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import "./Copyright.css";

const Copyright = () => {

    return(
        <footer className='footer-copyright'> 
         <p> Copyright &#169; 2023 Gruppe 3 USN</p>
        </footer>
    )
}

export default Copyright