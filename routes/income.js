const express = require("express");
const { protect, onlyAdmin } = require("../middleware/auth");
const { getIncomes, updateIncome, createIncome, deleteIncome } = require("../controllers/income");
const router = express.Router();

router.route("/").get(protect, getIncomes);
router.route("/").post(protect, createIncome);
router.route("/:id").post(protect, updateIncome);
router.route("/:id").delete(protect, deleteIncome);

module.exports = router;
