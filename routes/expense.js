const express = require("express");
const { protect, onlyAdmin } = require("../middleware/auth");
const { list, updateExpense, getExpenseById, createExpense, deleteExpense } = require("../controllers/expense");
const router = express.Router();

router.route("/").get(protect, list);
router.route("/").post(protect, createExpense);
router.route("/:id").post(protect, updateExpense);
router.route("/:id").get(protect, getExpenseById);
router.route("/:id").delete(protect, deleteExpense);

module.exports = router;
