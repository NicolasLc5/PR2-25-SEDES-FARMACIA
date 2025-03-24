const express = require("express");
const router = express.Router();
const { getAllDuenios, getDuenio, createDuenio, updateDuenio, deleteDuenio } = require("../controllers/duenioController");

router.get("/", getAllDuenios);
router.get("/:id", getDuenio);
router.post("/", createDuenio);
router.put("/:id", updateDuenio);
router.delete("/:id", deleteDuenio);

module.exports = router;
