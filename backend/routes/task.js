const router = require("express").Router();
const Task = require("../models/Task");
const User = require("../models/User");
const Project = require("../models/Project");
const auth = require("../middleware/auth");

// CREATE TASK
router.post("/", auth, async (req, res) => {
  try {
    const { title, assignEmail, project } = req.body;

    if (!title || title.length < 3) {
      return res.status(400).json({ msg: "Title too short" });
    }

    let assignedUser = null;
    if (assignEmail) {
      assignedUser = await User.findOne({ email: assignEmail });
    }

    let projectData = null;
    if (project) {
      projectData = await Project.findOne({ name: project });

      if (!projectData) {
        return res.status(400).json({ msg: "Project not found" });
      }

      // TEAM VALIDATION
      if (assignEmail && !projectData.members.includes(assignEmail)) {
        return res.status(400).json({ msg: "User not in project team" });
      }
    }

    const task = await Task.create({
      title,
      user: req.user.id,
      assignEmail,
      assignedTo: assignedUser ? assignedUser._id : req.user.id,
      project: projectData ? projectData._id : null,
      deadline: new Date()
    });

    res.json(task);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET TASKS
router.get("/", auth, async (req, res) => {
  let tasks;

  if (req.user.role === "Admin") {
    tasks = await Task.find().populate("project");
  } else {
    tasks = await Task.find({ assignedTo: req.user.id }).populate("project");
  }

  res.json(tasks);
});

// UPDATE STATUS
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).send("Not found");

  if (task.assignedTo.toString() !== req.user.id) {
    return res.status(403).send("Not allowed");
  }

  task.status = req.body.status;
  await task.save();

  res.json(task);
});

module.exports = router;