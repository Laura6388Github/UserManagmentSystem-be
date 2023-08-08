const Expense = require("../models/Expense");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.list = async (req, res, next) => {
  try {
    const data = await Expense.find();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return next(new ErrorResponse(404, "Expense not found"));
    res.status(200).json({ success: true, expense });
  } catch (err) {
    next(err);
  }
};

exports.createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create(req.body);
    return res.status(200).json({ success: true, message: "Expense added successfully", expense });
  } catch (err) {
    next(err);
  }
};

exports.updateExpense = async (req, res, next) => {
  var id = req.params.id;
  var data = req.body;
  data.updatedAt = new Date();
  var resExpense;
  try {
    var expense = await Expense.findById(id);
    if (expense) {
      await Expense.findById(id).updateMany(data);
      resExpense = await Expense.findById(req.params.id);
      res.status(200).json({ success: true, message: "Expense updated successfully", expense: resExpense });
    } else {
      res.status(200).json({ success: false, message: `Cannot update Expense with id=${id}. Maybe Expense was not found!` });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await Expense.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `Document with ${id} has been deleted..` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getExpensesByIds = async (req, res, next) => {
  try {
    const _companyId = req.params.companyId;
    const _officeId = req.params.officeId;
    const _teamId = req.params.teamId;

    var expensesByCompanyId = 0;
    var expensesByOfficeId = 0;
    var expensesByTeamId = 0;
    Expense.find().populate({ path: "user" }).then(response => {
      response.map(expense => {
        if(expense.user?.company?.toString() === _companyId) {
          expensesByCompanyId += expense.amount;
        }
        if(expense.user?.office?.toString() === _officeId) {
          expensesByOfficeId += expense.amount;
        }
        if(expense.user?.team?.toString() === _teamId) {
          expensesByTeamId += expense.amount;
        }
      })
      var result = {
        totalExpenseByCompanyId: expensesByCompanyId,
        totalExpenseByOfficeId: expensesByOfficeId,
        totalExpenseByTeamId: expensesByTeamId,
      }
      return res.status(200).json({ success: true, result });
    })

  } catch (err) {
    next(err);
  }
};