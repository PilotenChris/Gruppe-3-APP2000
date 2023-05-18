import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./Home.js"
import Unkownpage from "./Unkownpage.js"
import './App.css';
import AdminLogin from "./AdminLogin.js";
import AdminPage from "./AdminPage.js"
import CreateAdmin from "./CreateAdmin.js"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin-page" element={<AdminPage />} />
          <Route path="/admin-page/create-admin" element={<CreateAdmin/>}/>
          <Route path="/*" element={<Unkownpage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
