const express = require("express");
const { getConstatns } = require("../controllers/constants");
const router = express.Router();

router.route("/").get(getConstatns);

module.exports = router;