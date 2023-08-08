const AdminBro = require("admin-bro");
const mongooseAdminBro = require("@admin-bro/mongoose");
const expressAdminBro = require("@admin-bro/express");
const User = require("../models/User");
const Income = require("../models/Income");
const Project = require("../models/Project")
const Expense = require("../models/Expense");
const Potential = require("../models/Potential");
const Skill = require("../models/Skill");
const Account = require("../models/Account");

AdminBro.registerAdapter(mongooseAdminBro);
const AdminBroOptions = {
  resources: [User, Income, Expense, Project,  Potential, Skill, Account],
};

const adminBro = new AdminBro(AdminBroOptions);
const adminRoute = expressAdminBro.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ userId: email }).select("+password");
    if (user) {
      const matched = await user.matchPassword(password);
      if (matched && user.role === "admin") {
        return user;
      }
    }
    return false;
  },
  cookiePassword: "some-secret-password-used-to-secure-cookie",
});

module.exports = { adminBro, adminRoute }
