const mongoose = require("mongoose");
const { companies } = require("../config/constants");

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: companies,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    select: false,
  },
  __v: { type: Number, select: false },
});

const Company = mongoose.model("Company", CompanySchema);

module.exports = Company;
