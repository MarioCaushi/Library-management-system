import { logoutAction, selectBook, deleteBookAPI } from "./manager-book-management.js";

//Function to get BookInfo fromm the API
async function getBookInfoAPI(id)
{
    const url = `http://localhost:5223/Book/get-book-info/${id}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch book cards:', error);
        return null;
    }
}

//Function to show the info of a specific book when the info button is clicked ==> The MAIN function of this file
async function showBookInfo()
{
    const bookInfoId = JSON.parse(localStorage.getItem("selectedBook"));

    const bookInfo = await getBookInfoAPI(bookInfoId);

    if(!bookInfo) {
        console.log("No bookInfo element from info-book-management file");
        return;
    }

    document.title = `Book Info - ${bookInfo["title"]}!`;

    detailsBookInfo(bookInfo);

    const clientLikes = bookInfo["noLikes"];
    console.log("Book-likes length: ", clientLikes);

    showBookLikes(clientLikes,bookInfo,"info");

    const clientReviews =  bookInfo["noReviews"];
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

        showReviews(bookInfo["bookReviews"], keyword);

          $("#search-book-reviews").on("input", () => searchBookReviews(bookInfo["bookReviews"], keyword));

          $("#clear-book-reviews").on("click", () => {
                    $("#search-book-reviews").val("");
                    showReviews(bookInfo["bookReviews"], keyword)});

    }

};


//function to show the reviews on a book
function showReviews(reviews, keyword) {

    $("#book-reviews").empty();

    console.log(reviews);

    reviews.forEach(review => {

        $("#book-reviews").append(
            `<div class="col-12 mb-2 p-2">
                <div class="card border-0 rounded-4 shadow-sm">
                    <div class="card-body d-flex flex-column p-4">
                        <div class="client-info mb-3">
                            <h5 class="card-title text-dark">${review['name']}</h5>
                            <p class="card-text text-muted">Username: ${review['username']}</p>
                            <p class="card-text text-muted">ID: ${review['clientId']}</p>
                        </div>
                        <div class="review-text mb-3">
                            <p class="card-text">${review['review']}</p>
                        </div>
                        <div class="d-flex justify-content-end">
                            ${(keyword == "info") ? 
                                `<button class="btn btn-outline-secondary rounded-pill px-4" id='btn-details-reviews-${review['clientId']}'>Details</button>` :
                                `<button class="btn btn-outline-danger rounded-pill px-4" id='btn-delete-reviews-${review['clientId']}'>Delete</button>`}
                        </div>
                    </div>
                </div>
            </div>`
        );
        if(keyword=="info"){ 
            $(`#btn-details-reviews-${review['clientId']}`).on("click", () => {  
                detailsClientInfo(review['clientId'])} );
        }
        if(keyword=="edit"){
            $(`#btn-delete-reviews-${review['clientId']}`).on("click", () => { 
                deleteButtonEdit(review['clientID'], "review")});
        }
    });

};


// Function to make use of the search-bar for book reviews
function searchBookReviews(reviews,keyword) {

    const searchedKeyword = $("#search-book-reviews").val();
    console.log("Keyword for reviews is: ", searchedKeyword);

    const searchedReviews = searchBookReviewsHelper(reviews, searchedKeyword);

    showReviews(searchedReviews, keyword);
};


