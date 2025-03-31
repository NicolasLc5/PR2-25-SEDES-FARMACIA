const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const Usuario = {
  // Iniciar sesión
  login: async (gmail, password) => {
    
    const query = "SELECT * FROM user WHERE gmail = ? AND status = 1";
    const [rows] = await pool.query(query, [gmail]);
    
    
    if (rows.length === 0) {
      return null;
    }
  
    const user = rows[0];
    
    // Comparar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return null;
    }
  
    return user;
  },
  // Obtener todos los usuarios activos
  getAll: async () => {
    const query = "SELECT id, username, gmail, rol FROM user WHERE status = 1";
    const [rows] = await pool.query(query);
    return rows;
  },

  // Crear usuario con contraseña encriptada
  create: async ({ username, password, gmail, rol }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO user (username, password, gmail, rol) VALUES (?, ?, ?, ?)";
    const [result] = await pool.query(query, [username, hashedPassword, gmail, rol]);
    return result.insertId;
  },

  // Modificar usuario (opcionalmente cambiar contraseña)
  update: async (id, { username, password, gmail, rol }) => {
    let query, values;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = "UPDATE user SET username = ?, password = ?, gmail = ?, rol = ? WHERE id = ?";
      values = [username, hashedPassword, gmail, rol, id];
    } else {
      query = "UPDATE user SET username = ?, gmail = ?, rol = ? WHERE id = ?";
      values = [username, gmail, rol, id];
    }

    await pool.query(query, values);
    return true;
  },

  // Eliminar usuario (borrado lógico)
  delete: async (id) => {
    const query = "UPDATE user SET status = 0 WHERE id = ?";
    await pool.query(query, [id]);
    return true;
  },
};

module.exports = Usuario;
