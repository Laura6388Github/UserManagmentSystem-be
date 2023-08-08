const mongoose = require("mongoose");

const PotentialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  amount: {
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

const Potential = mongoose.model("Potential", PotentialSchema);

module.exports = Potential;
