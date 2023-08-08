const express = require("express");
const { protect, onlyAdmin } = require("../middleware/auth");
const {
  getUsers,
  getUser,
  deleteUser,
  createUser,
  getUserIds,
} = require("../controllers/user");
const { updateUser } = require("../controllers/user" );
const router = express.Router();

router.route("/").post(onlyAdmin, createUser);
router.route("/").get(onlyAdmin, getUsers);
router.route("/").post(protect, updateUser);
router.route("/userid").get(getUserIds);
router.route("/:id").post(protect, updateUser);
router.route("/:id").get(protect, getUser);
router.route("/:id").delete(protect, deleteUser);


module.exports = router;
