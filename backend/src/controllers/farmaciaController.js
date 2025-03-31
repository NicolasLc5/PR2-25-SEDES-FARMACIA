const farmaciaModel = require("../models/farmaciaModel");

// Obtener todas las farmacias
const getFarmacias = async (req, res) => {
  try {
    const farmacias = await farmaciaModel.getFarmacias();
    res.json(farmacias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las farmacias" });
  }
};

// Obtener detalles de una farmacia
const getFarmaciaById = async (req, res) => {
  try {
    const { id } = req.params;
    const farmacia = await farmaciaModel.getFarmaciaById(id);
    if (!farmacia) return res.status(404).json({ error: "Farmacia no encontrada aaaa" });
    res.json(farmacia);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la farmacia" });
  }
};

// Crear una nueva farmacia
const createFarmacia = async (req, res) => {
  try {
    const newFarmaciaId = await farmaciaModel.createFarmacia(req.body);
    res.status(201).json({ id: newFarmaciaId, message: "Farmacia creada con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la farmacia" });
  }
};

// Editar una farmacia
const updateFarmacia = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await farmaciaModel.updateFarmacia(id, req.body);
    if (!updated) return res.status(404).json({ error: "Farmacia no encontrada" });
    res.json({ message: "Farmacia actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la farmacia" });
  }
};

// Eliminar una farmacia
const deleteFarmacia = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await farmaciaModel.deleteFarmacia(id);
    if (!deleted) return res.status(404).json({ error: "Farmacia no encontrada" });
    res.json({ message: "Farmacia eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la farmacia" });
  }
};
const getFarmaciasFiltradas = async (req, res) => {
  try {
    const { filtro } = req.query;
    
    if (!filtro) {
      return res.status(400).json({ error: "Parámetro 'filtro' es requerido" });
    }

    const farmacias = await farmaciaModel.getFarmaciasFiltradas(filtro);
    res.json(farmacias);
    
  } catch (error) {
    console.error("Error en getFarmaciasFiltradas:", error);
    res.status(500).json({ error: "Error al obtener farmacias filtradas" });
  }
};
module.exports = { getFarmacias, getFarmaciaById, createFarmacia, updateFarmacia, deleteFarmacia, getFarmaciasFiltradas };
