import { logoutAction, selectBook } from "./manager-book-management.js";

//Funtion to show the info of a specific book when the info button is clicked ==> The MAIN function of this file
function showBookInfo()
{
    const bookInfo = JSON.parse(localStorage.getItem("selectedBook"));

    if(!bookInfo) {
        console.log("No bookInfo element from info-book-management file");
        return;
    }

    document.title = `Book Info - ${bookInfo["Title"]}!`;

    detailsBookInfo(bookInfo);

    const clientLikes = bookInfo["Likes-clients"].length;
    console.log("Book-likes length: ", clientLikes);

    showBookLikes(clientLikes,bookInfo,"info");

    const clientReviews =  bookInfo["Reviews"].length;
    console.log("Book-reviews length: ", clientReviews);

    showBookReviews(clientReviews, bookInfo, "info");

};


//Other complementary functions to the one above

//Function to deal with the WHOLE client-review part of the Book
function showBookReviews(clientReviews, bookInfo, keyword) {

    if(clientReviews==0) {
        showMessage("reviews");
    }
    else {

        const clients = JSON.parse(localStorage.getItem("client"));
        console.log("Clients: ", clients);
        
        if (!clients) {
            console.log("Client list from local storage is empty or something is wrong");
            return;
        }

        showReviews(bookInfo["Reviews"],clients, keyword, bookInfo);

          $("#search-book-reviews").on("input", () => searchBookReviews(bookInfo,clients, keyword));

          $("#clear-book-reviews").on("click", () => {
                    $("#search-book-reviews").val("");
                    showReviews(bookInfo["Reviews"],clients, keyword, bookInfo)});

    }

};


//function to show the reviews on a book
function showReviews(reviews,clients, keyword, book) {

    $("#book-reviews").empty();

    reviews.forEach(review => {

        const clientInfo = clients.find(client => client["ID"]==review["clientID"]);

        $("#book-reviews").append(
            `<div class="col-12 mb-2 p-2">
                <div class="card border-0 rounded-4 shadow-sm">
                    <div class="card-body d-flex flex-column p-4">
                        <div class="client-info mb-3">
                            <h5 class="card-title text-dark">${clientInfo['Name']}</h5>
                            <p class="card-text text-muted">Username: ${clientInfo['Username']}</p>
                            <p class="card-text text-muted">ID: ${clientInfo['ID']}</p>
                        </div>
                        <div class="review-text mb-3">
                            <p class="card-text">${review['review']}</p>
                        </div>
                        <div class="d-flex justify-content-end">
                            ${(keyword == "info") ? 
                                `<button class="btn btn-outline-secondary rounded-pill px-4" id='btn-details-reviews-${clientInfo['ID']}'>Details</button>` :
                                `<button class="btn btn-outline-danger rounded-pill px-4" id='btn-delete-reviews-${clientInfo['ID']}'>Delete</button>`}
                        </div>
                    </div>
                </div>
            </div>`
        );
        if(keyword=="info"){ 
            $(`#btn-details-reviews-${clientInfo['ID']}`).on("click", detailsClientInfo);
        }
        if(keyword=="edit"){
            $(`#btn-delete-reviews-${clientInfo['ID']}`).on("click", () => { 
                deleteButtonEdit(book,clientInfo['ID'],clients, "review")});
        }
    });

};


// Function to make use of the search-bar for book reviews
function searchBookReviews(bookInfo,clients,keyword) {

    const searchedKeyword = $("#search-book-reviews").val();
    console.log("Keyword for reviews is: ", searchedKeyword);

    const searchedReviews = searchBookReviewsHelper(bookInfo["Reviews"], clients, searchedKeyword);

    showReviews(searchedReviews, clients, keyword, bookInfo);
};


