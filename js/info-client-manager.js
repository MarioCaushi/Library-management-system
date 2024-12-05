import { logoutAction, selectClient } from "./manager-client-management.js";

function showClientInfo() {
    // Get client, books, clients from local storage
    const clientInfo = JSON.parse(localStorage.getItem("selectedClient"));
    const books = JSON.parse(localStorage.getItem("book"));
    const clients = JSON.parse(localStorage.getItem("client"));

    if (!clientInfo) {
        console.error("No client Info found from manager-client-management.");
        return;
    }

    if (!books) {
        console.error("No books found from manager-client-management.");
        return;
    }

    document.title = `Client Info - ${clientInfo["Name"]}!`;

    showClientData(clientInfo);

    $("#delete-btn").click(deleteClient);

    $("#edit-btn").on("click", () => {
        selectClient(clientInfo["ID"],"edit",clients );
    });


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

        showBookPurchased(booksLiked, books);
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
                                <button class="btn btn-outline-secondary rounded-pill px-4" id='btn-details-reviews-${book['ID']}'>Details</button>
                            </div>
                        </div>
                    </div>
                `;
    
                // Append the card to the container
                bookCardsContainer.appendChild(cardDiv);
    
                // Attach the event listener to the button
                const detailsButton = cardDiv.querySelector(`#btn-details-reviews-${book['ID']}`);
                detailsButton.addEventListener("click", () => {
                    showBookDetailsTab(book);  // Make sure this function works with a single book object
                });
            });
        }
    }
    

function showBookPurchased(booksPurchased, books) {
    const bookCardsContainer = document.getElementById("book-cards");

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
                        <button class="btn btn-outline-primary details-btn" style="width: 170px;" id="details-purchased-${id}">Details</button>
                    </div>
                </div>
            `;

            // Append the card to cardDic
            bookCardsContainer.appendChild(cardDiv);

            const detailsButton = cardDiv.querySelector(`#details-purchased-${id}`);
            detailsButton.addEventListener("click", () => {
                showBookDetailsTab(book);
            });
        });
    }
}

function showBookDetailsTab (book) {
    localStorage.setItem("selectedBook",JSON.stringify(book));
    window.open("info-book-manager.html", "_blank");
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
    const clientName = document.getElementById('client-name');
    clientName.textContent = `${clientInfo["Name"]} ${clientInfo["LastName"]}`;

    document.querySelector("#client-name").innerHTML = `${clientInfo["Name"]} ${clientInfo["LastName"]}`;
    document.querySelector("#client-email").innerHTML = `${clientInfo["Email"]}`;
    document.querySelector("#client-birthday").innerHTML = `${clientInfo["Birthday"]}`;
    document.querySelector("#client-username").innerHTML = `${clientInfo["Username"]}`;
    document.querySelector("#client-password").innerHTML = `${clientInfo["Password"]}`;
    document.querySelector("#client-id").innerHTML = `${clientInfo["ID"]}`;
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
    showClientInfo();

});

export { showBookPurchased };