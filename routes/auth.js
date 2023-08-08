const express = require("express");
const router = express.Router();

// Controllers
const {
  login,
  register,
  refreshToken,
  resetPassword,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

router.route("/signup").post(register);
router.route("/login").post(login);
router.route("/refreshtoken").post(refreshToken);
router.route("/reset-password").post(protect, resetPassword);

module.exports = router;