// A helper function to search through reviews based on the keyword
function searchBookReviewsHelper(reviews, clients, keyword) {
    if (keyword == "") {
        return reviews;
    } else {
        let searchedReviews = [];

        reviews.forEach(review => {
            const clientInfo = clients.find(client => client["ID"]==review["clientID"]);

            if (!clientInfo) return;

            const clientName = clientInfo.Name.toLowerCase();
            const clientUsername = clientInfo.Username.toLowerCase();
            const clientID = clientInfo["ID"].toString();
            const reviewText = review.review.toLowerCase();
            

            if (clientName.includes(keyword.toLowerCase()) || 
                clientUsername.includes(keyword.toLowerCase()) || 
                clientID.includes(keyword.toLowerCase()) ||
                reviewText.includes(keyword.toLowerCase())) {
                searchedReviews.push(review);
            }
        });

        console.log("Searched Reviews: ", searchedReviews);
        return searchedReviews;
    }
};


//Function to deal with the WHOLE client-likes part
function showBookLikes(clientLikes,bookInfo,keyword) {


    if(clientLikes==0) {

        showMessage("likes");
    }
    else
    {

        const clients = JSON.parse(localStorage.getItem("client"));
        console.log("Clients: ", clients);
        
        if (!clients) {
            console.log("Client list from local storage is empty or something is wrong");
            return;
        }
        
        const likedClients = clients.filter(client => bookInfo["Likes-clients"].includes(client["ID"]));
        
        console.log("Liked Clients: ", likedClients);
        
        showClients(likedClients,keyword, bookInfo,clients);

        $("#search-book-likes").on("input", () => searchBookLikes(likedClients,keyword, bookInfo));

        $("#clear-book-likes").on("click" , () => {
            $("#search-book-likes").val("")
            showClients(likedClients,keyword, bookInfo,clients);
        });
    }

};


//Function to show the book details
function detailsBookInfo(bookInfo) {

    document.getElementById("book-image-container").innerHTML = `<img src="${bookInfo["Cover Image URL"]}" class="img-fluid rounded-4 border shadow-lg" alt="This is the book cover photo">`;
    document.querySelector("#book-title-container").innerHTML=`<h3>${bookInfo["Title"]}</h3>`;
    document.querySelector("#book-description-container").innerHTML=`<p> ${bookInfo["Description"]} </p>`;
    document.querySelector("#book-info-author").innerHTML=`${bookInfo["Author"]}`;
    document.querySelector("#book-info-genre").innerHTML=`${bookInfo["Genre"]} `;
    document.querySelector("#book-info-year").innerHTML=` ${bookInfo["Published Year"]} `;
    document.querySelector("#book-info-price").innerHTML=`${bookInfo["Price"]}$ `;
    document.querySelector("#book-info-rating").innerHTML=`${bookInfo["Rating"]} `;
    document.querySelector("#book-info-likes").innerHTML=`${bookInfo["Likes-clients"].length} `;
    document.querySelector("#book-info-reviews").innerHTML=`${bookInfo["Reviews"].length} `;
    document.querySelector("#book-info-id").innerHTML=`${bookInfo["ID"]} `;

    $("#delete-btn-info").click(deleteBookInfo);

    $("#edit-btn-info").on("click", () => {
        selectBook(bookInfo["ID"],"edit");
    });

};


//Function for the details button of client-likes cards
function detailsClientInfo() {
    alert("This feature is yet to be added");
};


//Function to show message at Book-likes/reviews
function showMessage(id) 
{
    $(`#book-${id}`).append(
        `<div class="col-12 mb-3 p-2">
             <h6 class="text-center" style="color: rgb(253, 96, 96);"> No Content on this part yet. :(</h6>
         </div>`
    );

    $(`#search-book-${id}`).prop("disabled", true);
    $(`#clear-book-${id}`).prop("disabled", true);
}


