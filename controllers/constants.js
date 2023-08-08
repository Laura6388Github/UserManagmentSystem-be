const Company = require("../models/Company");
const Office = require("../models/Office");
const Team = require("../models/Team");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.getConstatns = async (req, res, next) => {
  try {
    const companies = await Company.find();
    const offices = await Office.find();
    const teams = await Team.find();
    const users = await User.find();
    const userIds = users.map((user) => user.userId);
    const constants = {
      companies,
      offices,
      teams,
      userIds,
    };
    return res.status(200).json({ success: true, message: "", constants });
  } catch (err) {
    next(err);
  }
};
