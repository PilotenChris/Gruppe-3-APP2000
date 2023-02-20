import React, { useState, useEffect } from "react";
import "./Sidenav.css";

const Sidenav = (props) => {
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [carModels, setCarModels] = useState([]);
  const [selectedCarModel, setSelectedCarModel] = useState("");
  const [versions, setVersions] = useState([]);

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

  const handleCompanyChange = (event) => {
    const company = event.target.value;
    setSelectedCompany(company);
    setSelectedCarModel("");
    setVersions([]);
    fetch(`http://localhost:3030/ElCars/${company}`)
      .then((response) => response.json())
      .then((data) => setCarModels(data));
  };

  const handleCarModelChange = (event) => {
    const carModel = event.target.value;
    setSelectedCarModel(carModel);
    setVersions([]);
    fetch(`http://localhost:3030/ElCars/${selectedCompany}/${carModel}`)
      .then((response) => response.json())
      .then((data) => setVersions(data[0].Versions));
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
            <select className="menu-dropdown">
              <option value="">Versjon</option>
              {versions.map((version) => (
                <option key={version} value={version}>
                  {version}
                  </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <span
          style={{ fontSize: "30px", cursor: "pointer" }}
          onClick={openSidenav}
        >
          &#9776;
        </span>
        <div className="App" style={{ height: "100%", width: "100%" }}>
          {props.children}
        </div>
      </div>
    </>
  );
};

export default Sidenav;
