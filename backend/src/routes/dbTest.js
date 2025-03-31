const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Ruta para probar la conexión a la base de datos
router.get("/test-db", async (req, res) => {
  try {
    
    await db.execute("SELECT 1"); // Consulta simple para verificar conexión
    res.status(200).json({ message: "Conexión a la base de datos exitosa" });
  } catch (error) {
    console.error("Error en la conexión a la base de datos:", error);
    res.status(500).json({ error: "Error en la conexión a la base de datos" });
  }
});

module.exports = router;
