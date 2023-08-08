const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  amount: {
    type: Number,
  },
  reason: {
    type: String,
  },
  expenseDate: {
    type: Date,
    default: new Date(),
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  __v: { type: Number, select: false },
});

const Expense = mongoose.model("Expense", ExpenseSchema);

module.exports = Expense;
