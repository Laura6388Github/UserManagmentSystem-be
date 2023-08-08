
const Account = require("../models/Account");
const Company = require("../models/Company");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.getAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find().populate({
      path: "user",
    });
    var arr = [];
    accounts.forEach((e) => {
      var tempData = {
        _id: e._id,
        userId: e.user._id,
        fullname: e.user.fullname,
        company: e.user.company,
        office: e.user.office,
        team: e.user.team,
        country: e.country,
        owner: e.owner,
        method: e.method,
        status: e.status,
        accountDate: e.accountDate,
        userId: e.user.userId,
      };
      arr.push(tempData);
    });
    return res.status(200).json({ success: true, accounts: arr });
  } catch (error) {
    next(err);
  }
};

exports.getAccountsByUser = async (req, res, next) => {
  try {
    const accounts = await Account.find({ user: req.user._id }).populate({
      path: "user",
    });
    var array = [];
    accounts.forEach((e) => {
      var tempData = {
        _id: e._id,
        userId: e.user._id,
        fullname: e.user.fullname,
        company: e.user.company,
        office: e.user.office,
        team: e.user.team,
        country: e.country,
        owner: e.owner,
        method: e.method,
        status: e.status,
        accountDate: e.accountDate,
        userId: e.user.userId,
      };
      array.push(tempData);
    });
    return res.status(200).json({ success: true, accounts: array });
  } catch (error) {
    next(err);
  }
};

exports.getAccountById = async (req, res, next) => {
  try {
    const accounts = await Account.find({ _id: req.params.id });
    // if (!income) return next(new ErrorResponse(404, "Income not found"));
    res.status(200).json({ success: true, accounts });
  } catch (err) {
    next(err);
  }
};

exports.createAccount = async (req, res, next) => {
  try {
    if (!req.body.user) req.body.user = req.user._id;
    const account = await Account.create(req.body);
    const resAccount = await Account.findById(account._id);
    req.io.emit("update_dashboard", {
      message: `${req.user.userId} have added a new account.`,
    });
    req.io.emit("account", { type: "create", account: resAccount });
    return res.status(200).json({
      success: true,
      message: "Account added successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body);
    const resAccount = await Account.findById(account._id);
    req.io.emit("account", { type: "update", account: resAccount });
    req.io.emit("update_dashboard", {
      message: `${req.user.userId} have updated a account.`,
    });
    res.status(200).json({
      success: true,
      message: "Account updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    req.io.emit("account", { type: "delete", account });
    req.io.emit("update_dashboard", {
      message: `${req.user.userId} have deleted a account.`,
    });
    res.status(200).json({
      success: true,
      message: `Account deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};
