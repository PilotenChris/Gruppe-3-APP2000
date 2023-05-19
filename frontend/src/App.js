import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./Home.js"
import Unkownpage from "./Unkownpage.js"
import './App.css';
import AdminLogin from "./AdminLogin.js";
import AdminPage from "./AdminPage.js"
import CreateAdmin from "./CreateAdmin.js"
import Insert from "./AdminPages/Insert.js"
import Update from "./AdminPages/Update.js"
import Delete from "./AdminPages/Delete.js"
import ShowDatabase from "./AdminPages/ShowDatabase.js"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin-page" element={<AdminPage />} />
          <Route path="/admin-page/create-admin" element={<CreateAdmin/>}/>
          <Route path="/admin-page/insert" element={<Insert/>}/>
          <Route path="/admin-page/update" element={<Update/>}/>
          <Route path="/admin-page/delete" element={<Delete/>}/>
          <Route path="/admin-page/show-database" element={<ShowDatabase/>}/>
          <Route path="/*" element={<Unkownpage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
