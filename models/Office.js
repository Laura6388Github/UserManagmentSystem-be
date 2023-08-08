const mongoose = require("mongoose");
const { offices } = require("../config/constants");

const OfficeSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: offices,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    select: false,
  },
  __v: { type: Number, select: false },
});

const Office = mongoose.model("Office", OfficeSchema);

module.exports = Office;
