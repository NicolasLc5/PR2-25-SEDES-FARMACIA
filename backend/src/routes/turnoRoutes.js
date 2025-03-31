const express = require("express");
const router = express.Router();
const turnoController = require("../controllers/turnoController");

router.get("/", turnoController.getTurnosEsteMes);
router.get("/filtrados", turnoController.getTurnosFiltrados);
router.post("/enviar-correos", turnoController.enviarCorreosTurnos);

module.exports = router;