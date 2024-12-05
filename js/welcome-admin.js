import { fetchData } from "./index.js"; // Importing the fetchData function

// A function for the logout button to work
function logoutAction(){
    const decision =  confirm("Are you sure?");
    
    console.log(decision);

    if(decision)
        {
            console.log("Manager logged out");
            window.location.href="index.html";
        }
};

// Function to check if the localStorage is valid and, if not, fetch data from the JSON file again
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

// Function to display the manager's information
function showManagerInfo() {
    const container = document.getElementById("welcomeAdmin-container");
    container.innerHTML = ""; // Clear the container first
  
    // Get the manager data from localStorage
    const manager = JSON.parse(localStorage.getItem("manager"));
  
    // If no manager data is available, show an error message
    if (!manager) {
      container.innerHTML = `<p>Error: No manager data found. Please try again later.</p>`;
      return;
    }
  
    const { Name, LastName, Email, Birthday, Username } = manager;
  
    // Create the manager info card
    container.innerHTML = `
      <div class="text-center">
        <h3>${Name} ${LastName}</h3>
        <p><strong>Email:</strong> ${Email}</p>
        <p><strong>Birthday:</strong> ${Birthday}</p>
        <p><strong>Username:</strong> ${Username}</p>
      </div>
    `;
  
    // Attach event listener for the logout button
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", logoutAction);
  }
  
  function updateStats() {
    // Get the books and clients data from localStorage
    const books = JSON.parse(localStorage.getItem("book")) || [];
    const clients = JSON.parse(localStorage.getItem("client")) || [];
  
    // Get the number of books and clients
    const totalBooks = books.length;
    const totalClients = clients.length;
  
    // Update the HTML with the total counts
    document.getElementById("bookCount").textContent = totalBooks;
    document.getElementById("clientCount").textContent = totalClients;
  }

// Function to navigate to a different page
function navigateTo(page) {
    window.location.href = page; 
  }
  
  // Export the function if needed, though not required if it's used inline
  export { navigateTo };
  

// Initialize the page by validating data and showing the manager's information
function initializeWelcomePage() {
  dataValidation();
  showManagerInfo();
  updateStats();
}

// Run the initialization function on page load
window.onload = initializeWelcomePage;
