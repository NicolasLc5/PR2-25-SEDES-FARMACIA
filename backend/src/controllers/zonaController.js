const Zona = require("../models/zonaModel");

const getAllZonas = async (req, res) => {
  try {
    const zonas = await Zona.getZonas();
    res.json(zonas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las zonas" });
  }
};

module.exports = { getAllZonas };
