import { fetchData } from "./index.js";

// A function for the log out button to work
function logoutAction() {
    const decision = confirm("Are you sure?");
    console.log(decision);

    if (decision) {
        console.log("Manager logged out");
        window.location.href = "index.html";
    }
}

// Data validation to check if data exists in localStorage and fetch if necessary
function dataValidation() {
    if (localStorage.length === 0) {
        fetchData();
    } else {
        let manager = JSON.parse(localStorage.getItem("manager"));
        let client = JSON.parse(localStorage.getItem("client"));
        let book = JSON.parse(localStorage.getItem("book"));

        if (!manager || !book || !client) {
            fetchData();
        }
    }
}

// Fetch clients from localStorage
const clients = JSON.parse(localStorage.getItem("client")) || [];
console.log(clients);

// Function to display clients in the container
function showClients(clients) {
    const container = document.getElementById("client-container");
    container.innerHTML = ""; // Clear any existing content

    clients.forEach(client => {
        const card = document.createElement("div");
        card.className = "client-card border rounded shadow-sm m-2 p-3";
        card.style.flex = "1 1 calc(30% - 20px)";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.alignItems = "center";

        let name = client["Name"];
        let lastname = client["LastName"];
        let username = client["Username"];
        let id = client["ID"];
        const profileIconURL = "images/profile icon.png";
        const likedBooksCount = client["Books-liked"] ? client["Books-liked"].length : 0;
        const purchasedBooksCount = client["Books-purchased"] ? client["Books-purchased"].length : 0;
        

        card.innerHTML = `
        <img src="${profileIconURL}" alt="Profile Icon" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px;">
        <div class="text-center">
            <p class="client-name m-0"><strong>${name} ${lastname}</strong></p>
            <p class="client-username m-0 text-muted">@${username}</p>
        </div>
        <div class="client-info mt-2 text-center">
            <p class="m-0">Books Liked: ${likedBooksCount}</p>
            <p class="m-0">Books Purchased: ${purchasedBooksCount}</p>
        </div>
        <div class="client-actions mt-2">
            <button type="button" class="btn btn-info btn-sm m-1" id="view-${id}">View Details</button>
            <button type="button" class="btn btn-warning btn-sm m-1" id="edit-${id}">Edit</button>
            <button type="button" class="btn btn-danger btn-sm m-1" id="delete-${id}">Delete</button>
        </div>
    `;

        container.appendChild(card);


        // Attach event listeners for buttons
        const viewButton = card.querySelector(`#view-${id}`);
        viewButton.addEventListener("click", function () {
            selectClient(id, "view",clients);
        });

        const editButton = card.querySelector(`#edit-${id}`);
        editButton.addEventListener("click", function () {
            selectClient(id, "edit",clients);
        });

        const deleteButton = card.querySelector(`#delete-${id}`);
        deleteButton.addEventListener("click", function () {
            deleteClient(id, clients);
        });
    });
}

function selectClient(id, action,clients) {

    if (!clients) {
        console.error("No client data found in localStorage.");
        return;
    }

    const clientInfo = clients.find(client => client["ID"] == id);
    if (!clientInfo) {
        console.error("No matching client found for the given ID.");
        return;
    }

    localStorage.setItem("selectedClient", JSON.stringify(clientInfo));

    if (action === "view") {
        window.open("info-client-manager.html", "_blank");
    }  
    
    if (action === "edit") {
        window.open("edit-client-management.html", "_blank");
    }
}


// Function to search for clients by name or username
function searchClient() {
    const searchValue = document.getElementById("search-client-input").value.trim().toLowerCase();

    const searchResults = clients.filter(client => {
        const name = client["Name"].toLowerCase();
        const username = client["Username"].toLowerCase();

        return name.includes(searchValue) || username.includes(searchValue);
    });

    
    showClients(searchResults);
}



// Function to handle delete client action
function deleteClient(id, clients) {
    const updatedClients = clients.filter(client => client.ID !== id);
    localStorage.setItem("client", JSON.stringify(updatedClients));
    showClients(updatedClients); // Re-render clients
}



document.addEventListener("DOMContentLoaded", function() {
    try {
        document.getElementById("logout-button").addEventListener("click", logoutAction);
        dataValidation();
        showClients(clients);
        
        document.getElementById("search-client-input").addEventListener("input", function() {
            searchClient(books);
        });
    } catch (error) {
        console.error("An error occurred:", error);

    }
});

export{logoutAction, selectClient};