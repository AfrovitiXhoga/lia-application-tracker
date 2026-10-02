const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = path.join(__dirname, "data.json");

function loadApplications() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveApplications() {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(applications, null, 2)
  );
}

let applications = loadApplications();

app.get("/api/applications", (req, res) => {
  res.json(applications);
});

app.post("/api/applications", (req, res) => {
  const nextId =
    applications.length > 0
      ? Math.max(...applications.map((app) => app.id)) + 1
      : 1;

  const newApplication = {
    id: nextId,
    company: req.body.company,
    role: req.body.role,
    status: req.body.status,
    date: req.body.date
  };

  applications.push(newApplication);
  saveApplications();

  res.status(201).json(newApplication);
});

app.delete("/api/applications/:id", (req, res) => {
  const id = Number(req.params.id);

  applications = applications.filter(
    (application) => application.id !== id
  );

  saveApplications();

  res.status(204).send();
});

app.put("/api/applications/:id", (req, res) => {
  const id = Number(req.params.id);

  const application = applications.find(
    (application) => application.id === id
  );

  if (!application) {
    return res.status(404).json({
      message: "Application not found"
    });
  }

  application.company = req.body.company;
  application.role = req.body.role;
  application.status = req.body.status;
  application.date = req.body.date;

  saveApplications();

  res.json(application);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});