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
        f.status,
        CASE 
            WHEN f.sectorType = '0' THEN 'Privada' 
            WHEN f.sectorType = '1' THEN 'Pública' 
            ELSE 'Desconocido' 
        END AS sectorType, 
        f.image,
        cs.name AS controlledSubstance
    FROM pharmacy f
    LEFT JOIN controlledsubstances cs ON f.ControlledSubstances_id = cs.id AND cs.status = 1
    WHERE f.id = ?;`,
    [id]
  );
  return rows[0] || null;
};



// Crear nueva farmacia
const createFarmacia = async (data) => {
  const {
    name, recordNumber, address, latitude, longitude, businessName,
    nit, Zone_id, Owner_id, Code_id, User_id, image, openingHours, sectorType
  } = data;
  
  const [result] = await db.execute(
    `INSERT INTO pharmacy (name, recordNumber, address, latitude, longitude, businessName,
     nit, Zone_id, Owner_id, Code_id, User_id, image, openingHours, sectorType)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, recordNumber, address, latitude, longitude, businessName,
    nit, Zone_id, Owner_id, Code_id, User_id, image, openingHours, sectorType]
  );
  return result.insertId;
};

// Actualizar farmacia
const updateFarmacia = async (id, data) => {
  const {
    name, recordNumber, address, latitude, longitude, image, openingHours, sectorType
  } = data;

  const [result] = await db.execute(
    `UPDATE pharmacy SET name=?, recordNumber=?, address=?, latitude=?, longitude=?, 
    image=?, openingHours=?, sectorType=? WHERE id=?`,
    [name, recordNumber, address, latitude, longitude, image, openingHours, sectorType, id]
  );
  return result.affectedRows > 0;
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
