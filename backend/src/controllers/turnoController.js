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
      return res.status(400).json({ 
        error: "Lista de turnos inválida o vacía" 
      });
    }

    // Validar que los turnos tengan la estructura esperada
    const requiredFields = ['pharmacy_id', 'pharmacy_name', 'pharmacy_code', 'shift_date', 'owner_name', 'owner_email'];
    const invalidTurnos = turnos.some(turno => 
      !requiredFields.every(field => turno.hasOwnProperty(field))
    );
    
    if (invalidTurnos) {
      return res.status(400).json({ 
        error: "Uno o más turnos no tienen la estructura esperada" 
      });
    }

    const resultado = await turnoModel.enviarCorreosOwners(turnos);
    
    if (!resultado.success) {
      return res.status(500).json(resultado);
    }

    res.json(resultado);
  } catch (error) {
    console.error("Error en enviarCorreosTurnos:", error);
    res.status(500).json({ 
      error: "Error al enviar correos",
      details: error.message 
    });
  }
};

const enviarCorreosOwners = async (turnos) => {
  try {
    const resultados = [];

    for (const turno of turnos) {
      const mailOptions = {
        from: process.env.OUTLOOK_USER,
        to: turno.owner_email,
        subject: `Turno asignado - ${turno.pharmacy_name}`,
        html: `
          <p>Hola ${turno.owner_name},</p>
          <p>Tienes un turno asignado el día <strong>${new Date(turno.shift_date).toLocaleDateString()}</strong> para la farmacia <strong>${turno.pharmacy_name}</strong> (Código: ${turno.pharmacy_code}).</p>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      resultados.push({ email: turno.owner_email, enviado: info.accepted.includes(turno.owner_email) });
    }

    return { success: true, detalles: resultados };
  } catch (error) {
    console.error('Error al enviar correos:', error);
    return { success: false, error: error.message };
  }
};


module.exports = {
  getTurnosEsteMes,
  getTurnosFiltrados,
  enviarCorreosTurnos,
  enviarCorreosOwners
};