const Codigo = require("../models/codigoModel");

const getAllCodigos = async (req, res) => {
  try {
    const codigos = await Codigo.getCodigos();
    res.json(codigos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los códigos" });
  }
};

module.exports = { getAllCodigos };
