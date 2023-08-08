const Income = require("../models/Income");
const Company = require("../models/Company");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const Project = require("../models/Project");
const Slack = require("slack-node");
const { webhookUri } = require("../config/constants");

exports.getIncomes = async (req, res, next) => {
  try {
    const {
      user: { role },
    } = req;
    var incomes;

    incomes = await Income.find().populate({
      path: "user",
    });

    switch (role) {
      case "admin":
        break;
      case "companyboss":
        incomes = incomes.filter(
          (e) => String(e.user.company) === String(req.user.company)
        );
        break;
      case "officeboss":
        incomes = incomes.filter(
          (e) =>
            String(e.user.company) === String(req.user.company) &&
            String(e.user.office) === String(req.user.office)
        );
        break;
      case "teamboos":
        incomes = incomes.filter(
          (e) =>
            String(e.user.company) === String(req.user.company) &&
            String(e.user.office) === String(req.user.office) &&
            String(e.user.team) === String(req.user.team)
        );
        break;
      case "member":
        incomes = incomes.filter(
          (e) => String(e.user._id) === String(req.user._id)
        );
        break;
      default:
        break;
    }

    var array1 = [];
    incomes.forEach((e) => {
      var tempData = {
        _id: e._id,
        userId: e.user._id,
        fullname: e.user.fullname,
        company: e.user.company,
        office: e.user.office,
        team: e.user.team,
        project: e.project,
        amount: e.amount,
        description: e.description,
        status: e.status,
        incomeDate: e.incomeDate,
        updatedAt: e.updatedAt,
        createdAt: e.createdAt,
        userId: e.user.userId,
      };
      array1.push(tempData);
    });

    const projects = await Project.find().populate({
      path: "user",
    });

    var array2 = [];
    projects.forEach((e) => {
      var tempData = {
        _id: e._id,
        projectName: e.projectName,
        userId: e.user.userId,
      };
      array2.push(tempData);
    });
    return res.status(200).json({
      success: true,
      incomes: { incomes: array1, projectInfo: array2 },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.createIncome = async (req, res, next) => {
  try {
    if (!req.body.user) req.body.user = req.user._id;
    const income = await Income.create(req.body);
    const resIncome = await Income.findById(income._id);
    req.io.emit("update_dashboard", {
      message: `${req.user.userId} have added a new income.`,
    });
    req.io.emit("income", { type: "create", income: resIncome });
    // notify slack channel
    slack = new Slack();
    slack.setWebhook(webhookUri);
    slack.webhook({
      channel: "#general-notice",
      username: "Income-bot",
      icon_emoji: ":tada:",
      text: "I am excited to share that *" + req.user.userId  + "* has received new income! $" + resIncome.amount
    }, function(err, response) {
      console.log(response);
    });
    // retrieve 
    return res.status(200).json({
      success: true,
      message: "Income added successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateIncome = async (req, res, next) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body);
    const resIncome = await Income.findById(income._id);
    req.io.emit("income", { type: "update", income: resIncome });
    req.io.emit("update_dashboard", {
      message: `${req.user.userId} have updated a income.`,
    });
    res.status(200).json({
      success: true,
      message: "Income updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    req.io.emit("income", { type: "delete", income });
    req.io.emit("update_dashboard", {
      message: `${req.user.userId} have deleted a income.`,
    });
    res.status(200).json({
      success: true,
      message: `Income deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};
