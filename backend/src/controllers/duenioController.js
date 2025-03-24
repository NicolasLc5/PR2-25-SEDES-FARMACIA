const Duenio = require("../models/duenioModel");

const getAllDuenios = async (req, res) => {
  try {
    const duenios = await Duenio.getDuenios();
    res.json(duenios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los dueños" });
  }
};

const getDuenio = async (req, res) => {
  try {
    const duenio = await Duenio.getDuenioById(req.params.id);
    if (!duenio) return res.status(404).json({ error: "Dueño no encontrado" });
    res.json(duenio);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el dueño" });
  }
};

const createDuenio = async (req, res) => {
  try {
    const id = await Duenio.createDuenio(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el dueño" });
  }
};

const updateDuenio = async (req, res) => {
  try {
    const success = await Duenio.updateDuenio(req.params.id, req.body);
    if (!success) return res.status(404).json({ error: "Dueño no encontrado" });
    res.json({ message: "Dueño actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el dueño" });
  }
};

const deleteDuenio = async (req, res) => {
  try {
    const success = await Duenio.deleteDuenio(req.params.id);
    if (!success) return res.status(404).json({ error: "Dueño no encontrado" });
    res.json({ message: "Dueño eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el dueño" });
  }
};

module.exports = { getAllDuenios, getDuenio, createDuenio, updateDuenio, deleteDuenio };
