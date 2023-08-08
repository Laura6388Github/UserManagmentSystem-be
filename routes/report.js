const express = require("express");
const { protect, onlyAdmin } = require("../middleware/auth");
const { createReport, getReports } = require("../controllers/report");
const router = express.Router();

router.route("/").get(onlyAdmin, getReports);
router.route("/").post(protect, createReport);
// router.route("/:id").post(protect, updateIncome);
// router.route("/:id").get(protect, getIncomesByUser);
// router.route("/:id").delete(protect, deleteIncome);

module.exports = router;
