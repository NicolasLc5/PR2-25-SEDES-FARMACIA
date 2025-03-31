import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import icono from "../assets/pharmacy-icon.png";

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
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    let url = "http://localhost:5000/api/farmacias";
    if (filtro) url += `/filtradas?filtro=${filtro}`;

    axios
      .get(url)
      .then((response) => {
        setFarmacias(response.data);
      })
      .catch((error) => console.error("Error al obtener farmacias:", error));
  }, [filtro]);

  const handleSelectFarmacia = (farmacia) => {
    axios
      .get(`http://localhost:5000/api/farmacias/${farmacia.id}`)
      .then((response) => {
        setSelectedFarmacia(response.data);
      })
      .catch((error) => console.error("Error al obtener detalles de la farmacia:", error));
  };

  const farmaciasFiltradas = farmacias.filter((farmacia) =>
    farmacia.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary">Bienvenido a Sedes Farmacias</h1>
      <p className="text-center">Encuentra farmacias fácilmente en el mapa.</p>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar farmacias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row">
        <div className="col-md-3 bg-light p-3">
          <h5>Información</h5>
          {selectedFarmacia ? (
            <div>
              <h6>{selectedFarmacia.name}</h6>
              <p><strong>Sector:</strong> {selectedFarmacia.sectorType}</p>
              {selectedFarmacia.image && (
                <img src={selectedFarmacia.image} alt="Farmacia" className="img-fluid rounded" />
              )}
              <p><strong>Horario:</strong> {selectedFarmacia.openingHours || "No disponible"}</p>
              <p>
                <strong>Sustancia Controlada:</strong> {selectedFarmacia.controlledSubstance || "Ninguna"}
              </p>
            </div>
          ) : (
            <p>Selecciona una farmacia para ver más detalles.</p>
          )}
        </div>

        <div className="col-md-6 p-3" style={{ height: "400px" }}>
          <MapContainer center={[-17.3934, -66.1451]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {farmaciasFiltradas.map((farmacia) => {
              const latitud = parseFloat(farmacia.latitude);
              const longitud = parseFloat(farmacia.longitude);

              if (isNaN(latitud) || isNaN(longitud)) {
                console.error(`Coordenadas inválidas para ${farmacia.name}:`, latitud, longitud);
                return null;
              }

              return (
                <Marker
                  key={farmacia.id}
                  position={[latitud, longitud]}
                  icon={pharmacyIcon}
                  eventHandlers={{ click: () => handleSelectFarmacia(farmacia) }}
                >
                  <Popup>{farmacia.name}</Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        <div className="col-md-3 bg-light p-3">
          <h5>Filtros</h5>
          <button className="btn btn-primary w-100 mb-2" onClick={() => setFiltro("")}>Todas</button>
          <button className="btn btn-primary w-100 mb-2" onClick={() => setFiltro("con_sustancias")}>
            Farmacias Autorizadas para Dispensar Medicamentos Controlados
          </button>
          <button className="btn btn-primary w-100" onClick={() => setFiltro("turno_hoy")}>
            Farmacias de Turno
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;