//function to show the clients who liked the book
function  showClients(likedClients,keyword, bookInfo,clients) {

    $("#book-likes").empty();

    likedClients.forEach(clientInfo => {
        $("#book-likes").append(
            `<div class="col-12 mb-3 p-2">
                <div class="card d-flex flex-row align-items-center border-0 rounded-5 shadow-sm bg-light">
                    <div class="card-body d-flex justify-content-between w-100 p-3">
                        <!-- Client Info -->
                        <div class="client-info d-flex flex-column">
                            <h5 class="card-title text-dark">${clientInfo['Name']}</h5>
                            <p class="card-text text-muted">Username: ${clientInfo['Username']}</p>
                            <p class="card-text text-muted">ID: ${clientInfo['ID']}</p>
                        </div>
                        ${(keyword=="info") ? 
                            `<div class="d-flex align-items-center p-2">
                            <button class="btn btn-outline-primary rounded-pill px-4" id='btn-details-likes-${clientInfo['ID']}'>Details</button>
                        </div> ` : 
                        `<div class="d-flex align-items-center p-2">
                            <button class="btn btn-outline-danger rounded-pill px-4" id='btn-delete-likes-${clientInfo['ID']}'>Delete</button>
                        </div>` }

                    </div>
                </div>
            </div>`
        );

        if(keyword=="info"){
            $(`#btn-details-likes-${clientInfo['ID']}`).on("click", detailsClientInfo);
        }

        if(keyword=="edit"){
            $(`#btn-delete-likes-${clientInfo['ID']}`).on("click", () => { 
                deleteButtonEdit(bookInfo,clientInfo['ID'],clients, "client")}); 
        }
    });
};


//Function to delete a book on the info page
function deleteBookInfo() {

    const agree = confirm("Are you sure you want to delete this Book?");

    if(agree) {

        const bookInfo = JSON.parse(localStorage.getItem("selectedBook"));

        console.log("Consoling book Info",bookInfo);

        let books = JSON.parse(localStorage.getItem("book"));

        console.log("Consoling the list of all the books: ", books);

        books = books.filter(book => book.ID !== bookInfo.ID );

        localStorage.setItem("book", JSON.stringify(books));

        window.location.href="manager-book-management.html";
    }
};


//Function to make use of the search-bar
function searchBookLikes(clients, keyword, book) {
    const searchkeyword = $("#search-book-likes").val();
    console.log("Keyword is: ", searchkeyword);

    const searchedClients = searchBookLikesHelper(clients, searchkeyword);

    showClients(searchedClients,keyword,book);
};


//A helper function for the searchBookLikes
function searchBookLikesHelper(clients, searchkeyword) {

    if (searchkeyword == "") {
        return clients;
    }
    else {
        let searchedClients = [];

        clients.forEach(client => {

            if (client["Name"].toLowerCase().includes(searchkeyword.toLowerCase())
                || client["Username"].toLowerCase().includes(searchkeyword.toLowerCase())
                || JSON.stringify(client["ID"]).toLowerCase().includes(searchkeyword.toLowerCase())) {
                searchedClients.push(client);
            }
        });

        console.log("Searched Clients are: ", searchedClients);

        return searchedClients;
    }
};

//Function to give functionality to the delete buttons in the edit page
function deleteButtonEdit(book,clientID,clients, keyword) {

    if(keyword=="client") {
        
        book["Likes-clients"] = book["Likes-clients"].filter(id => id != clientID);

        localStorage.setItem("selectedBook", JSON.stringify(book));

        let books = JSON.parse(localStorage.getItem("book"));

        books = books.map((newBook) => {
            if (newBook["ID"] === book["ID"]) {
                return { ...book };
            }
            return newBook;
        });

        localStorage.setItem("book", JSON.stringify(books));

        clients.forEach(client => {

            if(client["ID"] == clientID)
                {
                    client["Books-liked"]= client["Books-liked"].filter(id => id != book["ID"] );
                }
        });

        localStorage.setItem("client", JSON.stringify(clients));

        alert("Client Like Deleted");

        location.reload();

        showClients(book["Likes-clients"],keyword, book);
    }

    if (keyword == "review") {

        book["Reviews"] = book["Reviews"].filter(review => review["clientID"] != clientID);
    
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
    
        showReviews(book["Reviews"], clients, keyword, book);
    }

};



//The actual function callings
$(document).ready(function() {
    document.getElementById("logout-button").addEventListener("click", logoutAction);  
    showBookInfo();

});

export {showBookInfo,deleteBookInfo, showBookLikes, showBookReviews};