const mongoose = require("mongoose");
const User = require("../models/User");
const Team = require("../models/Team");
const Office = require("../models/Office");
const Company = require("../models/Company");
const { teams, offices, companies } = require("./constants");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const _companies = await Company.find({});
    if (_companies.length === 0) {
      const _company = companies.map(async (item) => {
        await Company.create({ name: item });
      });
      await Promise.all(_company);
    }

    const _offices = await Office.find({});
    if (_offices.length === 0) {
      const _office = offices.map(async (item) => {
        await Office.create({ name: item });
      });
      await Promise.all(_office);
    }

    const _teams = await Team.find({});
    if (_teams.length === 0) {
      const _team = teams.map(async (item) => {
        await Team.create({ name: item });
      });
      await Promise.all(_team);
    }

    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      const team = await Team.findOne({ name: teams[0] });
      const office = await Office.findOne({ name: offices[3] });
      const company = await Company.findOne({ name: companies[0] });

      const user = await User.create({
        fullname: "Admin",
        company: company ? company.id : null,
        office: office ? office.id : null,
        team: team ? team.id : null,
        role: "admin",
        isActive: true,
        userId: process.env.ADMIN_USERID,
        password: process.env.ADMIN_PASSWORD,
        incomes: [],
        accounts: [],
        projects: [],
      });
      await user.save();
    }
    console.log("MongoDB Connected");
  } catch (err) {
    next(err);
  }
};

module.exports = connectDB;
