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
    
    const { image, ...rest } = req.body;
    let imageBuffer = null;

    // Procesar imagen
    if (image && typeof image === 'string') {
      const base64Data = image.startsWith('data:image/') 
        ? image.split(',')[1] 
        : image;
      imageBuffer = Buffer.from(base64Data, 'base64');
    }

    // Validar campos requeridos
    const requiredFields = [
      'name', 'recordNumber', 'address', 'latitude', 'longitude',
      'businessName', 'nit', 'Zone_id', 'Owner_id', 'Code_id', 'User_id'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: "Campos requeridos faltantes",
        missingFields 
      });
    }

    const farmaciaData = {
      ...rest,
      image: imageBuffer,
      ControlledSubstances_id: req.body.ControlledSubstances_id || 1 // Valor por defecto
    };

    const newFarmaciaId = await farmaciaModel.createFarmacia(farmaciaData);
    res.status(201).json({ id: newFarmaciaId, message: "Farmacia creada con éxito" });
  } catch (error) {
    console.error('Error detallado en createFarmacia:', {
      message: error.message,
      stack: error.stack,
      sqlMessage: error.sqlMessage || 'No SQL error'
    });
    res.status(500).json({ 
      error: "Error al crear la farmacia",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      sqlError: process.env.NODE_ENV === 'development' ? error.sqlMessage : undefined
    });
  }
};

// Editar una farmacia
// Editar una farmacia
const updateFarmacia = async (req, res) => {
  try {
    console.log('Datos recibidos en updateFarmacia:', req.body);
    
    const { id } = req.params;
    const { image, ...rest } = req.body;
    let imageBuffer = null;

    // Procesar imagen
    if (image && typeof image === 'string') {
      const base64Data = image.startsWith('data:image/') 
        ? image.split(',')[1] 
        : image;
      imageBuffer = Buffer.from(base64Data, 'base64');
    }

    // Validar campos requeridos
    const requiredFields = [
      'name', 'recordNumber', 'address', 'latitude', 'longitude',
      'businessName', 'nit', 'Zone_id', 'Owner_id', 'Code_id', 'User_id'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: "Campos requeridos faltantes",
        missingFields 
      });
    }

    const farmaciaData = {
      ...rest,
      image: imageBuffer,
      ControlledSubstances_id: req.body.ControlledSubstances_id || null // Manejar valor vacío
    };

    const updated = await farmaciaModel.updateFarmacia(id, farmaciaData);
    if (!updated) return res.status(404).json({ error: "Farmacia no encontrada" });
    res.json({ message: "Farmacia actualizada correctamente" });
  } catch (error) {
    console.error('Error detallado en updateFarmacia:', {
      message: error.message,
      stack: error.stack,
      sqlMessage: error.sqlMessage || 'No SQL error'
    });
    res.status(500).json({ 
      error: "Error al actualizar la farmacia",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      sqlError: process.env.NODE_ENV === 'development' ? error.sqlMessage : undefined
    });
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
