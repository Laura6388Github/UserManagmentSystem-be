const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  contractType: {
    type: String,
    required: true,
  },
  skill: {
    type: Array,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  potential: {
    type: Number,
    required: true,
  },
  workWith: {
    type: Array,
    required: true,
  },
  where: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
  deadline: {
    type: Date,
    default: new Date(),
  },
  __v: { type: Number, select: false },
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
