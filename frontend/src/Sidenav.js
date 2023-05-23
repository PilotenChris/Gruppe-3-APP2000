import React, { useState, useEffect } from "react";
import {useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import "./Sidenav.css";

const Sidenav = (props) => {
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [carModels, setCarModels] = useState([]);
  const [selectedCarModel, setSelectedCarModel] = useState("");
  const [versions, setVersions] = useState([]);
  const [selectedCarVersion, setSelectedCarVersion] = useState("");
  const [selectedCarDetails, setSelectedCarDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3030/ElCars")
      .then((response) => response.json())
      .then((data) => setCompanies(data));
  }, []);

  const openSidenav = () => {
    setIsSidenavOpen(true);
  };

  const closeSidenav = () => {
    setIsSidenavOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/login');
  };

  const handleCompanyChange = (event) => {
    const company = event.target.value;
    setSelectedCompany(company);
    setSelectedCarModel("");
    setVersions([]);
    setSelectedCarDetails(null);
    fetch(`http://localhost:3030/ElCars/${company}`)
      .then((response) => response.json())
      .then((data) => setCarModels(data));
  };

  const handleCarModelChange = (event) => {
    const carModel = event.target.value;
    setSelectedCarModel(carModel);
    setVersions([]);
    setSelectedCarDetails(null);
    fetch(`http://localhost:3030/ElCars/${selectedCompany}/${carModel}`)
      .then((response) => response.json())
      .then((data) => setVersions(data[0].Versions));
  };

  const handleCarVersionChange = (event) => {
    const carVersion = event.target.value;
    setSelectedCarVersion(carVersion);
  
    fetch(`http://localhost:3030/ElCars/${selectedCompany}/${selectedCarModel}/${carVersion}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSelectedCarDetails(data[0]);
        } else {
          setSelectedCarDetails(null);
        }
      })
      .catch((error) => {
        console.error("Error retrieving car details:", error);
        setSelectedCarDetails(null);
      });
  };


  return (
    <>
      <div
        id="mySidenav"
        className="sidenav"
        style={{
          width: isSidenavOpen ? "250px" : "0",
          position: "absolute",
          zIndex: "1"
        }}
      >
        <button className="closebtn" onClick={closeSidenav}>
          &times;
        </button>
        <div className="menu-container">
          <select
            className="menu-dropdown"
            value={selectedCompany}
            onChange={handleCompanyChange}
          >
            <option value="">Merke</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
        {selectedCompany && (
          <div className="menu-container">
            <select
              className="menu-dropdown"
              value={selectedCarModel}
              onChange={handleCarModelChange}
            >
              <option value="">Modell</option>
              {carModels.map((carModel) => (
                <option key={carModel} value={carModel}>
                  {carModel}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedCarModel && (
          <div className="menu-container">
            <select
  className="menu-dropdown"
  value={selectedCarVersion}
  onChange={handleCarVersionChange}
>
  <option value="">Versjon</option>
  {versions.map((version) => (
    <option key={version} value={version}>
      {version}
    </option>
  ))}
</select>

        </div>
      )}
      {selectedCarDetails && (
      <div className="car-details">
        <p>Range (km): {selectedCarDetails.Details["Range (km)"]}</p>
        <p>Battery Capacity (kWh): {selectedCarDetails.Details["Battery Capacity (kWh)"]}</p>
        <p>Charging Speed (kW): {selectedCarDetails.Details["Charging Speed (kW)"]}</p>
      </div>
    )}

   <div className="batteriMeny">
     <div className="menu-dropdown">
      <h1>Batteri</h1>
     </div>
     <div className="menu-dropdown">
      <label id="rangeBatteri">Batteristrøm xx%</label>
      <label>20%</label>
      <label id="maxLevel">100%</label>
         <>
             <Form.Range id="form" />
         </>
     </div>
     <div className="menu-dropdown">
     <label id="ladetid">Ladetid på ladestasjon</label>
      <label>0 min</label>
      <label id="maxMin">120 min</label>
         <>
             <Form.Range id="form" />
         </>
     </div>
     <div className="menu-dropdown">
         <label id="kontaktType">Ladestasjon kontakt type:</label>
     </div>
     <div className="grid_container">
         <div className="kontakt_type type-en">
         </div>
         <div className="kontakt_type type-to">
         </div>
         <div className="kontakt_type type-tre">
         </div>
         <div className="kontakt_type type-fire">
         </div>
     </div>
     <div className="menu-dropdown">
         <label className="switch">
             <input type="checkBox"></input>
             <span className="slider"></span>
         </label>
     </div>
     <div className="menu-dropdown">
         <label>80%</label>
         <label id="rangeLabel">Batterikapasitet</label>
         <label id="range_label">100%</label>
         <>
             <Form.Range id="form" />
         </>
     </div>
    </div>
    </div>
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      
        <span className="hamburger-meny"
           style={{ fontSize: "30px", cursor: "pointer" }}
           onClick={openSidenav}
      >
      
      </span>
    
      <div className="App" style={{ height: "100%", width: "100%" }}>
        {props.children}
      </div>

      <button id="adminBtn" onClick={handleAdminClick}>
      Admin
    </button>
    </div>
  </> 
);
};

export default Sidenav;

