const Project = require("../models/Project");
const Company = require("../models/Company");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const Income = require("../models/Income");
const Slack = require("slack-node");
const { webhookUri } = require("../config/constants");

exports.getProjects = async (req, res, next) => {

  try {
    const { user: { role } } = req;
    var projects;
    
    projects = await Project.find().populate({
      path: "user",
    });

    switch (role) {
      case "admin":
        break;
      case "companyboss":
        projects = projects.filter(e => e.user.company.toString() === req.user.company.toString());
        break;
      case "officeboss":
        projects = projects.filter(e => e.user.company.toString() === req.user.company.toString() && e.user.office.toString() === req.user.office.toString());
        break;
      case "teamboss":
        projects = projects.filter(e => e.user.company.toString() === req.user.company.toString() && e.user.office.toString() === req.user.office.toString() && e.user.team.toString() === req.user.team.toString());
        break;
      case "member":
        projects = projects.filter(e => e.user._id.toString() === req.user._id.toString())
        break;
      default:
        break;
    }

    var array1 = [];
    projects.forEach((e) => {
      var tempData = {
        _id: e._id,
        userId: e.user._id,
        fullname: e.user.fullname,
        company: e.user.company,
        office: e.user.office,
        team: e.user.team,
        clientName: e.clientName,
        country: e.country,
        projectName: e.projectName,
        contractType: e.contractType,
        skill: e.skill,
        budget: e.budget,
        status: e.status,
        potential: e.potential,
        workWith: e.workWith,
        where: e.where,
        account: e.account,
        createdAt: e.createdAt,
        deadline: e.deadline,
        userId: e.user.userId,
      };
      array1.push(tempData);
      
    });

    const incomes = await Income.find().populate({
      path: "user",
    })

    var array2 = [];
    incomes.forEach((e) => {
      var tempData = {
        project: e.project,
        userId: e.user.userId,
        amount: e.amount,
        createdAt: e.createdAt,
      }
      array2.push(tempData)
    })

    return res.status(200).json({ success: true, projects:{projects: array1, incomeInfo:array2} });
  } catch (err) {
    next(err);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    if (!req.body.user) req.body.user = req.user._id;
    const project = await Project.create(req.body);
    const resProject = await Project.findById(project._id);
    req.io.emit("update_dashboard", {
      message: `${req.user.userId} have added a new project.`,
    });
    req.io.emit("project", { type: "create", project: resProject });
    // notify slack channel
    slack = new Slack();
    slack.setWebhook(webhookUri);
    slack.webhook({
      channel: "#general-notice",
      username: "project-bot",
      icon_emoji: ":dart:",
      text: "I am excited to share that *" + req.user.userId  + "* has won the bid for the new project! This month's potential income: $" + resProject.potential
    }, function(err, response) {
      console.log(response);
    });
    // retrieve response 
    return res.status(200).json({
      success: true,
      message: "Project added successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body);
    const resProject = await Project.findById(project._id);
    req.io.emit("project", { type: "update", project: resProject });
    req.io.emit("update_dashboard", {
      message: `${req.user.userId} have updated a project.`,
    });
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    req.io.emit("project", { type: "delete", project });
    req.io.emit("update_dashboard", {
      message: `${req.user.userId} have deleted a project.`,
    });
    res.status(200).json({
      success: true,
      message: `Project deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};
