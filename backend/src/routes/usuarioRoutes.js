const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// Rutas
router.post("/login", usuarioController.login);
router.post("/", usuarioController.createUser);
router.put("/:id", usuarioController.updateUser);
router.delete("/:id", usuarioController.deleteUser);

module.exports = router;
