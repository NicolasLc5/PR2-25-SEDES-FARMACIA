import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Duenio from "./pages/Duenio";
import Farmacias from "./pages/Farmacias";
import PrivateRoute from "./components/PrivateRoute";
import Turnos from "./pages/Turnos";

function App() {
  return (
    <Router>
      
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/farmacias" element={<Farmacias />} />
          <Route path="/duenio" element={<Duenio />} />
          <Route path="/turnos" element={<Turnos />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
