const express = require("express");
const router = express.Router();

// Controllers
const {
  getInfoByIds
} = require("../controllers/dashboard");
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getInfoByIds);

module.exports = router;