// A helper function to search through reviews based on the keyword
function searchBookReviewsHelper(reviews, keyword) {
    if (keyword == "") {
        return reviews;
    } else {
        let searchedReviews = [];

        reviews.forEach(review => {;

            const clientName = review["name"].toLowerCase();
            const clientUsername = review["username"].toLowerCase();
            const clientID = review["clientId"].toString();
            const reviewText = review["review"].toLowerCase();
            

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
        return;
    }
    else
    {

        showClients(bookInfo["bookLikes"],keyword);

        $("#search-book-likes").on("input", () => searchBookLikes(bookInfo["bookLikes"],keyword));

        $("#clear-book-likes").on("click" , () => {
            $("#search-book-likes").val("")
            showClients(bookInfo["bookLikes"],keyword);
        });
    }

};


//Function to show the book details
function detailsBookInfo(bookInfo) {

    document.getElementById("book-image-container").innerHTML = `<img src="${bookInfo["coverImageUrl"]}" class="img-fluid rounded-4 border shadow-lg" alt="This is the book cover photo">`;
    document.querySelector("#book-title-container").innerHTML=`<h3>${bookInfo["title"]}</h3>`;
    document.querySelector("#book-description-container").innerHTML=`<p> ${bookInfo["description"]} </p>`;
    document.querySelector("#book-info-author").innerHTML=`${bookInfo["author"]}`;
    document.querySelector("#book-info-genre").innerHTML=`${bookInfo["genre"]} `;
    document.querySelector("#book-info-year").innerHTML=` ${bookInfo["publishedYear"]} `;
    document.querySelector("#book-info-price").innerHTML=`${bookInfo["price"]}$ `;
    document.querySelector("#book-info-rating").innerHTML=`${bookInfo["rating"]} `;
    document.querySelector("#book-info-likes").innerHTML=`${bookInfo["noLikes"]} `;
    document.querySelector("#book-info-reviews").innerHTML=`${bookInfo["noReviews"]} `;
    document.querySelector("#book-info-id").innerHTML=`${bookInfo["bookId"]} `;

    $("#delete-btn-info").click(deleteBookInfo);

    $("#edit-btn-info").on("click", () => {
        selectBook(bookInfo["bookId"],"edit");
    });

};


//Function for the details button of client-likes cards
function detailsClientInfo(id) {

    localStorage.setItem("selectedClient", JSON.stringify(id));

    window.open("info-client-manager.html", "_blank");
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
function  showClients(likedClients,keyword) {

    $("#book-likes").empty();

    likedClients.forEach(clientInfo => {
        $("#book-likes").append(
            `<div class="col-12 mb-3 p-2">
                <div class="card d-flex flex-row align-items-center border-0 rounded-5 shadow-sm bg-light">
                    <div class="card-body d-flex justify-content-between w-100 p-3">
                        <!-- Client Info -->
                        <div class="client-info d-flex flex-column">
                            <h5 class="card-title text-dark">${clientInfo['name']}</h5>
                            <p class="card-text text-muted">Username: ${clientInfo['username']}</p>
                            <p class="card-text text-muted">ID: ${clientInfo['clientId']}</p>
                        </div>
                        ${(keyword=="info") ? 
                            `<div class="d-flex align-items-center p-2">
                            <button class="btn btn-outline-primary rounded-pill px-4" id='btn-details-likes-${clientInfo['clientId']}'>Details</button>
                        </div> ` : 
                        `<div class="d-flex align-items-center p-2">
                            <button class="btn btn-outline-danger rounded-pill px-4" id='btn-delete-likes-${clientInfo['clientId']}'>Delete</button>
                        </div>` }

                    </div>
                </div>
            </div>`
        );

        if(keyword=="info"){
            $(`#btn-details-likes-${clientInfo['clientId']}`).on("click", () => {  

                detailsClientInfo(clientInfo['clientId'])});
        };

        if(keyword=="edit"){
            $(`#btn-delete-likes-${clientInfo['clientId']}`).on("click", () => { 
                deleteButtonEdit(bookInfo,clientInfo['ID'],clients, "client")}); 
        }
    });
};


//Function to delete a book on the info page
async function deleteBookInfo() {

    const agree = confirm("Are you sure you want to delete this Book?");

    if(agree) {

        const bookInfo = JSON.parse(localStorage.getItem("selectedBook"));

        console.log("Consoling book Info",bookInfo);

        const deleted = await deleteBookAPI(bookInfo)

        if(deleted)
        {
            window.location.href="manager-book-management.html";
        }
        else
        {
            alert("Book not deleted");
        }
    }
};


//Function to make use of the search-bar
function searchBookLikes(clients, keyword) {

    const searchkeyword = $("#search-book-likes").val();

    console.log("Keyword is: ", searchkeyword);

    const searchedClients = searchBookLikesHelper(clients, searchkeyword);

    showClients(searchedClients,keyword);
};


//A helper function for the searchBookLikes
function searchBookLikesHelper(clients, searchkeyword) {

    if (searchkeyword == "") {
        return clients;
    }
    else {
        let searchedClients = [];

        clients.forEach(client => {

            if (client["name"].toLowerCase().includes(searchkeyword.toLowerCase())
                || client["username"].toLowerCase().includes(searchkeyword.toLowerCase())
                || JSON.stringify(client["clientId"]).toLowerCase().includes(searchkeyword.toLowerCase())) {
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