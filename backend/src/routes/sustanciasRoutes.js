const express = require("express");
const router = express.Router();
const { getAllSustancias } = require("../controllers/sustanciasController");

router.get("/", getAllSustancias);

module.exports = router;
