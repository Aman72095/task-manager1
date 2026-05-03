const router = require("express").Router();
const Project = require("../models/Project");
const auth = require("../middleware/auth");

// CREATE PROJECT
router.post("/", auth, async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Project name required" });
    }

    const project = await Project.create({
      name,
      members,
      createdBy: req.user.id
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET PROJECTS
router.get("/", auth, async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

module.exports = router;