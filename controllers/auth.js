const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// @desc    Login user
exports.login = async (req, res, next) => {
  const { userId, password } = req.body;
  // Check if email and password is provided
  if (!userId || !password) {
    return next(
      new ErrorResponse("Please provide an userId and password", 400)
    );
  }

  try {
    // Check that user exists by userId
    const user = await User.findOne({ userId }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // In active account
    if (!user.isActive) {
      return next(
        new ErrorResponse("Please wait for administrator's approval", 401)
      );
    }

    // Locked account
    if (user.isLocked) {
      return next(new ErrorResponse("Your account have Locked", 401));
    }

    // Check that password match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Password is incorrect", 401));
    }

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Register user
exports.register = async (req, res, next) => {
  try {
    await User.create(req.body);
    return res.status(200).json({
      success: true,
      message: "Registered! Wait for your manager's approval.",
    });
  } catch (err) {
    next(err);
  }
};

// desc refresh a token
exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new ErrorResponse("No refresh token passed", 400));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    // todo: check if token is valid and return early
    const user = await User.findOne({ email: decoded.email });

    sendRefreshToken(user, 200, refreshToken, res);
  } catch (err) {
    next(err);
  }
};

const sendToken = (user, statusCode, res) => {
  const acccess = user.getSignedJwtAccessToken();
  const refresh = user.getSignedJwtRefreshToken();
  res.status(statusCode).json({
    success: true,
    message: "You have logged in successfully.",
    user: user,
    tokens: { accessToken: acccess, refreshToken: refresh },
  });
};
const sendRefreshToken = (user, statusCode, originalRefreshToken, res) => {
  const acccess = user.getSignedJwtAccessToken();
  const refresh = user.getSignedJwtRefreshToken();
  res.status(statusCode).json({
    success: true,
    user: user,
    tokens: { accessToken: acccess, refreshToken: refresh },
  });
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return next(
        new ErrorResponse("Please provide both old and new password", 400)
      );
    }
    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch)
      return next(new ErrorResponse("Old Password is incorrect", 400));
    console.log(user)
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password have changed succeessfully",
    });
  } catch (err) {
    next(err);
  }
};
