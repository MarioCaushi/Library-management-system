import { logoutAction } from "./manager-client-management.js";

async function showClientInfo() {
    // Get client, books, clients from backend
    const clientId = localStorage.getItem("selectedClient");
    
    if (!clientId) {
        console.error("No client ID found in localStorage.");
        return;
    }

    try {
        // Fetch client info from the backend
        const clientInfo = await getClientInfo(clientId);
        if (!clientInfo) {
            console.error("No client info found from the backend.");
            return;
        }

        document.title = `Client Info - ${clientInfo.name}!`;


        showClientData(clientInfo);

        document.getElementById("delete-btn").addEventListener("click", () => deleteClient(clientId));
        document.getElementById("edit-btn").addEventListener("click", () => {
            console.log(`Editing client with ID: ${clientId}`);
        
            window.open(`edit-client-management.html?clientId=${clientId}`, "_blank");
        });

        document.getElementById("purchased-tab").addEventListener("click", () => showTabContent(clientId, "purchased"));
        document.getElementById("reviewed-tab").addEventListener("click", () => showTabContent(clientId, "reviewed"));
        document.getElementById("liked-tab").addEventListener("click", () => showTabContent(clientId, "liked"));

    } catch (error) {
        console.error("An error occurred while fetching client info:", error);
    }  

}

async function getClientInfo(clientId) {
    const url = `http://localhost:5223/api/Clients/get-client-info/${clientId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            alert("Client info could not be fetched.");
            return null;
        }

        return response.json();
    } catch (error) {
        console.error("Client info could not be fetched", error);
        return null;
    }
}
 

async function showTabContent(clientId, action) {

    const bookCardsContainer = document.getElementById("book-cards");
    bookCardsContainer.innerHTML = "";

    try {
        if (action === "purchased") {
            const purchasedBooks = await getPurchasedBooks(clientId);
            showBookPurchased(purchasedBooks);
        } else if (action === "liked") {
            const likedBooks = await getLikedBooks(clientId);
            showBookPurchased(likedBooks);
        } else if (action === "reviewed") {
            const reviews = await getClientReviews(clientId);
            showBooksReviewed(reviews);
        }
    } catch (error) {
        console.error("An error occurred while fetching tab content:", error);
    }
}

async function getPurchasedBooks(clientId) {
    const url = `http://localhost:5223/api/Clients/${clientId}/purchased-books`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            alert("Purchased books could not be fetched.");
            return null;
        }

        return response.json();
    } catch (error) {
        console.error("Purchased books could not be fetched", error);
    }
}

async function getLikedBooks(clientId) {
    const url = `http://localhost:5223/api/Clients/${clientId}/liked-books`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            alert("Liked books could not be fetched.");
            return null;
        }

        return response.json();
    } catch (error) {
        console.error("Liked books could not be fetched", error);
    }
}

async function getClientReviews(clientId) {
    const url = `http://localhost:5223/api/Clients/${clientId}/reviews`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            alert("Client reviews could not be fetched.");
            return null;
        }

        return response.json();
    } catch (error) {
        console.error("Client reviews could not be fetched", error);
    }
}
    
    function showBooksReviewed(reviews) {
        console.log(reviews)
        const bookCardsContainer = document.getElementById("book-cards");
    
        bookCardsContainer.innerHTML = "";
    
        if (!reviews || reviews.length === 0) {
            bookCardsContainer.innerHTML = "<div style='color: #FF0000;'>No content</div>";
        } else {

            reviews.forEach(review => {

                const cardDiv = document.createElement("div");
                cardDiv.className = "col-12 mb-2 p-2";
    
                // Add the content to the card
                cardDiv.innerHTML = `
                   <div class="card border-2 rounded-4 shadow-sm mb-3">
                        <div class="card-body d-flex flex-column p-4">
                            <div class="client-info mb-3">
                                <h5 class="card-title text-dark">${review.bookTitle}</h5>
                                <p class="card-text text-muted">Username: ${review.author}</p>
                                <p class="card-text text-muted">ID: ${review.idOfReview}</p>
                            </div>
                            <div class="review-text mb-3">
                                <p class="card-text">${review.reviewText}</p>
                            </div>
                            <div class="d-flex justify-content-center">
                                <button class="btn btn-outline-secondary rounded-pill px-4" id='btn-details-reviews-${review.bookId}'>Details</button>
                            </div>
                        </div>
                    </div>
                `;
    
                // Append the card to the container
                bookCardsContainer.appendChild(cardDiv);
    
                // Attach the event listener to the button
                const detailsButton = cardDiv.querySelector(`#btn-details-reviews-${review.bookId}`);
                detailsButton.addEventListener("click", () => {
                    localStorage.setItem("selectedBook", review.bookId); 
                    window.open("info-book-manager.html", "_blank");
                });
            });
        }
    }
    

function showBookPurchased(books) {
    const bookCardsContainer = document.getElementById("book-cards");
    bookCardsContainer.innerHTML = "";

    if (!books || books.length === 0) {
        bookCardsContainer.innerHTML = "<div style='color: #FF0000;'>No content</div>";
        return;
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
                            <p class="card-text"><strong>ID:</strong> ${book.bookId}</p>
                        </div>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-outline-primary details-btn" style="width: 170px;" id="details-purchased-${book.id}">Details</button>
                    </div>
                </div>
            `;

            // Append the card to cardDic
            bookCardsContainer.appendChild(cardDiv);

            const detailsButton = cardDiv.querySelector(`#details-purchased-${book.id}`);
            detailsButton.addEventListener("click", () => {
                localStorage.setItem("selectedBook", book.bookId); 
                window.open("info-book-manager.html", "_blank");
            });
        });
    }
}


async function showClientData(clientInfo){
    const clientName = document.getElementById('client-name');

    console.log("Clients data:", clientInfo);

    clientName.textContent = `${clientInfo.name} ${clientInfo.lastName}`;

    document.querySelector("#client-name").innerHTML = `${clientInfo.name} ${clientInfo.lastName}`;
    document.querySelector("#client-email").innerHTML = `${clientInfo.email}`;
    document.querySelector("#client-birthday").innerHTML = `${clientInfo.birthday.slice(0,10)}`;
    document.querySelector("#client-username").innerHTML = `${clientInfo.username}`;
    document.querySelector("#client-password").innerHTML = `${clientInfo.password}`;
    document.querySelector("#client-id").innerHTML = `${clientInfo.id}`;
}

// Function to handle delete client action
async function deleteClient(id) {
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

           // Close the tab after deletion
            window.close();
        } catch (error) {
            console.error("Client could not be deleted", error);
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    // Safely add event listener to logout button
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", logoutAction);
    } else {
        console.warn("Logout button not found.");
    }

    setTimeout(() => {
        showClientInfo();
    }, 500); 
});

export { showBookPurchased };