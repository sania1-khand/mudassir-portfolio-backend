const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(__dirname, "../data/projects.json");

function readProjects() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function writeProjects(projects) {
  fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));
}

router.get("/", (req, res) => {
  const projects = readProjects();
  res.json(projects);
});

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

  res.status(201).json(newProject);
});

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

  res.json(projects[index]);
});

router.delete("/:id", (req, res) => {
  const projects = readProjects();
  const id = Number(req.params.id);

  const filteredProjects = projects.filter(project => project.id !== id);

  writeProjects(filteredProjects);

  res.json({ message: "Project deleted successfully" });
});

module.exports = router;
