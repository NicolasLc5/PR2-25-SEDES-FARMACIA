import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import icono from "../assets/pharmacy-icon.png"; // Ícono para los pines

// Ícono personalizado para las farmacias
const pharmacyIcon = new L.Icon({
  iconUrl: icono,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

function Home() {
  const [farmacias, setFarmacias] = useState([]);
  const [selectedFarmacia, setSelectedFarmacia] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener todas las farmacias (solo nombre, latitud, longitud)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/farmacias")
      .then((response) => {
        setFarmacias(response.data);
      })
      .catch((error) => console.error("Error al obtener farmacias:", error));
  }, []);

  // Obtener detalles cuando se selecciona una farmacia
  const handleSelectFarmacia = (farmacia) => {
    axios
      .get(`http://localhost:5000/api/farmacias/${farmacia.id}`)
      .then((response) => {
        setSelectedFarmacia(response.data);
      })
      .catch((error) => console.error("Error al obtener detalles de la farmacia:", error));
  };

  // Filtrar farmacias según el término de búsqueda
  const filteredFarmacias = farmacias.filter((farmacia) =>
    farmacia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary">Bienvenido a Sedes Farmacias</h1>
      <p className="text-center">Encuentra farmacias fácilmente en el mapa.</p>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar farmacias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Secciones */}
      <div className="row">
        {/* Sección de detalles */}
        <div className="col-md-3 bg-light p-3">
          <h5>Información</h5>
          {selectedFarmacia ? (
            <div>
              <h6>{selectedFarmacia.nombre}</h6>
              <p>{selectedFarmacia.autorizada ? "Autorizada" : "No autorizada"}</p>
              {selectedFarmacia.imagen && (
                <img
                src={selectedFarmacia.imagen} // Ya contiene el prefijo correcto
                alt="Farmacia"
                className="img-fluid rounded"
              />
              )}
              <p><strong>Horario:</strong></p>
              <ul>
                {selectedFarmacia.horarios?.map((h, index) => (
                  <li key={index}>
                    {h.apertura} - {h.cierre}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Selecciona una farmacia para ver más detalles.</p>
          )}
        </div>

        {/* Sección del mapa */}
        <div className="col-md-6 p-3" style={{ height: "400px" }}>
          <MapContainer center={[-17.3934, -66.1451]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredFarmacias.map((farmacia) => {
              const latitud = parseFloat(farmacia.latitud);
              const longitud = parseFloat(farmacia.longitud);

              if (isNaN(latitud) || isNaN(longitud)) {
                console.error(`Coordenadas inválidas para ${farmacia.nombre}:`, farmacia.latitud, farmacia.longitud);
                return null;
              }

              return (
                <Marker
                  key={farmacia.id}
                  position={[latitud, longitud]}
                  icon={pharmacyIcon}
                  eventHandlers={{
                    click: () => handleSelectFarmacia(farmacia),
                  }}
                >
                  <Popup>{farmacia.nombre}</Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Sección de filtros */}
        <div className="col-md-3 bg-light p-3">
          <h5>Filtros</h5>
          <button className="btn btn-primary w-100 mb-2">Abiertas</button>
          <button className="btn btn-primary w-100 mb-2">Cercanas</button>
          <button className="btn btn-primary w-100">24 Horas</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
