const Team = require("../models/Team");
const ErrorResponse = require("../utils/errorResponse");

exports.list = async (req, res, next) => {
  try {
    const data = await Team.find();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};