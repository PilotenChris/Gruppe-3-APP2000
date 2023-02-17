import React, { useState } from "react";
import "./Sidenav.css";

const Sidenav = (props) => {
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);

  const openSidenav = () => {
    setIsSidenavOpen(true);
  };

  const closeSidenav = () => {
    setIsSidenavOpen(false);
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
        <a href="javascript:void(0)" className="closebtn" onClick={closeSidenav}>
          &times;
        </a>
        <div className="menu-container">
          <select className="menu-dropdown">
            <option value="Firma">Firma</option>
          </select>
        </div>
        <div className="menu-container">
          <select className="menu-dropdown">
            <option value="Bil">Bil</option>
          </select>
        </div>
        <div className="menu-container">
          <select className="menu-dropdown">
            <option value="Batteri">Batteri</option>
          </select>
        </div>
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
