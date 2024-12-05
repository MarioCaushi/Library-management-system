import { logoutAction } from "./manager-client-management.js";
import { showBookPurchased } from './info-client-manager.js';


function showEditClient() {
    // Get client ID from local storage
    let clientInfo = JSON.parse(localStorage.getItem("selectedClient"));
    const books = JSON.parse(localStorage.getItem("book"));

    if (!clientInfo) {
        console.error("No client Info found from manager-client-management.");
        return;
    }

    if (!books) {
        console.error("No books found from manager-client-management.");
        return;
    }

    document.title = `Edit Client Info - ${clientInfo["Name"]}!`;

    showClientData(clientInfo);

    $("#delete-btn").click(deleteClient);

    $("#save-btn").on("click", () => {
        saveEditClient(clientInfo)
    });

    $("#discard-btn").on("click", () => {
        showClientData(clientInfo)});

    document.getElementById("purchased-tab").addEventListener("click", () => {
        showTabContent(clientInfo, books, "purchased");
    });

    document.getElementById("reviewed-tab").addEventListener("click", () => {
        showTabContent(clientInfo, books, "reviewed");
    });

    document.getElementById("liked-tab").addEventListener("click", () => {
        showTabContent(clientInfo, books, "liked");
    });

}

function showTabContent(clientInfo, books, action) {

    document.getElementById("book-cards").innerHTML="";

    if(action == "purchased") {

        const booksPurchased = clientInfo["Books-purchased"];

        showBookPurchased(booksPurchased, books);
    }

    if(action == "liked")
    {
        const booksLiked = clientInfo["Books-liked"];

        showBookLiked(booksLiked, books, clientInfo);
    }

    if(action == "reviewed") {

        const booksReviewed = books.filter(book => {
            return book["Reviews"].some(review => review["clientID"] == clientInfo["ID"]);
        });        

        console.log(booksReviewed);
    
        showBooksReviwed(booksReviewed,clientInfo);
    }
}
    
    function showBooksReviwed(booksReviewed,clientInfo) {

        const bookCardsContainer = document.getElementById("book-cards");
    
        bookCardsContainer.innerHTML = "";
    
        if (booksReviewed.length === 0) {
            bookCardsContainer.innerHTML = "<div style='color: #FF0000;'>No content</div>";
        } else {

            booksReviewed.forEach(book => {

                const review = book["Reviews"].find(review => review["clientID"] == clientInfo["ID"]);
    
                const cardDiv = document.createElement("div");
                cardDiv.className = "col-12 mb-2 p-2";
    
                // Add the content to the card
                cardDiv.innerHTML = `
                   <div class="card border-2 rounded-4 shadow-sm mb-3">
                        <div class="card-body d-flex flex-column p-4">
                            <div class="client-info mb-3">
                                <h5 class="card-title text-dark">${book['Title']}</h5>
                                <p class="card-text text-muted">Username: ${book['Author']}</p>
                                <p class="card-text text-muted">ID: ${book['ID']}</p>
                            </div>
                            <div class="review-text mb-3">
                                <p class="card-text">${review['review']}</p>
                            </div>
                            <div class="d-flex justify-content-center">
                                <button class="btn btn-outline-danger rounded-pill px-4" id='btn-delete-reviews-${book['ID']}'>Delete</button>
                            </div>
                        </div>
                    </div>
                `;
    
                // Append the card to the container
                bookCardsContainer.appendChild(cardDiv);
    
                // Attach the event listener to the button
                cardDiv.querySelector(`#btn-delete-reviews-${book['ID']}`).addEventListener("click", () => {
                    deleteReview(book,clientInfo,booksReviewed);
                });
            });
        }
    }
    
function showBookLiked(booksPurchased, books, clientInfo) {
    const bookCardsContainer = document.getElementById("book-cards");

    // Clear the container first
    bookCardsContainer.innerHTML = "";

    if (booksPurchased.length === 0) {
        bookCardsContainer.innerHTML = "<div style='color: #FF0000;'>No content</div>";
    } else {
        booksPurchased.forEach((id) => {
            const book = books.find((book) => book["ID"] === id);
            console.log("Book in show purchased books client manager", book);

            // Create the card div
            const cardDiv = document.createElement("div");
            cardDiv.className = "card mb-3 rounded-4 border shadow-sm border-2";
            cardDiv.style.border = "1px solid #ddd";

            // Add the content to the card
            cardDiv.innerHTML = `
                <div class="row align-items-center p-3">
                    <div class="col-auto">
                        <img src="${book["Cover Image URL"]}"
                            class="img-fluid" alt="Book Cover" style="width: 100px; height: 130px;">
                    </div>
                    <div class="col">
                        <div class="card-body">
                            <h5 class="card-title mb-1">${book["Title"]}</h5>
                            <p class="card-text mb-1"><strong>Author:</strong> ${book["Author"]}</p>
                            <p class="card-text"><strong>ID:</strong> ${book["ID"]}</p>
                        </div>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-outline-danger details-btn" style="width: 170px;" id="delete-like-${id}">Delete</button>
                    </div>
                </div>
            `;

            // Append the card to the container
            bookCardsContainer.appendChild(cardDiv);

            // Attach the event listener to the button
            const deleteButton = cardDiv.querySelector(`#delete-like-${id}`);
            deleteButton.addEventListener("click", () => {
                deleteLike(book, clientInfo);
            });
        });
    }
}

