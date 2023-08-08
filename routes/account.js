const express = require("express");
const { protect, onlyAdmin } = require("../middleware/auth");
const { getAccounts, updateAccount, getAccountsByUser, createAccount, deleteAccount } = require("../controllers/account");
const router = express.Router();

router.route("/").get(protect, getAccounts);
router.route("/").post(protect, createAccount);
router.route("/:id").post(protect, updateAccount);
router.route("/:id").get(protect, getAccountsByUser);
router.route("/:id").delete(protect, deleteAccount);

module.exports = router;
