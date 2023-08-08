const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { roles } = require("../config/constants");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please input full name"],
  },
  userId: {
    type: String,
    required: [true, "Please input userId"],
    unique: [true, "UserID is unique"],
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Office",
    required: true,
  },
  role: {
    type: String,
    enum: roles,
    default: roles[4],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
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
  incomes: Array,
  accounts: Array,
  projects: Array,

});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Access Token
UserSchema.methods.getSignedJwtAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      fullname: this.fullname,
      userId: this.userId,
      company: this.company,
      team: this.team,
      office: this.office,
      incomes: this.incomes,
      accounts: this.accounts,
      isActive: this.isActive,
      isLocked: this.isLocked,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_EXPIRE,
    }
  );
};

// Refresh Token
UserSchema.methods.getSignedJwtRefreshToken = function () {
  return jwt.sign(
    { id: this._id, nickname: this.nickname },
    process.env.REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_EXPIRE,
    }
  );
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
