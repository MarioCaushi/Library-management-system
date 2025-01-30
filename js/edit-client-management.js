import { logoutAction } from "./manager-client-management.js";
import { showBookPurchased } from './info-client-manager.js';


const urlParams = new URLSearchParams(window.location.search);
const clientId = urlParams.get("clientId");
console.log(`Client ID: ${clientId}`);

async function showEditClient() {
    try {
        const clientInfo = await getClientInfo(clientId);
        
        document.title = `Edit Client Info - ${clientInfo.name}!`;
        showClientData(clientInfo);

        $("#delete-btn").click(() => deleteClient(clientId));
        $("#save-btn").click(() => saveEditClient(clientId));
        $("#discard-btn").click(() => showClientData(clientInfo));

        document.getElementById("purchased-tab").addEventListener("click", () => showTabContent(clientId, "purchased"));
        document.getElementById("reviewed-tab").addEventListener("click", () => showTabContent(clientId, "reviewed"));
        document.getElementById("liked-tab").addEventListener("click", () => showTabContent(clientId, "liked"));

    } catch (error) {
        console.error("Error loading client info:", error);
        // Handle error (show message to user)
    }
}

async function getClientInfo(clientId) {
    try {
        const response = await fetch(`http://localhost:5223/api/Clients/get-client-info/${clientId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching client data:', error);
    }
}

async function updateClient(clientId, clientData) {
    try {
        const response = await fetch(`http://localhost:5223/api/Clients/edit-client/${clientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clientData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating client data:', error);
    }
}

async function getBooks(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

async function showTabContent(clientId, action) {

    document.getElementById("book-cards").innerHTML="";

    try {
        let books;
        switch(action) {
            case "purchased":
                const booksPurchased = await getBooks(`http://localhost:5223/api/Clients/${clientId}/purchased-books`);
                showBookPurchased(booksPurchased);
                break;
            case "liked":
                books = await getBooks(`http://localhost:5223/api/Clients/${clientId}/liked-books`);
                showBookLiked(books);
                break;
            case "reviewed":
                books = await getBooks(`http://localhost:5223/api/Clients/${clientId}/reviews`);
                showBooksReviewed(books, clientId);
                break;
            default:
                console.error("Invalid action:", action);
                break;
        }
    } catch (error) {
        console.error(`Error fetching ${action} books:`, error);
        bookCardsContainer.innerHTML = "<div style='color: #FF0000;'>Error loading content</div>";
    }
}
    
function showBooksReviewed(books, clientInfo) {
    const bookCardsContainer = document.getElementById("book-cards");
    
    bookCardsContainer.innerHTML = "";

    if (!books || books.length === 0) {
        bookCardsContainer.innerHTML = "<div style='color: #FF0000;'>No content</div>";
        return;
    }

    console.log(books);

    books.forEach(book => {

        if (book.clientID !== clientInfo.ID) {
            return; // Skip books that the client hasn't reviewed
        }

        const cardDiv = document.createElement("div");
        cardDiv.className = "col-12 mb-2 p-2";
    
        // Add the content to the card
        cardDiv.innerHTML = `
            <div class="card border-2 rounded-4 shadow-sm mb-3">
                <div class="card-body d-flex flex-column p-4">
                    <div class="client-info mb-3">
                        <h5 class="card-title text-dark">${book.bookTitle}</h5>
                        <p class="card-text text-muted">Username: ${book.author}</p>
                        <p class="card-text text-muted">ID: ${book.bookId}</p>
                    </div>
                    <div class="review-text mb-3">
                        <p class="card-text">${book.reviewText}</p>
                    </div>
              <div class="d-flex justify-content-center">
                    <button class="btn btn-outline-danger rounded-pill px-4" id='btn-delete-reviews-${book.reviewOfId}'>Delete</button>
              </div>
            </div>
          </div>
        `;
    
        // Append the card to the container
        bookCardsContainer.appendChild(cardDiv);
    
        // Attach the event listener to the button
        cardDiv.querySelector(`#btn-delete-reviews-${book.reviewOfId}`).addEventListener("click", () => 
            deleteReview(book,clientInfo));
        });
}

async function deleteReview(book,clientInfo,booksReviewed){
    const agree = confirm("Are you sure you want to delete this review?");
    if (!agree) return;

    try {
        const response = await fetch(`http://localhost:5223/api/Clients/delete-review/${clientInfo.id}/${book.id}`, {
            method: 'DELETE',
        });

        if (!response.ok)  throw new Error('Failed to delete review');

        alert("Review deleted successfully!");
        window.location.reload();
    } catch (error) {
        console.error('Error deleting review:', error);
        alert("Failed to delete review. Please try again.");
    }
}
    
function showBookLiked(books) {
    const bookCardsContainer = document.getElementById("book-cards");

    // Clear the container first
    bookCardsContainer.innerHTML = "";

    if (books.length === 0) {
        bookCardsContainer.innerHTML = "<div style='color: #FF0000;'>No content</div>";
    } else {
        books.forEach((book) => {
            console.log("Book in show purchased books client manager", book);

            // Create the card div
            const cardDiv = document.createElement("div");
            cardDiv.className = "card mb-3 rounded-4 border shadow-sm border-2";
            cardDiv.style.border = "1px solid #ddd";

            // Add the content to the card
            cardDiv.innerHTML = `
                <div class="row align-items-center p-3">
                    <div class="col-auto">
                        <img src="${book.url}"
                            class="img-fluid" alt="Book Cover" style="width: 100px; height: 130px;">
                    </div>
                    <div class="col">
                        <div class="card-body">
                            <h5 class="card-title mb-1">${book.title}</h5>
                            <p class="card-text mb-1"><strong>Author:</strong> ${book.author}</p>
                            <p class="card-text"><strong>ID:</strong> ${book.id}</p>
                        </div>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-outline-danger details-btn" style="width: 170px;" id="delete-like-${book.id}">Delete</button>
                    </div>
                </div>
            `;

            // Append the card to the container
            bookCardsContainer.appendChild(cardDiv);

            // Attach the event listener to the button
            const deleteButton = cardDiv.querySelector(`#delete-like-${book.id}`);
            deleteButton.addEventListener("click", () => {
                deleteLike(book, clientInfo);
            });
        });
    }
}

async function deleteLike(book, clientInfo){
    const agree = confirm("Are you sure you want to delete this Like?");
    if (!agree) return;

    try {
        const response = await fetch(`http://localhost:5223/api/Clients/clients/${clientInfo.id}/liked-books/${book.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete book like');
       
            alert("Book like deleted successfully!");
            window.location.reload();
    } catch (error) {
        console.error('Error deleting book like:', error);
        alert("Failed to delete book like. Please try again.");
    }
}



async function deleteClient(clientId) {
    const agree = confirm("Are you sure you want to delete this client?");
    if (!agree) return;

    try {
        const response = await fetch(`http://localhost:5223/api/Clients/delete-client/${clientId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete client');

        alert("Client deleted successfully!");
        window.location.href = "/client-management.html"; // Redirect to the client management page
    } catch (error) {
        console.error('Error deleting client:', error);
        alert("Failed to delete client. Please try again.");
    }
}

function showClientData(clientInfo){
    if (!clientInfo) {
        console.error("Client information is undefined or null.");
        return;
    }
    console.log(clientInfo);
    document.querySelector("#client-name-surname").innerHTML = `${clientInfo.name} ${clientInfo.lastName}`;

    $("#client-name-input").val(`${clientInfo.name} `);
    $("#client-lastname-input").val(`${clientInfo.lastName} `);
    $("#client-email-input").val(`${clientInfo.email} `);
    $("#client-birthday-input").val(`${clientInfo.birthday} `);
    $("#client-username-input").val(`${clientInfo.username} `);
    $("#client-password-input").val(`${clientInfo.password} `);
    $("#client-id").text(` ${clientInfo.id} `);

}

async function saveEditClient(clientId) {
    const editClient = await getClientInfo(clientId);

    if (!editClient) {
        console.error("Failed to fetch client information for editing.");
        return;
    }

    const updatedClient = {
        Name: $("#client-name-input").val().trim(),
        LastName: $("#client-lastname-input").val().trim(),
        Email: $("#client-email-input").val().trim(),
        Birthday: $("#client-birthday-input").val().trim(),
        Username: $("#client-username-input").val().trim(),
        Password: $("#client-password-input").val().trim(),
    };

    if (editClient.name.trim().toLowerCase() === updatedClient.Name.toLowerCase() &&
    editClient.lastName.trim().toLowerCase() === updatedClient.LastName.toLowerCase() &&
    editClient.email.trim().toLowerCase() == updatedClient.Email.toLowerCase() &&
    editClient.birthday.trim().toLowerCase() == updatedClient.Birthday.toLowerCase() &&
    editClient.username.trim().toLowerCase() === updatedClient.Username.toLowerCase() &&
    editClient.password.trim().toLowerCase() ===  updatedClient.Password.toLowerCase() )
    {

    alert("No changes were made!");
    return;
    }
    
    const birthdayDate = new Date(updatedClient.Birthday);
    const today = new Date();
    let age = today.getFullYear() - birthdayDate.getFullYear();
    const monthDifference = today.getMonth() - birthdayDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdayDate.getDate())) {
        age--;
    }

    if (age < 18) {
        alert("The client must be at least 18 years old.");
        return;
    }
    
    if (updatedClient.Password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

    try {
        const response = await updateClient(clientId, updatedClient);
        
        if (response) {
            alert("Changes saved successfully!");
            window.location.reload();
        }
    } catch (error) {
        console.error('Error updating client data:', error);
        alert("Failed to save changes. Please try again.");
    }
    
}

document.addEventListener("DOMContentLoaded", () => {
    // Safely add event listener to logout button
    const logoutButton = document.getElementById("logout - button");
    if (logoutButton) {
        logoutButton.addEventListener("click", logoutAction);
    } else {
        console.warn("Logout button not found. ");
    }

    showEditClient();

});