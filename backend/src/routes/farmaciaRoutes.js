const express = require("express");
const router = express.Router();
const farmaciaController = require("../controllers/farmaciaController");

router.get("/", farmaciaController.getFarmacias);
router.get("/filtradas", farmaciaController.getFarmaciasFiltradas);

router.get("/:id", farmaciaController.getFarmaciaById);
router.post("/", farmaciaController.createFarmacia);
router.put("/:id", farmaciaController.updateFarmacia);
router.delete("/:id", farmaciaController.deleteFarmacia);

module.exports = router;
