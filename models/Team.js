const mongoose = require("mongoose");
const { teams } = require("../config/constants");

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: teams,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    select: false,
  },
  __v: { type: Number, select: false },
});

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
