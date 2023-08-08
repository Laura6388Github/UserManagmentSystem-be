const express = require("express");
const { list } = require("../controllers/office");
const router = express.Router();

router.route("/list").get(list);

module.exports = router;