const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  englishMark: {
    type: Number,
  },
  codehMark: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  __v: { type: Number, select: false },
});

const Skill = mongoose.model("Skill", SkillSchema);

module.exports = Skill;
