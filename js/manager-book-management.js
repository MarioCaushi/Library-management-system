//A function for the log out button to work
function logoutAction() {
    const decision = confirm("Are you sure?");

    console.log(decision);

    if (decision) {
        console.log("Manager logged out");
        window.location.href = "index.html";
    }
};

//Function to get the book cards from the database
async function fetchBookCards() {
    const url = 'http://localhost:5223/Book/get-book-cards';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch book cards:', error);
        return [];
    }
}

//Function to show the list of books
async function showBooks(books) {

    const container = document.getElementById("viewBooks-management-container");
    container.innerHTML = "";


    if (!books || books.length === 0) {
        container.innerHTML = "<p>No books available or failed to load books.</p>";
        return;
    }

    books.forEach(book => {
        const card = document.createElement("div");
        card.className = "card mx-auto border border-dark border-opacity-50 rounded-3 shadow-md m-5 p-1";
        card.style.width = "300px";

        let imageURL = book.coverImageUrl;
        let title = book.title;
        let author = book.author;
        let genre = book.genre;
        let price = book.price;
        let bookID = book.idBook;

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

        // Attach event listeners to each button
        const deleteButton = card.querySelector(`#delete-${bookID}`);
        deleteButton.addEventListener("click", function () {
            deleteBook(bookID);
        });

        const infoButton = card.querySelector(`#info-${bookID}`);
        infoButton.addEventListener("click", function () {
            selectBook(bookID, "info");
        });

        const editButton = card.querySelector(`#edit-${bookID}`);
        editButton.addEventListener("click", function () {
            selectBook(bookID, "edit");
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
};


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
    ;
}

//Function to get the book cards from the database
async function deleteBookAPI(id) {
    const url = `http://localhost:5223/Book/delete-book/${id}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
        });

        if (!response.ok) {
            return false
        }
        return true

    } catch (error) {
        console.error('Failed to fetch book cards:', error);
        return;
}
};

//Function to delete a book
async function deleteBook(id) {

    console.log("ID selected to delete book: ", id);

    const agree = confirm("Are you sure?");

    if (agree) {

        const deleted = deleteBookAPI(id)

        if(deleted)
        {
            location.reload();
            showBooks(updatedBooks);
        }
        else
        {
            alert("Book not deleted");
        }
    }
};

//Function to give functionality to edit and info book 
function selectBook(id, keyword) {

    localStorage.setItem("selectedBook", JSON.stringify(id));

    if (keyword == "info") {
        window.open("info-book-manager.html", "_blank");
    }

    if (keyword == "edit") {
        window.open("edit-book-management.html", "_blank");
    }
};


document.addEventListener("DOMContentLoaded", async function () {
    try {

        //Getting the books
        const books = await fetchBookCards();

        document.getElementById("logout-button").addEventListener("click", logoutAction);
        showBooks(books);

        document.getElementById("search-book-management").addEventListener("input", function () {
            search(books);
        });

        document.getElementById("clear-book-management-button").addEventListener("click", function () {
            document.getElementById("search-book-management").value = "";
            showBooks(books);
        });
    } catch (error) {
        console.error("An error occurred:", error);

    }
});


export { logoutAction, selectBook };