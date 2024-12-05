import { fetchData } from "./index.js";

function logoutAction() {
  const decision = confirm("Are you sure?");

  console.log(decision);

  if (decision) {
    console.log("Client logged out");
    window.location.href = "index.html";
  }
}

function dataValidation() {
  if (localStorage.length === 0) {
    fetchData();
  } else {
    let client = JSON.parse(localStorage.getItem("client"));
    console.log("Data Validation: ", client);

    if (!client) {
      fetchData();
    }
  }
}

function showClientInfo() {

  const container = document.getElementById("welcomeClient-container");
  container.innerHTML = "";

  const client = JSON.parse(localStorage.getItem("user"));
  console.log(client);
  if (!client) {
    container.innerHTML = `<p>Error: No client data found. Please try again later.</p>`;
    return;
  }

  const { Name, LastName, Username, Email, Birthday } = client;

  container.innerHTML = `
      <div class="text-center">
    <h3>
      <strong>Name:</strong> 
      <span contenteditable="true" class="editable" id="name">${Name}</span>
    </h3>
    <h3>
      <strong>Last Name:</strong> 
      <span contenteditable="true" class="editable" id="lastName">${LastName}</span>
    </h3>
    <p>
      <strong>UserName:</strong> 
      <span contenteditable="true" class="editable" id="username">${Username}</span>
    </p>
    <p>
      <strong>Email:</strong> 
      <span contenteditable="true" class="editable" id="email">${Email}</span>
    </p>
    <p>
      <strong>Birthday:</strong> 
      <span contenteditable="true" class="editable" id="birthday">${Birthday}</span>
    </p>
    <button class="save-button" onclick="saveChanges()">Save Changes</button>
  </div>
    `;

  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", logoutAction);
}

function updateStats() {
  const books = JSON.parse(localStorage.getItem("book")) || [];

  const totalBooks = books.length;

  document.getElementById("bookCount").textContent = totalBooks;
}

function navigateTo(page) {
  window.location.href = page;
}

export { navigateTo };

function initializeWelcomePage() {
  dataValidation();
  showClientInfo();
  updateStats();
}

window.onload = initializeWelcomePage;
