const Usuario = require("../models/usuarioModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Iniciar sesión
const login = async (req, res) => {
  const { gmail, password } = req.body;
  try {
    const user = await Usuario.login(gmail, password);
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({ message: "Inicio de sesión exitoso", user: { id: user.id, username: user.username, gmail: user.gmail, rol: user.rol }, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await Usuario.getAll();
    res.json(users);
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

module.exports = { login, getUsers, createUser, updateUser, deleteUser };
