const express = require("express");
const { list } = require("../controllers/company");
const router = express.Router();

router.route("/list").get(list);

module.exports = router;