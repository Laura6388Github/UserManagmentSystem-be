const express = require("express");
const { protect, onlyAdmin } = require("../middleware/auth");
const { list, updatePotential, getPotentialById, createPotential, deletePotential } = require("../controllers/potential");
const router = express.Router();

router.route("/").get(protect, list);
router.route("/").post(protect, createPotential);
router.route("/:id").post(protect, updatePotential);
router.route("/:id").get(protect, getPotentialById);
router.route("/:id").delete(protect, deletePotential);

module.exports = router;
