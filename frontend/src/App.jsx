import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Farmacias from "./pages/Farmacias";
import PrivateRoute from "./components/PrivateRoute";

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
