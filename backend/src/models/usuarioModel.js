const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const Usuario = {
  // Iniciar sesión
  login: async (gmail, password) => {
    const query = "SELECT * FROM usuario WHERE gmail = ?";
    const [rows] = await pool.query(query, [gmail]);

    if (rows.length === 0) return null; // Usuario no encontrado

    const usuario = rows[0];

    // Comparar la contraseña ingresada con la encriptada en la BD
    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) return null; // Contraseña incorrecta

    return usuario;
  },

  // Crear usuario (con contraseña encriptada)
  create: async ({ user, password, gmail, rol }) => {
    const salt = await bcrypt.genSalt(10); // Genera un "sal" para la encriptación
    const hashedPassword = await bcrypt.hash(password, salt); // Encripta la contraseña

    const query =
      "INSERT INTO usuario (user, password, gmail, rol) VALUES (?, ?, ?, ?)";
    const [result] = await pool.query(query, [user, hashedPassword, gmail, rol]);
    return result.insertId;
  },

  // Modificar usuario (si cambia la contraseña, la encripta de nuevo)
  update: async (id, { user, password, gmail, rol }) => {
    let query, values;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query =
        "UPDATE usuario SET user = ?, password = ?, gmail = ?, rol = ? WHERE id = ?";
      values = [user, hashedPassword, gmail, rol, id];
    } else {
      query =
        "UPDATE usuario SET user = ?, gmail = ?, rol = ? WHERE id = ?";
      values = [user, gmail, rol, id];
    }

    await pool.query(query, values);
    return true;
  },

  // Eliminar usuario (borrado lógico)
  delete: async (id) => {
    const query = "UPDATE usuario SET status = 0 WHERE id = ?";
    await pool.query(query, [id]);
    return true;
  },
};

module.exports = Usuario;
