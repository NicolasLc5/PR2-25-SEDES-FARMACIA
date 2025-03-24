const db = require("../config/db");

// Obtener todos los dueños
const getDuenios = async () => {
  const [rows] = await db.execute("SELECT * FROM duenio WHERE status = 1");
  return rows;
};

// Obtener un dueño por ID
const getDuenioById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM duenio WHERE id = ? AND status = 1", [id]);
  return rows[0];
};

// Crear un nuevo dueño
const createDuenio = async (data) => {
  const { nombre, apellido_paterno, apellido_materno, ci, nit, celular, gmail } = data;
  const [result] = await db.execute(
    "INSERT INTO duenio (nombre, apellido_paterno, apellido_materno, ci, nit, celular, gmail) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nombre, apellido_paterno, apellido_materno, ci, nit, celular, gmail]
  );
  return result.insertId;
};

// Editar un dueño
const updateDuenio = async (id, data) => {
  const { nombre, apellido_paterno, apellido_materno, ci, nit, celular, gmail } = data;
  const [result] = await db.execute(
    "UPDATE duenio SET nombre=?, apellido_paterno=?, apellido_materno=?, ci=?, nit=?, celular=?, gmail=? WHERE id=?",
    [nombre, apellido_paterno, apellido_materno, ci, nit, celular, gmail, id]
  );
  return result.affectedRows > 0;
};

// Eliminar un dueño (cambiar status a 0)
const deleteDuenio = async (id) => {
  const [result] = await db.execute("UPDATE duenio SET status = 0 WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = { getDuenios, getDuenioById, createDuenio, updateDuenio, deleteDuenio };
