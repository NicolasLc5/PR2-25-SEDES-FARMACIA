const db = require("../config/db");

// Obtener farmacias para el mapa (solo id, nombre, latitud, longitud, y activas)
const getFarmacias = async () => {
  const [rows] = await db.execute(`
    SELECT 
      p.id, 
      p.name, 
      p.address, 
      p.openingHours,
      p.latitude,
      p.longitude, 
      z.name AS zone_name, 
      d.name AS owner_name
    FROM pharmacy p
    LEFT JOIN zone z ON p.zone_id = z.id
    LEFT JOIN owner d ON p.owner_id = d.id
    WHERE p.status = 1
  `);
  return rows;
};

// Obtener detalles de una farmacia con sustancias controladas activas
const getFarmaciaById = async (id) => {
  const [rows] = await db.execute(
    `SELECT 
        f.name, 
        f.address, 
        f.openingHours,
        f.latitude,
        f.longitude,
        f.recordNumber,
        f.businessName,
        f.nit,
        f.Code_id,
        f.User_id,
        f.Zone_id,
        f.Owner_id,
        f.ControlledSubstances_id,
        f.status,
        f.sectorType,
        f.image,
        cs.name AS controlledSubstance
    FROM pharmacy f
    LEFT JOIN controlledsubstances cs ON f.ControlledSubstances_id = cs.id AND cs.status = 1
    WHERE f.id = ?;`,
    [id]
  );
  if (rows[0]) {
    const farmacia = rows[0];
    // Convertir BLOB a Base64 si existe imagen
    if (farmacia.image && farmacia.image instanceof Buffer) {
      farmacia.image = `data:image/jpeg;base64,${farmacia.image.toString('base64')}`;
    }
    return farmacia;
  }
  return rows[0] || null;
};

// Crear nueva farmacia
const createFarmacia = async (data) => {
  const {
    name, recordNumber, address, latitude, longitude, businessName,
    nit, Zone_id, Owner_id, Code_id, User_id, image, openingHours, sectorType,
    ControlledSubstances_id // Valor por defecto si no se especifica
  } = data;
  
  try {
    const [result] = await db.execute(
      `INSERT INTO pharmacy (
        name, recordNumber, address, latitude, longitude, businessName,
        nit, Zone_id, Owner_id, Code_id, User_id, image, openingHours, sectorType,
        ControlledSubstances_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        recordNumber, 
        address, 
        latitude.toString(), // Convertir a string como espera la BD
        longitude.toString(), // Convertir a string como espera la BD
        businessName, 
        nit,
        Zone_id,
        Owner_id,
        Code_id,
        User_id,
        image,
        openingHours, 
        sectorType,
        ControlledSubstances_id
      ]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error en createFarmacia model:', {
      message: error.message,
      sqlMessage: error.sqlMessage,
      sql: error.sql,
      stack: error.stack
    });
    throw error;
  }
};

// Actualizar farmacia
// Actualizar farmacia
const updateFarmacia = async (id, data) => {
  const {
    name, recordNumber, address, latitude, longitude, businessName,
    nit, Zone_id, Owner_id, Code_id, User_id, image, openingHours, 
    sectorType, ControlledSubstances_id
  } = data;

  try {
    const [result] = await db.execute(
      `UPDATE pharmacy SET 
        name=?, 
        recordNumber=?, 
        address=?, 
        latitude=?, 
        longitude=?, 
        businessName=?,
        nit=?,
        Zone_id=?,
        Owner_id=?,
        Code_id=?,
        User_id=?,
        image=?, 
        openingHours=?, 
        sectorType=?,
        ControlledSubstances_id=?
      WHERE id=?`,
      [
        name, 
        recordNumber, 
        address, 
        latitude, 
        longitude, 
        businessName,
        nit,
        Zone_id,
        Owner_id,
        Code_id,
        User_id,
        image, 
        openingHours, 
        sectorType,
        ControlledSubstances_id,
        id
      ]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error en updateFarmacia model:', error);
    throw error;
  }
};

// Eliminar farmacia (cambiar status a 0)
const deleteFarmacia = async (id) => {
  const [result] = await db.execute(
    "UPDATE pharmacy SET status = 0 WHERE id = ?", 
    [id]
  );
  return result.affectedRows > 0;
};
const getFarmaciasFiltradas = async (filtro) => {
  let query = `
    SELECT 
      p.id, 
      p.name, 
      p.latitude, 
      p.longitude, 
      p.openingHours, 
      cs.name AS controlledSubstance
    FROM pharmacy p
    LEFT JOIN controlledsubstances cs ON p.ControlledSubstances_id = cs.id
    WHERE p.status = 1
  `;

  if (filtro === "turno_hoy") {
    query += `
      AND EXISTS (
        SELECT 1 FROM pharmacy_shift ps
        JOIN shift s ON ps.shift_id = s.id
        WHERE ps.pharmacy_id = p.id
        AND DATE(s.dayshift) = CURDATE()
      )
    `;
  } else if (filtro === "con_sustancias") {
    query += " AND cs.name IS NOT NULL AND cs.name != 'Ninguna'";
  }

  const [rows] = await db.execute(query);
  return rows;
};


module.exports = { getFarmacias, getFarmaciaById, createFarmacia, updateFarmacia, deleteFarmacia,getFarmaciasFiltradas };
