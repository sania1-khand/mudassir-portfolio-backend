const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(__dirname, "../data/projects.json");

// Read projects
function readProjects() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Write projects
function writeProjects(projects) {
  fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));
}

// GET all projects
router.get("/", (req, res) => {
  const projects = readProjects();
  res.json(projects);
});

// ADD project
router.post("/", (req, res) => {
  const projects = readProjects();

  const newProject = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    url: req.body.url,
    tech: req.body.tech
  };

  projects.push(newProject);

  writeProjects(projects);

  res.status(201).json({
    message: "Project added successfully",
    project: newProject
  });
});

// DELETE project
router.delete("/:id", (req, res) => {
  const projects = readProjects();

  const filtered = projects.filter(
    project => project.id !== Number(req.params.id)
  );

  writeProjects(filtered);

  res.json({
    message: "Project deleted successfully"
  });
});

// UPDATE project
router.put("/:id", (req, res) => {
  const projects = readProjects();
  const id = Number(req.params.id);

  const index = projects.findIndex(project => project.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Project not found" });
  }

  projects[index] = {
    ...projects[index],
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    url: req.body.url,
    tech: req.body.tech
  };

  writeProjects(projects);

  res.json({
    message: "Project updated successfully",
    project: projects[index]
  });
});

module.exports = router;
