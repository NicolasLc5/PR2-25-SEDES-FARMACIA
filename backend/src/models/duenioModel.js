const db = require("../config/db");

// Obtener todos los dueños
const getDuenios = async () => {
  const [rows] = await db.execute("SELECT * FROM owner WHERE status = 1");
  return rows;
};

// Obtener un dueño por ID
const getDuenioById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM owner WHERE id = ? AND status = 1", [id]);
  return rows[0];
};

// Crear un nuevo dueño
const createDuenio = async (data) => {
  const { name, fistLastName, secondSurname, ci, cellphone, gmail } = data;
  const [result] = await db.execute(
    "INSERT INTO owner (name, fistLastName, secondSurname, ci, cellphone, gmail) VALUES (?, ?, ?, ?, ?, ?)",
    [name, fistLastName, secondSurname, ci, cellphone, gmail]
  );
  return result.insertId;
};

// Editar un dueño
const updateDuenio = async (id, data) => {
  const { name, fistLastName, secondSurname, ci, cellphone, gmail } = data;
  const [result] = await db.execute(
    "UPDATE owner SET name=?, fistLastName=?, secondSurname=?, ci=?, cellphone=?, gmail=? WHERE id=?",
    [name, fistLastName, secondSurname, ci, cellphone, gmail, id]
  );
  return result.affectedRows > 0;
};

// Eliminar un dueño (cambiar status a 0)
const deleteDuenio = async (id) => {
  const [result] = await db.execute("UPDATE owner SET status = 0 WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = { getDuenios, getDuenioById, createDuenio, updateDuenio, deleteDuenio };
