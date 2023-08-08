const express = require("express");
const { protect, onlyAdmin } = require("../middleware/auth");
const { getProjects, updateProject, createProject, deleteProject } = require("../controllers/project");
const router = express.Router();

router.route("/").get(protect, getProjects);
router.route("/").post(protect, createProject);
router.route("/:id").post(protect, updateProject);

router.route("/:id").delete(protect, deleteProject);

module.exports = router;
