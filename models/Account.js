const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  accountDate: {
    type: Date,
    default: new Date(),
  },
  __v: { type: Number, select: false },
});

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;
