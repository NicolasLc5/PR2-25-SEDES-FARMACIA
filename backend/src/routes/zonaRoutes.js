const express = require("express");
const router = express.Router();
const { getAllZonas } = require("../controllers/zonaController");

router.get("/", getAllZonas);

module.exports = router;