function deleteLike(book, clientInfo){
    const agree = confirm("Are you sure you want to delete this Like?");

    if(agree){
        const clientID = clientInfo["ID"];
        
        clientInfo["Books-liked"] = clientInfo["Books-liked"].filter(id => id !== book["ID"]);
        localStorage.setItem("selectedClient", JSON.stringify(clientInfo));
        
        let clients = JSON.parse(localStorage.getItem("clients"));
        clients = clients.map((storedClient) => {
            if (storedClient["ID"] === clientID) {
                return { ...clientInfo };
            }
            return storedClient;
        });

        localStorage.setItem("clients", JSON.stringify(clients));

        book["Likes-clients"] = book["Likes-clients"].filter(id => id !== clientID);
        localStorage.setItem("selectedBook", JSON.stringify(book));

        let books = JSON.parse(localStorage.getItem("book"));
        books = books.map((storedBook) => {
        if (storedBook["ID"] === book["ID"]) {
            return { ...book };
        }
        return storedBook;
        });

        localStorage.setItem("book", JSON.stringify(books));

        alert("Book removed from client's liked books successfully!");

        window.location.reload();
        
        showBookLiked(clientInfo["Books-liked"]);
    } else {
        console.error("Book not found in the 'book-liked' array.");
    }        
}

function deleteReview(book,clientInfo,booksReviewed){
    book["Reviews"] = book["Reviews"].filter(review => review["clientID"] != clientInfo["ID"]);
    
     localStorage.setItem("selectedBook", JSON.stringify(book));
    
    let books = JSON.parse(localStorage.getItem("book"));
    
    books = books.map((newBook) => {
        if (newBook["ID"] === book["ID"]) {
                        return { ...book };
        }
        return newBook;
    });
    
    localStorage.setItem("book", JSON.stringify(books));
    
    alert("Review Deleted");
    
    location.reload();
    
    showBooksReviwed(booksReviewed,clientInfo)
}


function deleteClient(id, clients) {
    const agree = confirm("Are you sure?");

    if(agree) {
        const updatedClients = clients.filter(client => client.ID !== id);
        localStorage.setItem("client", JSON.stringify(updatedClients));
        showClients(updatedClients); 
    } 
}

function showClientData(clientInfo){
    document.querySelector("#client-name-surname").innerHTML = `${clientInfo["Name"]} ${clientInfo["LastName"]}`;

    $("#client-name-input").val(`${clientInfo["Name"]} `);
    $("#client-lastname-input").val(`${clientInfo["LastName"]} `);
    $("#client-email-input").val(`${clientInfo["Email"]} `);
    $("#client-birthday-input").val(`${clientInfo["Birthday"]} `);
    $("#client-username-input").val(`${clientInfo["Username"]} `);
    $("#client-password-input").val(`${clientInfo["Password"]} `);
    $("#client-id").text(` ${clientInfo["ID"]} `);

}

function saveEditClient(editClient) {

    if (editClient["Name"].trim().toLowerCase() === $("#client-name-input").val().trim().toLowerCase() &&
    editClient["LastName"].trim().toLowerCase() === $("#client-lastname-input").val().trim().toLowerCase() &&
    editClient["Email"].trim().toLowerCase() == $("#client-email-input").val().trim().toLowerCase() &&
    editClient["Birthday"].trim().toLowerCase() == $("#client-birthday-input").val().trim().toLowerCase() &&
    editClient["Username"].trim().toLowerCase() === $("#client-username-input").val().trim().toLowerCase() &&
    editClient["Password"].trim().toLowerCase() === $("#client-password-input").val().trim().toLowerCase() )
    {

    alert("No changes were made!");

    }else{
        if (editClient["Name"].toLowerCase().trim() !== $("#client-name-input").val().toLowerCase().trim())
             {
            editClient["Name"] = $("#client-name-input").val();
        }

        if (editClient["LastName"].toLowerCase().trim() !== $("#client-lastname-input").val().toLowerCase().trim()) {
            editClient["LastName"] = $("#client-lastname-input").val();
        }

        if (editClient["Email"].toLowerCase().trim() !== $("#client-email-input").val().toLowerCase().trim()) {
            editClient["Email"] = $("#client-email-input").val();
        }

        if (editClient["Birthday"].toLowerCase().trim() !== $("#client-birthday-input").val().toLowerCase().trim()) {
            const birthdayInput = $("#client-birthday-input").val().trim();
            const birthdayDate = new Date(birthdayInput);
            const today = new Date();
            const age = today.getFullYear() - birthdayDate.getFullYear();
            const monthDifference = today.getMonth() - birthdayDate.getMonth();

            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdayDate.getDate())) {
                age--;
            }
        
            if (age < 18) {
                alert("The client must be at least 18 years old.");
            } else {
                editClient["Birthday"] = birthdayInput;
            }
        }

        if (editClient["Username"].toLowerCase().trim() !== $("#client-username-input").val().toLowerCase().trim()) {
            editClient["Username"] = $("#client-username-input").val();
        }

        if (editClient["Password"].toLowerCase().trim() !== $("#client-password-input").val().toLowerCase().trim()) {
            editClient["Password"] = $("#client-password-input").val();
        }

    }

    localStorage.setItem("selectedClient", JSON.stringify(editClient));

    let clients = JSON.parse(localStorage.getItem("client"));

    clients = clients.map((client) => {
        if (client["ID"] === editClient["ID"]) {
            return { ...editClient };
        }
        return client;
    });

    localStorage.setItem("client", JSON.stringify(clients));

    window.location.reload();

    alert("Changes saved successfully!");
}


document.addEventListener("DOMContentLoaded", () => {
    // Safely add event listener to logout button
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", logoutAction);
    } else {
        console.warn("Logout button not found.");
    }

    // Display client info
    showEditClient();

});