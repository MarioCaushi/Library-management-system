// Simulating fetching data function (You can replace this with an actual API or data source)
import { fetchData } from "./index.js"; // If needed to fetch data for client

// A function for the logout button to work
function logoutAction(){
    const decision =  confirm("Are you sure?");
    
    console.log(decision);

    if(decision)
    {
        console.log("Client logged out");
        window.location.href="index.html"; // Redirect to login page or homepage
    }
};

// Function to check if localStorage is valid, and if not, fetch data from the JSON file again
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

// Function to display the client's information
function showClientInfo() {
    const container = document.getElementById("welcomeClient-container");
    container.innerHTML = ""; // Clear the container first
  
    // Get the client data from localStorage
    const client = JSON.parse(localStorage.getItem("user"));
  
    // If no client data is available, show an error message
    if (!client) {
      container.innerHTML = `<p>Error: No client data found. Please try again later.</p>`;
      return;
    }
  
    const { Name, LastName,  Username, Email } = client;
  
    // Create the client info card
    container.innerHTML = `
      <div class="text-center">
        <h3>${Name} ${LastName}</h3>
        <p><strong>UserName:</strong> ${Username}</p>
        <p><strong>Email:</strong> ${Email}</p>
      </div>
    `;
  
    // Attach event listener for the logout button
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", logoutAction);
}
  
// Function to update stats (Number of books and clients)
function updateStats() {
    // Get the books data from localStorage
    const books = JSON.parse(localStorage.getItem("book")) || [];

    // Get the number of books (clients are not relevant for the client page)
    const totalBooks = books.length;

    // Update the HTML with the total book count
    document.getElementById("bookCount").textContent = totalBooks;
}

// Function to navigate to a different page
function navigateTo(page) {
    window.location.href = page; 
}
  
// Export the function if needed, though not required if it's used inline
export { navigateTo };

// Initialize the page by validating data, showing the client's information, and updating stats
function initializeWelcomePage() {
  dataValidation();
  showClientInfo();
  updateStats();
}

// Run the initialization function on page load
window.onload = initializeWelcomePage;
