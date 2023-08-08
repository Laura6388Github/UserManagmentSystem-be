const Potential = require("../models/Potential");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.list = async (req, res, next) => {
  try {
    const data = await Potential.find();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getPotentialById = async (req, res, next) => {
  try {
    const potential = await Potential.findById(req.params.id);
    if (!potential) return next(new ErrorResponse(404, "Potential not found"));
    res.status(200).json({ success: true, potential });
  } catch (err) {
    next(err);
  }
};

exports.createPotential = async (req, res, next) => {
  try {
    const potential = await Potential.create(req.body);
    return res.status(200).json({ success: true, message: "Potential added successfully", potential });
  } catch (err) {
    next(err);
  }
};

exports.updatePotential = async (req, res, next) => {
  var id = req.params.id;
  var data = req.body;
  data.updatedAt = new Date();
  var resPotential;
  try {
    var potential = await Potential.findById(id);
    if (potential) {
      await Potential.findById(id).updateMany(data);
      resPotential = await Potential.findById(req.params.id);
      res.status(200).json({ success: true, message: "Potential updated successfully", potential: resPotential });
    } else {
      res.status(200).json({ success: false, message: `Cannot update Potential with id=${id}. Maybe Potential was not found!` });
    }
  } catch (err) {
    next(err);
  }
};

exports.deletePotential = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await Potential.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `Document with ${id} has been deleted..` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};