const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let projects = [
  {
    id: 1,
    title: "artabia.com",
    description: "AI art & design generation tool.",
    image: "artabia.png",
    url: "https://artabia.com",
    tech: ["AI", "Design"]
  },
  {
    id: 2,
    title: "teamstack.ai",
    description: "AI-powered collaboration tool.",
    image: "teamstack.ai.png",
    url: "https://teamstack.ai",
    tech: ["AI", "SaaS"]
  }
];

app.get("/", (req, res) => {
  res.send("Portfolio backend running ✅");
});

app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.post("/api/projects", (req, res) => {
  const newProject = {
    id: Date.now(),
    ...req.body
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

app.put("/api/projects/:id", (req, res) => {
  const id = Number(req.params.id);
  projects = projects.map(project =>
    project.id === id ? { ...project, ...req.body } : project
  );

  res.json({ message: "Project updated" });
});

app.delete("/api/projects/:id", (req, res) => {
  const id = Number(req.params.id);
  projects = projects.filter(project => project.id !== id);

  res.json({ message: "Project deleted" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
