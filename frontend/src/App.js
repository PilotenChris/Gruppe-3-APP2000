import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./Layout.js"
import Home from "./Home.js"
import Unkownpage from "./Unkownpage.js"
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/*" element={<Unkownpage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
