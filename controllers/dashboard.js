const Income = require("../models/Income");
const Team = require("../models/Team");
const User = require("../models/User");
const Project = require("../models/Project");
const { trainingMembers } = require("../config/constants");

function calIncomes(incomeList, type) {
  var o = {};
  const result = incomeList.reduce(function (r, el) {
    var e;
    if (type === "team") {
      e = el.user?.team;
    } else {
      e = el.user?._id;
    }
    if (!o[e]) {
      if (type === "team") {
        o[e] = {
          id: el.id,
          company: el.user.company,
          office: el.user.office,
          team: el.user.team,
          totalIncome: 0,
        };
      } else {
        o[e] = {
          id: el.id,
          userId: el.user.userId,
          user: el.user._id,
          company: el.user.company,
          office: el.user.office,
          team: el.user.team,
          totalIncome: 0,
        };
      }
      r.push(o[e]);
    }
    o[e].totalIncome += el.amount;
    return r;
  }, []);
  return result;
}

function calPotential(projectList, type) {
  var o = {};
  const result = projectList.reduce(function (r, el) {
    var e;
    if (type === "team") {
      e = el.user?.team;
    } else {
      e = el.user?._id;
    }
    if (!o[e]) {
      if (type === "team") {
        o[e] = {
          id: el.id,
          company: el.user.company,
          office: el.user.office,
          team: el.user.team,
          totalPotential: 0,
        };
      } else {
        o[e] = {
          id: el.id,
          userId: el.user.userId,
          user: el.user._id,
          company: el.user.company,
          office: el.user.office,
          team: el.user.team,
          totalPotential: 0,
        };
      }
      r.push(o[e]);
    }
    o[e].totalPotential += el.potential;
    return r;
  }, []);
  return result;
}

exports.getInfoByIds = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    const officeId = req.user.office;

    const users = await User.find({
      company: req.user.company,
      office: req.user.office,
    }).populate([{ path: "company" }, { path: "office" }, { path: "team" }]);
    
    // Income
    var incomeList = await Income.find().populate({
      path: "user",
      populate: [{ path: "company" }, { path: "office" }, { path: "team" }],
    });

    var tempIncomeList = incomeList.filter(
      (income) => !trainingMembers.includes(income.user.userId)
    );
    var incomesByTeams = calIncomes(tempIncomeList, "team");

    const incomes = incomeList.filter(
      (income) =>
        income.user.company.id.toString() === companyId.toString() &&
        income.user.office._id.toString() === officeId.toString()
    );

    var totalIncome = 0;
    incomes.map((income) => {
      if (!trainingMembers.includes(income.user.userId)) {
        totalIncome += income.amount;
      }
    });

    // Potential
    var projectList = await Project.find().populate({
      path: "user",
      populate: [{ path: "company" }, { path: "office" }, { path: "team" }],
    });
    var tempProjectList = projectList.filter(
      (project) => !trainingMembers.includes(project.user.userId)
    );
    var potentialsByTeams = calPotential(tempProjectList, "team");
    const projects = projectList.filter(
      (income) =>
        income.user.company.id.toString() === companyId.toString() &&
        income.user.office._id.toString() === officeId.toString()
    );
    var totalPotential = 0;
    projects.map((project) => {
      if (!trainingMembers.includes(project.user.userId)) {
        totalPotential += project.potential;
      }
    });

    //
    var teams = await Team.find();
    var analysis = [];
    teams.map((team, index) => {
      var incomeByTeam = incomesByTeams.filter(
        (income) => income.team._id.toString() === team._id.toString()
      );
      var potentialByTeam = potentialsByTeams.filter(
        (project) => project.team._id.toString() === team._id.toString()
      );
      var income = incomeByTeam[0] ? incomeByTeam[0]?.totalIncome : 0;
      var potential = potentialByTeam[0] ? potentialByTeam[0]?.totalPotential : 0;
      var result = {
        name: team.name,
        team: team._id,
        income: income.toFixed(2),
        target: 8000,
        potential: potential.toFixed(2),
        rank: 0,
        project: 0,
      };
      analysis.push(result);
    });

    var currentTeamInfo = analysis.filter(
      (item) => item.team.toString() === req.user.team._id.toString()
    )[0];

    var incomesByUsers = calIncomes(incomes, "user");
    var userAnalysis = [];

    users.map((user) => {
      var incomeByUser = incomesByUsers.filter(
        (income) => income.user._id.toString() === user._id.toString()
      );
      var income = incomeByUser[0] ? incomeByUser[0].totalIncome : 0;
      var result = {
        name: user.userId,
        company: user.company,
        office: user.office,
        team: user.team,
        income: income.toFixed(2),
      };
      userAnalysis.push(result);
    });

    var usersByTeam = {};
    teams.map((team, index) => {
      var tempList = [];
      userAnalysis.map((user) => {
        if (user.team._id.toString() === team._id.toString()) {
          tempList.push(user);
        }
      });
      usersByTeam[index] = tempList;
    });

    var membersRanked = userAnalysis.sort((a, b) => b.income - a.income);

    var data = {
      topData: {
        income: totalIncome,
        expense: 0,
        target: 40000,
        potential: totalPotential,
        rate: (totalIncome / 40000) *100 ,
        project: tempProjectList.length,
        account: 0,
        top: 5,
        topTotal: 0,
        last: 5,
        lastTotal: 0,
      },
      currentTeamInfo: currentTeamInfo,
      membersRanked: membersRanked,
      analysis: analysis,
      userAnalysis: usersByTeam,
    };
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
