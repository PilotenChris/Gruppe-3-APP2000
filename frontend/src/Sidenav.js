import React, { useState, useEffect } from "react";
import {useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import "./Sidenav.css";
import { useDispatch } from 'react-redux';
import { setUserSetting, updateSeason } from './redux/userSettingSlice';
import { addUserCar, updateType, updateVersion, updateRange, updateInfo, updateCharMIN, updateMaxRange, resetUserCar, resetUserCarType, resetUserCarVersion, resetUserCarMaxRange } from './redux/userCarSlice';

const Sidenav = (props) => {
  const [isSidenavOpen, setIsSidenavOpen] = useState(true);
  const [isHamburgerMenuVisible, setIsHamburgerMenuVisible] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [carModels, setCarModels] = useState([]);
  const [selectedCarModel, setSelectedCarModel] = useState("");
  const [versions, setVersions] = useState([]);
  const [selectedCarVersion, setSelectedCarVersion] = useState("");
  const [selectedCarDetails, setSelectedCarDetails] = useState(null);
  const [batteripro, setBatteripro] = useState(0.8);
  const [ladetid, setLadetid] = useState(30);
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const handleInfoClick = () => {setIsActive(!isActive);}

  const dispatch = useDispatch();

  dispatch(setUserSetting(1.0));

  const changeBatteristrom = (batterystromPro) => {
    if (selectedCarVersion.length > 0) {
      const newRange = (selectedCarDetails.Details["Range (km)"]*batterystromPro);
      const maxRange = selectedCarDetails.Details["Range (km)"];
      dispatch(updateInfo({
        battCap: selectedCarDetails.Details["Battery Capacity (kWh)"],
        charSpeed: selectedCarDetails.Details["Charging Speed (kW)"]
      }));
      dispatch(updateMaxRange({ maxRange: maxRange}));
      setBatteripro(batterystromPro);
      dispatch(updateRange({ range: newRange}));
    }
  };
  
  const changeLadetid = (chargingtime) => {
    if (selectedCarVersion.length > 0) {
      dispatch(updateCharMIN({ charMIN: chargingtime}));
      setLadetid(chargingtime);
    }
  };

  const updateCarDetails = (carDetails) => {
    const newRange = (carDetails.Details["Range (km)"]*batteripro);
      const maxRange = carDetails.Details["Range (km)"];
      dispatch(updateInfo({
        battCap: carDetails.Details["Battery Capacity (kWh)"],
        charSpeed: carDetails.Details["Charging Speed (kW)"]
      }));
      dispatch(updateMaxRange({ maxRange: maxRange}));
      dispatch(updateRange({ range: newRange}));
      dispatch(updateCharMIN({ charMIN: ladetid}));
  }


  useEffect(() => {
    fetch("http://localhost:3030/ElCars")
      .then((response) => response.json())
      .then((data) => setCompanies(data));
  }, []);

  const openSidenav = () => {
    setIsSidenavOpen(true);
    setIsHamburgerMenuVisible(false);
  };

  const doBold = () => {
    var checkBox = document.getElementById("sjekkInn");
    if(checkBox.checked === true) {
      var vinter = document.getElementById("vinter");
      vinter.classList.add("årstid");
      dispatch(updateSeason(0.8));
      var sommer = document.getElementById("sommer");
      sommer.classList.remove("årstid");
    } 
    else{
      sommer = document.getElementById("sommer");
      sommer.classList.add("årstid");
      dispatch(updateSeason(1.0));

      vinter = document.getElementById("vinter");
      vinter.classList.remove("årstid");


    }
  };

  const closeSidenav = () => {
    setIsSidenavOpen(false);
    setIsHamburgerMenuVisible(true);
  };

  const handleAdminClick = () => {
    navigate('/login');
  };

  const handleCompanyChange = (event) => {
    const company = event.target.value;
    setSelectedCompany(company);
    if (company.length > 0) {
      dispatch(addUserCar({ car: company}));
    } else {
      dispatch(resetUserCar());
    }
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
    if (carModel.length > 0) {
      dispatch(updateType({ type: carModel}));
    } else {
      dispatch(resetUserCarType());
    }
    setVersions([]);
    setSelectedCarDetails(null);
    fetch(`http://localhost:3030/ElCars/${selectedCompany}/${carModel}`)
      .then((response) => response.json())
      .then((data) => setVersions(data[0].Versions));
  };

  const handleCarVersionChange = (event) => {
    const carVersion = event.target.value;
    setSelectedCarVersion(carVersion);
    if (carVersion.length > 0) {
      dispatch(updateVersion({ version: carVersion}));
    } else {
      dispatch(resetUserCarVersion());
      dispatch(resetUserCarMaxRange());
    }

    fetch(`http://localhost:3030/ElCars/${selectedCompany}/${selectedCarModel}/${carVersion}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSelectedCarDetails(data[0]);
          updateCarDetails(data[0]);
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
        <div className="batteriMeny">
          <div className="menu-dropdown">
            <label id="rangeBatteri">Batteristrøm xx%</label>
            <label>20%</label>
            <label id="maxLevel">100%</label>
              <>
                <Form.Range className="form"
                  id="batteristrom-slider"
                  min={0.2}
                  max={1}
                  step={0.01}
                  value={batteripro}
                  onChange={(e) => changeBatteristrom(parseFloat(e.target.value))}
                />
                <label id="currentValue">{Math.round(batteripro*100)}%</label>
              </>
          </div>
          <div className="menu-dropdown">
            <label id="ladetid">Ladetid på ladestasjon</label>
            <label>5 min</label>
            <label id="maxMin">120 min</label>
              <>
                <Form.Range className="form" 
                  id="ladetid-slider"
                  min={5}
                  max={120}
                  step={1}
                  value={ladetid}
                  onChange={(e) => changeLadetid(parseInt(e.target.value))}
                />
                <label id="currentValue">{ladetid} min</label>
              </>
          </div>
          <div className="menu-dropdown">
            <label id="årstall">Årstid</label>
            <div>
              <label id="sommer" className="årstid">Sommer</label>
              <label className="switch">
                <input type="checkbox" id="sjekkInn" onChange={doBold} />
                <span className="slider round"></span>
              </label>
              <label id="vinter">Vinter</label>
            </div>
          </div>
            <div className={isActive ? 'informasjon active' : 'informasjon'} onClick={handleInfoClick}>
              <span className="infotext">
			  	<h3><p>Info</p></h3>
                <br/>
                <p>Etter valgt bil/modell/versjon så kan du endre på Batteristrøm 
                og Ladetid. Helst før du velger ladestasjoner.</p>
              </span>
          </div>
        </div>
      </div>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        {isHamburgerMenuVisible && (
          <span
            className="hamburger-meny"
            style={{ fontSize: "30px", cursor: "pointer" }}
            onClick={openSidenav}
          >
          </span>
        )}
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

