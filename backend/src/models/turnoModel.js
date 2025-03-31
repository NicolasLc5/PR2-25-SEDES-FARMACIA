const db = require("../config/db");

const getTurnosEsteMes = async () => {
  const [rows] = await db.execute(`
    SELECT 
      p.id AS pharmacy_id,
      p.name AS pharmacy_name,
      c.name AS pharmacy_code,
      s.dayShift AS shift_date,
      o.name AS owner_name,
      o.gmail AS owner_email
    FROM pharmacy p
    INNER JOIN code c ON p.Code_id = c.id
    INNER JOIN pharmacy_shift ps ON p.id = ps.Pharmacy_id
    INNER JOIN shift s ON ps.Shift_id = s.id
    INNER JOIN owner o ON p.owner_id = o.id
    WHERE p.status = 1
      AND c.status = 1
      AND s.status = 1
      AND MONTH(s.dayShift) = MONTH(CURDATE())
      AND YEAR(s.dayShift) = YEAR(CURDATE())
    ORDER BY s.dayShift ASC
  `);
  return rows;
};

const getTurnosFiltrados = async (filtro) => {
  let query = `
    SELECT 
      p.id AS pharmacy_id,
      p.name AS pharmacy_name,
      c.name AS pharmacy_code,
      s.dayShift AS shift_date,
      o.name AS owner_name,
      o.gmail AS owner_email
    FROM pharmacy p
    INNER JOIN code c ON p.Code_id = c.id
    INNER JOIN pharmacy_shift ps ON p.id = ps.Pharmacy_id
    INNER JOIN shift s ON ps.Shift_id = s.id
    INNER JOIN owner o ON p.owner_id = o.id
    WHERE p.status = 1
      AND c.status = 1
      AND s.status = 1
  `;

  if (filtro.codigo) {
    query += ` AND c.name = '${filtro.codigo}'`;
  }
  
  if (filtro.mes) {
    query += ` AND MONTH(s.dayShift) = ${filtro.mes} AND YEAR(s.dayShift) = YEAR(CURDATE())`;
  }

  query += ` ORDER BY s.dayShift ASC`;

  const [rows] = await db.execute(query);
  return rows;
};

const enviarCorreosOwners = async (turnos) => {
  // Aquí implementarías la lógica de envío de correos
  // Esto es un ejemplo básico, deberías integrar con nodemailer o similar
  const emails = turnos.map(t => t.owner_email);
  console.log(`Enviando correos a: ${emails.join(', ')}`);
  
  return {
    success: true,
    message: `Correos enviados a ${emails.length} propietarios`,
    emails
  };
};

module.exports = {
  getTurnosEsteMes,
  getTurnosFiltrados,
  enviarCorreosOwners
};