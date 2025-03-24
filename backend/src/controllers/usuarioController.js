const Usuario = require("../models/usuarioModel");

// Iniciar sesión
const login = async (req, res) => {
  const { gmail, password } = req.body;
  try {
    const usuario = await Usuario.login(gmail, password);
    if (!usuario) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
    res.json({ message: "Inicio de sesión exitoso", usuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear usuario
const createUser = async (req, res) => {
  try {
    const newUserId = await Usuario.create(req.body);
    res.status(201).json({ message: "Usuario creado", id: newUserId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modificar usuario
const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    await Usuario.update(id, req.body);
    res.json({ message: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario (borrado lógico)
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await Usuario.delete(id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, createUser, updateUser, deleteUser };
