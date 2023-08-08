const Report = require("../models/Report");

exports.createReport = async (req, res, next) => {
  try {
    if (!req.body.user) req.body.user = req.user._id;
    const report = await Report.create(req.body);

    // const resReport = await Report.findById(report._id);
    // req.io.emit("create_newReport", {
    //   message: `${req.user.userId} have added a new income.`,
    // });
    // req.io.emit("report", { type: "create", reprot: resReport });
    return res.status(200).json({
      success: true,
      message: "Report created successfully",
    });
    
  } catch (err) {
    next(err);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().populate({
      path: "user",
      populate: [{ path: "company" }, { path: "office" }, { path: "team" }],
    });
    var array = [];
    reports.forEach((e) => {
      var tempData = {
        _id: e._id,
        userId: e.user._id,
        fullname: e.user.fullname,
        company: e.user.company,
        office: e.user.office,
        team: e.user.team,
        amount: e.amount,
        
        description: e.description,
        status: e.status,
        incomeDate: e.incomeDate,
        updatedAt: e.updatedAt,
        createdAt: e.createdAt,
      };
      array.push(tempData);
    });
    return res.status(200).json({ success: true, reports: array });
  } catch (error) {
    next(err);
  }
};