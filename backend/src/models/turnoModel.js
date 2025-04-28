const db = require("../config/db");
const transporter = require("../config/email");

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
  try {
    // Agrupar turnos por dueño (para no enviar múltiples correos a la misma persona)
    const turnosPorOwner = {};
    
    turnos.forEach(turno => {
      if (!turnosPorOwner[turno.owner_email]) {
        turnosPorOwner[turno.owner_email] = {
          owner_name: turno.owner_name,
          turnos: []
        };
      }
      turnosPorOwner[turno.owner_email].turnos.push(turno);
    });

    // Preparar y enviar los correos
    const resultados = await Promise.all(
      Object.entries(turnosPorOwner).map(async ([email, data]) => {
        try {
          const { owner_name, turnos } = data;
          
          // Formatear las fechas de los turnos
          const turnosFormateados = turnos.map(t => ({
            ...t,
            shift_date: new Date(t.shift_date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }));

          // Crear el contenido HTML del correo
          const htmlContent = `
            <h2>Estimado/a ${owner_name},</h2>
            <p>A continuación se detallan los turnos asignados a sus farmacias:</p>
            
            <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
              <thead>
                <tr>
                  <th>Farmacia</th>
                  <th>Código</th>
                  <th>Fecha del Turno</th>
                </tr>
              </thead>
              <tbody>
                ${turnosFormateados.map(turno => `
                  <tr>
                    <td>${turno.pharmacy_name}</td>
                    <td>${turno.pharmacy_code}</td>
                    <td>${turno.shift_date}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <p>Por favor, asegúrese de cumplir con los turnos asignados.</p>
            <p>Atentamente,<br>El equipo de gestión de turnos</p>
          `;

          // Configurar el correo
          const mailOptions = {
            from: '"Gestión de Turnos" <turnos@farmacias.com>',
            to: email,
            subject: 'Turnos asignados a sus farmacias',
            html: htmlContent
          };

          // Enviar el correo
          await transporter.sendMail(mailOptions);
          return { email, success: true };
        } catch (error) {
          console.error(`Error al enviar correo a ${email}:`, error);
          return { email, success: false, error: error.message };
        }
      })
    );

    // Calcular estadísticas de envío
    const exitosos = resultados.filter(r => r.success).length;
    const fallidos = resultados.filter(r => !r.success);
    
    return {
      success: true,
      message: `Correos enviados: ${exitosos} exitosos, ${fallidos.length} fallidos`,
      total: resultados.length,
      exitosos,
      fallidos,
      detalles: resultados
    };
  } catch (error) {
    console.error("Error en enviarCorreosOwners:", error);
    return {
      success: false,
      message: "Error general al enviar correos",
      error: error.message
    };
  }
};

module.exports = {
  getTurnosEsteMes,
  getTurnosFiltrados,
  enviarCorreosOwners
};