import { fetchData } from "./index.js";

function logoutAction() {
  const decision = confirm("Are you sure?");

  console.log(decision);

  if (decision) {
    console.log("Manager logged out");
    window.location.href = "index.html";
  }
}

function dataValidation() {
  if (localStorage.length === 0) {
    fetchData();
  } else {
    let manager = JSON.parse(localStorage.getItem("manager"));
    console.log("Data Validation: ", manager);

    if (!manager) {
      fetchData();
    }
  }
}

function showManagerInfo() {

  const container = document.getElementById("welcomeAdmin-container");
  container.innerHTML = "";

  const manager = JSON.parse(localStorage.getItem("manager"));

  if (!manager) {
    container.innerHTML = `<p>Error: No manager data found. Please try again later.</p>`;
    return;
  }

  const { Name, LastName, Email, Birthday, Username } = manager;

  container.innerHTML = `
      <div class="text-center">
        <h3>${Name} ${LastName}</h3>
        <p><strong>Email:</strong> ${Email}</p>
        <p><strong>Birthday:</strong> ${Birthday}</p>
        <p><strong>Username:</strong> ${Username}</p>
      </div>
    `;

  
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", logoutAction);
  }
  
  function updateStats() {
    const books = JSON.parse(localStorage.getItem("book")) || [];
    const clients = JSON.parse(localStorage.getItem("client")) || [];

    const totalBooks = books.length;
    const totalClients = clients.length;
  
    
    document.getElementById("bookCount").textContent = totalBooks;
    document.getElementById("clientCount").textContent = totalClients;
  }


  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", logoutAction);
}

function updateStats() {
  const books = JSON.parse(localStorage.getItem("book")) || [];
  const clients = JSON.parse(localStorage.getItem("client")) || [];

  const totalBooks = books.length;
  const totalClients = clients.length;

  document.getElementById("bookCount").textContent = totalBooks;
  document.getElementById("clientCount").textContent = totalClients;
}

function navigateTo(page) {
  window.location.href = page;
}


export { navigateTo };


function initializeWelcomePage() {
  dataValidation();
  showManagerInfo();
  updateStats();
}

window.onload = initializeWelcomePage;
