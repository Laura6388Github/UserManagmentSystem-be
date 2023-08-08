const Income = require("../models/Income");
const Project = require("../models/Project")
const User = require("../models/User");

exports.createUser = async (req, res, next) => {
  try {
    req.body.isActive = true;
    await User.create(req.body);
    res.status(200).json({
      success: true,
      message: "User created successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    var data = req.body;
    data.updatedAt = new Date();
    await User.findById(req.params.id).updateMany(data);
    const user = await User.findById(req.params.id);
    res.status(200).json({
      success: true,
      user: user,
      message: "User updated successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorResponse(404, "User not found"));
    res
      .status(200)
      .json({ success: true, user, message: "User updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Income.deleteMany({ user: req.params.id });
    await Project.deleteMany({ user: req.params.id });
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (err) {
    next(err);
  }
};

exports.getUserIds = async (req, res, next) => {
  try {
    const users = await User.find();
    var userIds = users.map((user) => user.userId);
    res.status(200).json({ success: true, userIds, message: "success" });
  } catch (err) {
    next(err);
  }
};
