const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "data", "projects.json");
const dataDir = path.join(__dirname, "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]");
}

function readProjects() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function writeProjects(projects) {
  fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));
}

app.get("/", (req, res) => {
  res.send("Portfolio backend running ✅");
});

app.get("/api/projects", (req, res) => {
  const projects = readProjects();
  res.json(projects);
});

app.post("/api/projects", (req, res) => {
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

app.put("/api/projects/:id", (req, res) => {
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

app.delete("/api/projects/:id", (req, res) => {
  const projects = readProjects();
  const id = Number(req.params.id);

  const filteredProjects = projects.filter(project => project.id !== id);

  writeProjects(filteredProjects);

  res.json({ message: "Project deleted successfully" }); 
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
