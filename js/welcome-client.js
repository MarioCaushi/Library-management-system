
import { fetchData } from "./index.js"; 


function logoutAction(){
    const decision =  confirm("Are you sure?");
    
    console.log(decision);

    if(decision)
    {
        console.log("Client logged out");
        window.location.href="index.html"; 
    }
};


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
  
    
    if (!client) {
      container.innerHTML = `<p>Error: No client data found. Please try again later.</p>`;
      return;
    }
  
    const { Name, LastName,  Username, Email } = client;
  
    
    container.innerHTML = `
      <div class="text-center">
        <h3>${Name} ${LastName}</h3>
        <p><strong>UserName:</strong> ${Username}</p>
        <p><strong>Email:</strong> ${Email}</p>
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
