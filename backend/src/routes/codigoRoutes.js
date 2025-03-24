const express = require("express");
const router = express.Router();
const { getAllCodigos } = require("../controllers/codigoController");

router.get("/", getAllCodigos);

module.exports = router;
