const Sustancias = require("../models/sustanciasModel");

const getAllSustancias = async (req, res) => {
  try {
    const sustancias = await Sustancias.getSustancias();
    res.json(sustancias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las sustancias controladas" });
  }
};

module.exports = { getAllSustancias };
