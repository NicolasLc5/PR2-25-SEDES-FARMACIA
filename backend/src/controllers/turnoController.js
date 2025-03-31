const turnoModel = require("../models/turnoModel");

const getTurnosEsteMes = async (req, res) => {
  try {
    const turnos = await turnoModel.getTurnosEsteMes();
    res.json(turnos);
  } catch (error) {
    console.error("Error en getTurnosEsteMes:", error);
    res.status(500).json({ error: "Error al obtener los turnos" });
  }
};

const getTurnosFiltrados = async (req, res) => {
  try {
    const { codigo, mes } = req.query;
    
    if (!codigo && !mes) {
      return res.status(400).json({ 
        error: "Debe proporcionar al menos un filtro (codigo o mes)" 
      });
    }

    const turnos = await turnoModel.getTurnosFiltrados({ codigo, mes });
    res.json(turnos);
  } catch (error) {
    console.error("Error en getTurnosFiltrados:", error);
    res.status(500).json({ error: "Error al filtrar turnos" });
  }
};

const enviarCorreosTurnos = async (req, res) => {
  try {
    const { turnos } = req.body;
    
    if (!turnos || !Array.isArray(turnos) || turnos.length === 0) {
      return res.status(400).json({ error: "Lista de turnos inválida" });
    }

    const resultado = await turnoModel.enviarCorreosOwners(turnos);
    res.json(resultado);
  } catch (error) {
    console.error("Error en enviarCorreosTurnos:", error);
    res.status(500).json({ error: "Error al enviar correos" });
  }
};

module.exports = {
  getTurnosEsteMes,
  getTurnosFiltrados,
  enviarCorreosTurnos
};