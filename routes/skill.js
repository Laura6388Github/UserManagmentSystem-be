const express = require("express");
const { protect, onlyAdmin } = require("../middleware/auth");
const { list, updateSkill, getSkillById, createSkill, deleteSkill } = require("../controllers/skill");
const router = express.Router();

router.route("/").get(protect, list);
router.route("/").post(protect, createSkill);
router.route("/:id").post(protect, updateSkill);
router.route("/:id").get(protect, getSkillById);
router.route("/:id").delete(protect, deleteSkill);

module.exports = router;
