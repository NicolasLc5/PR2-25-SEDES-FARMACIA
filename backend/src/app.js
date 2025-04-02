const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Importar rutas
const farmaciaRoutes = require("./routes/farmaciaRoutes");
const codigoRoutes = require("./routes/codigoRoutes");
const zonaRoutes = require("./routes/zonaRoutes");
const sustanciasRoutes = require("./routes/sustanciasRoutes");
const duenioRoutes = require("./routes/duenioRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const turnoRoutes = require("./routes/turnoRoutes");

// Usar rutas
app.use("/api/farmacias", farmaciaRoutes);
app.use("/api/codigos", codigoRoutes);
app.use("/api/zonas", zonaRoutes);
app.use("/api/sustancias", sustanciasRoutes);
app.use("/api/duenios", duenioRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/turnos", turnoRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de Sedes Farmacias");
});

module.exports = app;
