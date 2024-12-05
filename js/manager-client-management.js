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
    const container = document.getElementById("client-management-container");

    container.innerHTML = ""; // Clear any existing content

    clients.forEach(client => {
        const card = document.createElement("div");
        card.className = "card mx-auto border border-dark border-opacity-50 rounded-3 shadow-md m-4 p-2";
        card.style.width = "400px"
        // card.style.flex = "1 1 calc(30% - 20px)";
        // card.style.display = "flex";
        // card.style.flexDirection = "column";
        // card.style.alignItems = "center";

        let name = client["Name"];
        let lastname = client["LastName"];
        let username = client["Username"];
        let id = client["ID"];
        const profileIconURL = "images/profile icon.png";
        const likedBooksCount = client["Books-liked"] ? client["Books-liked"].length : 0;
        const purchasedBooksCount = client["Books-purchased"] ? client["Books-purchased"].length : 0;
        

        card.innerHTML = `
    <div class="d-flex flex-column align-items-center p-3">
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
            <button type="button" class="btn btn-info btn-sm m-1 rounded-2" id="view-${id}">View Details</button>
            <button type="button" class="btn btn-warning btn-sm m-1 rounded-2" id="edit-${id}">Edit</button>
            <button type="button" class="btn btn-danger btn-sm m-1 rounded-2" id="delete-${id}">Delete</button>
        </div>
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
    const searchValue = $("#search-client-input").val().toLowerCase();

    const searchResults = clients.filter(client => {
        const name = client["Name"].toLowerCase();
        const username = client["Username"].toLowerCase();
        const lastname = client["LastName"].toLowerCase();

        return name.includes(searchValue) || lastname.includes(searchValue) ||
        username.includes(searchValue);
    });

    if (!searchValue) {
        showClients(clients);
    } else {
        showClients(searchResults);
    }
}


// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function() {
    try {
        document.getElementById("logout-button").addEventListener("click", logoutAction);
        dataValidation();
        showClients(clients);

        // Ensure input event is working
        const searchInput = document.getElementById("search-client-input");
        if (searchInput) {
            searchInput.addEventListener("input", searchClient);
        } else {
            console.error("Search input field not found");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
});


// Function to handle delete client action
function deleteClient(id, clients) {
    const agree = confirm("Are you sure?");

    if(agree) {
        const updatedClients = clients.filter(client => client.ID !== id);
        localStorage.setItem("client", JSON.stringify(updatedClients));
        showClients(updatedClients); 
    } 
}



document.addEventListener("DOMContentLoaded", function() {
    try {
        document.getElementById("logout-button").addEventListener("click", logoutAction);
        dataValidation();
        showClients(clients);
        
        document.getElementById("search-client-input").addEventListener("input", searchClient);

    } catch (error) {
        console.error("An error occurred:", error);

    }
});

export{logoutAction, selectClient};