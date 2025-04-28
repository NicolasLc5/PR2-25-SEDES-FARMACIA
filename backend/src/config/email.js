const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Usamos el servicio Gmail
  auth: {
    user: process.env.OUTLOOK_USER,
    pass: process.env.OUTLOOK_PASSWORD
  }
});

// Verificar conexión
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('✅ Servidor de Gmail listo para enviar mensajes');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con Gmail:', error);
    return false;
  }
};

verifyTransporter();
setInterval(verifyTransporter, 3600000);

module.exports = transporter;
