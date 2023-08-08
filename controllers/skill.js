const Skill = require("../models/Skill");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.list = async (req, res, next) => {
  try {
    const data = await Skill.find();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return next(new ErrorResponse(404, "Skill not found"));
    res.status(200).json({ success: true, skill });
  } catch (err) {
    next(err);
  }
};

exports.createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    return res.status(200).json({ success: true, message: "Skill added successfully", skill });
  } catch (err) {
    next(err);
  }
};

exports.updateSkill = async (req, res, next) => {
  var id = req.params.id;
  var data = req.body;
  data.updatedAt = new Date();
  var resSkill;
  try {
    var skill = await Skill.findById(id);
    if (skill) {
      await Skill.findById(id).updateMany(data);
      resSkill = await Skill.findById(req.params.id);
      res.status(200).json({ success: true, message: "Skill updated successfully", skill: resSkill });
    } else {
      res.status(200).json({ success: false, message: `Cannot update Skill with id=${id}. Maybe Skill was not found!` });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteSkill = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await Skill.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `Document with ${id} has been deleted..` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};