const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, default: "Pending" },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  assignEmail: String,

  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

  deadline: Date
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);