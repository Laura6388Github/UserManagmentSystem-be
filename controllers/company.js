const Company = require("../models/Company");
const ErrorResponse = require("../utils/errorResponse");

exports.list = async (req, res, next) => {
  try {
    const data = await Company.find();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};