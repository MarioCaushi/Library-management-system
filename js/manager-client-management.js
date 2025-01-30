// A function for the log out button to work
function logoutAction() {
    const decision = confirm("Are you sure?");
    console.log(decision);

    if (decision) {
        console.log("Manager logged out");
        window.location.href = "index.html";
    }
}


async function getAllClients() {
    const url = `http://localhost:5223/api/Clients/get-all-clients`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok){
            alert("Clients could not be fetched");
            return null;
        }
        return response.json();
    }catch(error){
        console.error("Clients could not be fetched", error);
    }
}

// Function to display clients in the container
async function showClients(clients) {
    const container = document.getElementById("client-management-container");

    if (!container) {
        console.error("client-management-container not found in the DOM.");
        return;
    }

    container.innerHTML = ""; // Clear any existing content


    if (!clients || clients.length === 0) {
        container.innerHTML = `<p>No clients found.</p>`;
        return;
    }

    clients.forEach(client => {
        const card = document.createElement("div");
        card.className = "card mx-auto border border-dark border-opacity-50 rounded-3 shadow-md m-4 p-2";
        card.style.width = "400px"

        let name = client["name"];
        let lastname = client["lastName"];
        let username = client["username"];
        let id = client["id"];
        const profileIconURL = "images/profile icon.png";
        const likedBooksCount = client["booksLiked"] ;
        const purchasedBooksCount = client["booksPurchased"];
        

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
            selectClient(id, "view");
        });

        const editButton = card.querySelector(`#edit-${id}`);
        editButton.addEventListener("click", function () {
            selectClient(id, "edit");
        });

        const deleteButton = card.querySelector(`#delete-${id}`);
        deleteButton.addEventListener("click", function () {
            deleteClient(id, clients);
        });
    });
}

function selectClient(id, action) {
    localStorage.setItem("selectedClient", id);

    if (action === "view") {
        window.open("info-client-manager.html", "_blank");
    } else if (action === "edit") {
        window.open("edit-client-management.html", "_blank");
    }
}

async function searchClient() {
    const searchValue = $("#search-client-input").val().toLowerCase();

    const clients = await getAllClients();

    if (!clients || clients.length === 0) {
        return; 
    }

    const searchResults = clients.filter(client => {
        const name = client["name"]?.toLowerCase() || "";
        const username = client["username"]?.toLowerCase() || "";
        const lastname = client["lastName"]?.toLowerCase() || "";

        return name.includes(searchValue) || lastname.includes(searchValue) ||
        username.includes(searchValue);

       
    });

    showClients(searchResults);
}

  
// Function to handle delete client action
async function deleteClient(id, clients) {
    const agree = confirm("Are you sure you want to delete this client?");

    if (agree) {
        const url = `http://localhost:5223/api/Clients/delete-client/${id}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                alert("Client could not be deleted.");
                return;
            }

            // Refresh the client list after deletion
            showClients(clients);
        } catch (error) {
            console.error("Client could not be deleted", error);
        }
    }
}


document.addEventListener("DOMContentLoaded", function() {
    try {
        document.getElementById("logout-button").addEventListener("click", logoutAction);
       
        getAllClients().then(clients => showClients(clients));

        const searchInput = document.getElementById("search-client-input");
        if (searchInput) {
            searchInput.addEventListener("input", searchClient);
        } else {
            console.warn("Search input field not found. This is expected on some pages.");
        }
    }catch (error) {
        console.error("An error occurred:", error);
    }
});

export{logoutAction, deleteClient};