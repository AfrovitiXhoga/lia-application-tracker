const form = document.getElementById("applicationForm");
const applicationList = document.getElementById("applicationList");

async function loadApplications() {
  const response = await fetch("/api/applications");
  const applications = await response.json();

  applicationList.innerHTML = "";

  applications.forEach((application) => {
    const row = document.createElement("tr");

    row.innerHTML = `
  <td>${application.company}</td>
  <td>${application.role}</td>
  <td>${application.status}</td>
  <td>${application.date}</td>
  <td>
  <button onclick="editApplication(${application.id})">
    Edit
  </button>

  <button onclick="deleteApplication(${application.id})">
    Delete
  </button>
</td>
`;

    applicationList.appendChild(row);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const application = {
    company: document.getElementById("company").value,
    role: document.getElementById("role").value,
    status: document.getElementById("status").value,
    date: document.getElementById("date").value
  };

  await fetch("/api/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(application)
  });

  form.reset();
  loadApplications();
});

loadApplications();
async function deleteApplication(id) {
  await fetch(`/api/applications/${id}`, {
    method: "DELETE"
  });

  loadApplications();
}
async function editApplication(id) {
  const company = prompt("Company:");
  const role = prompt("Role:");
  const status = prompt("Status:");
  const date = prompt("Date (YYYY-MM-DD):");

  if (!company || !role || !status || !date) {
    return;
  }

  await fetch(`/api/applications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      company,
      role,
      status,
      date
    })
  });

  loadApplications();
}