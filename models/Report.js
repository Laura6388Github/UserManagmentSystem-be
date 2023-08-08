const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job_platform: {
     type:Array,
     required: true,
  },
  account_info: {
    type: String,
    required: true,
  },
  bid_count: {
   type: Number,
   required: true,
  },
  future_project: {
   type:Boolean,
   default: false,
  },
  reply_count: {
   type: Number,
   required: true,
  },
  awarded_project: {
   type: Boolean,
   default:false,
  },
  discuss_project: {
   type: Boolean,
   default: false,
  },
  reason_zero: {
   type: String,
  },
  pending_project: {
    type: Boolean,
    default:false,
  },
  pending_reason: {
    type: String,
  },
  working_project: {
    type:Boolean,
    default:false,
  },
  working_info: {
    type: String,
  },
  complete_project: {
    type:Boolean,
  },
  exp_complete: {
    type: String,
  },
  principle_account:{
    type:String,
    required: true
  },
  account_platform: {
    type: Array,
    required: true,
  },
  platform_reason: {
    type:String,
    required: true,
  },
  contact_count: {
    type: Number,
    required: true,
  },
  tip_account: {
    type: String,
  },
  agree_count: {
    type: Number,
    required: true,
  },
  course_name: {
    type:String,
    required: true,
  },
  course_week: {
    type: String,
    required: true,
  },
  english_study: {
    type: Boolean,
    default: false,
  },
  main_english: {
    type:String,
  },
  discuss_count: {
    type: Number,
    required: true,
  },
  project_partner: {
    type: Boolean,
    default: false 
  },
  project_detail: {
    type: String,
  },
  partnership_like: {
    type: Number,
    required: true,
  },
  help_partner: {
    type: Boolean,
    default: false,
  },
  partnership_dislike: {
    type: Number,
    required: true,
  },
  work_time: {
    type: Number,
    required: true,
  },
  sleep_time: {
    type: Number,
    required: true,
  },
  rule_internet: {
    type:Boolean,
    default: false,
  },
  problem_internet: {
    type: String,
  },
  reportDate: {
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

const Report = mongoose.model("Report", ReportSchema);

module.exports = Report;
