import {fetchData} from "./index.js"; 

//A function for the log out button to work
function logoutAction(){
    const decision =  confirm("Are you sure?");
    
    console.log(decision);

    if(decision)
        {
            console.log("Manager logged out");
            window.location.href="index.html";
        }
}

//Function to check if the localStorage is valid and if not then fetching the data from the Data.json file again 
//using the imported function 
function dataValidation(){

    if(localStorage.length===0)
        {
            fetchData();
        }
        else {
            let manager = JSON.parse(localStorage.getItem("manager"));
            let client = JSON.parse(localStorage.getItem("client"));
            let book = JSON.parse(localStorage.getItem("book"));

            console.log("Data Validation: ",manager);
            console.log("Data Validation",client);
            console.log("Data Validation", book);

            if(!manager || !book || !client)
                {
                    fetchData();
                }
        }
}

//Getting the list of books from local storage
const books=JSON.parse(localStorage.getItem("book"));

//Function to show the list of books
function showBooks(books) {

    const container = document.getElementById("viewBooks-management-container");
    container.innerHTML = "";

    books.forEach(book => {
        
        const card = document.createElement("div");
        card.className = "card mx-auto border border-dark border-opacity-50 rounded-3 shadow-md m-5 p-1";
        card.style.width = "300px";

        let imageURL = book["Cover Image URL"];
        let title = book["Title"];
        let author = book["Author"];
        let genre = book["Genre"];
        let price = book["Price"];
        let bookID = book["ID"];

        card.innerHTML = `
            <img src="${imageURL}" class="card-img-top" alt="Book Cover Image" style="height: 450px">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Author: ${author}</li>
                <li class="list-group-item">Genre: ${genre}</li>
                <li class="list-group-item">Book Price: ${price}$</li>
                <li class="list-group-item">Book ID: ${bookID}</li>
            </ul>
            <div class="card-body d-flex justify-content-center">
                <button type="button" class="btn btn-danger m-1" id="delete-${bookID}">Delete</button>
                <button type="button" class="btn btn-warning m-1" id="edit-${bookID}">Edit</button>
                <button type="button" class="btn btn-info m-1" id="info-${bookID}">Info</button>
            </div>            
        </div>`;

        container.appendChild(card);

        // Attach event listener for delete button
        const deleteButton = card.querySelector(`#delete-${bookID}`);
        deleteButton.addEventListener("click", function () {
            deleteBook(bookID, books);
        });
    });
}

// Function for searching 
function search(books) {
    
    const searchValue = document.getElementById("search-book-management").value;
    console.log("Search Value:", searchValue); // For debugging

    const searchBooks = searchHelper(books, searchValue);
    console.log(searchBooks); //Debugging purposes
    showBooks(searchBooks);
}


// Creating a helper function to find the books with a certain keyword
function searchHelper(books, word) {

    let searchBooks = [];

    if (word === "") {

        return books;

    } else {

        books.forEach(book => {

            if (
                book.Title.toLowerCase().includes(word.toLowerCase()) ||
                book.Author.toLowerCase().includes(word.toLowerCase()) ||
                book.Genre.toLowerCase().includes(word.toLowerCase()) ||
                book.Price.toString().includes(word) ||
                book.ID.toString() === word
            ) {

                searchBooks.push(book);

            }
        });
        
        return searchBooks;
    }
}

//Funtion to delete a book
function deleteBook(id, books) {

    console.log("ID selected to delete book: ", id);
    console.log("Print all the books for debugging purposes:", books);

    const agree = confirm("Are you sure?");

    if(agree) {
        const updatedBooks = books.filter(book => book.ID !== id);

        console.log("Print the updated list of books to see if there are any changes made",updatedBooks);
    
        localStorage.setItem("book",JSON.stringify(updatedBooks));
    
        showBooks(updatedBooks);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    try {
        document.getElementById("logout-button").addEventListener("click", logoutAction);
        dataValidation();
        showBooks(books);
        
        document.getElementById("search-book-management").addEventListener("input", function() {
            search(books);
        });
        
        document.getElementById("clear-book-management-button").addEventListener("click", function() {
            document.getElementById("search-book-management").value = "";
            showBooks(books);
        });
    } catch (error) {
        console.error("An error occurred:", error);

    }
});


export {logoutAction};