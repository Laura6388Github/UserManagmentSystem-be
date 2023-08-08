const Office = require("../models/Office");
const ErrorResponse = require("../utils/errorResponse");

exports.list = async (req, res, next) => {
  try {
    const data = await Office.find();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};