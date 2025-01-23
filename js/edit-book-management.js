import { logoutAction, selectBook } from "./manager-book-management.js";
import { deleteBookInfo, showBookLikes, showBookReviews, getBookInfoAPI } from "./info-book-manager.js";

//Function to show the book details page
async function showEditBook(){

    let bookId = JSON.parse(localStorage.getItem("selectedBook"));

    const editBook = await getBookInfoAPI(bookId);

    if(!editBook){
        console.log("editBook from localstorage does not exist", editBook);
        return;
    }

    document.title=`Book Edit - ${editBook["title"]}`;

    showBookDetails(editBook);

    $("#delete-btn-edit").on("click", deleteBookInfo );

    $("#discard-btn-edit").on("click", () => {
        showBookDetails(editBook)});

    $("#info-btn-edit").on("click", ()=>{
        selectBook(editBook["bookId"],"info");
    });

    $("#save-btn-edit").on("click", ()=>{
        saveEditBook(editBook);
    });


    showBookLikes(editBook["bookLikes"],"edit");

    showBookReviews(editBook["bookReviews"], "edit");

};

//Function to show the existing value of the book in the input field
function showBookDetails(editBook) {

    $("#title-edit-book ").val(`${editBook["title"]} `);
    $("#description-edit-book ").val(`${editBook["description"]} `);
    $("#author-edit-book ").val(`${editBook["author"]} `);
    $("#genre-edit-book ").val(`${editBook["genre"]} `);
    $("#year-edit-book ").val(editBook["publishedYear"]);
    $("#price-edit-book ").val(editBook["price"]);
    $("#rating-edit-book ").val(editBook["rating"]);
    $("#book-edit-likes ").html(`${editBook["noLikes"]}`);
    $("#book-edit-reviews ").html(`${editBook["noReviews"]} `);
    $("#book-edit-id ").html(`${editBook["bookId"]} `);
    $("#image-edit-book").val(`${editBook["coverImageUrl"]}`);
    $("#cover-image-edit").attr("src", `${editBook["coverImageUrl"]}`);
};

//Function to edit book in the backend
async function editBookAPI(book)
{
    const url = `http://localhost:5223/Book/update-book`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book),
        });

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Failed to fetch book cards:', error);
        return false;
    }
}

//Function to give functionality to the save button
async function saveEditBook(editBook) {

    if (editBook["title"].toLowerCase().trim() === $("#title-edit-book").val().toLowerCase().trim() &&
        editBook["description"].toLowerCase().trim() === $("#description-edit-book").val().toLowerCase().trim() &&
        editBook["author"].toLowerCase().trim() === $("#author-edit-book").val().toLowerCase().trim() &&
        editBook["genre"].toLowerCase().trim() === $("#genre-edit-book").val().toLowerCase().trim() &&
        editBook["publishedYear"] == $("#year-edit-book").val() &&
        editBook["price"] == $("#price-edit-book").val() &&
        editBook["rating"] == $("#rating-edit-book").val() &&
        editBook["coverImageUrl"] == $("#image-edit-book").val()) {

        alert("No changes were made!");

    } else {

        if (editBook["title"].toLowerCase().trim() !== $("#title-edit-book").val().toLowerCase().trim()) {
            editBook["title"]= $("#title-edit-book").val();
        }

        if (editBook["description"].toLowerCase().trim() !== $("#description-edit-book").val().toLowerCase().trim()) {
            editBook["description"]= $("#description-edit-book").val();
        }

        if (editBook["author"].toLowerCase().trim() !== $("#author-edit-book").val().toLowerCase().trim()) {
            editBook["author"] = $("#author-edit-book").val();
        }

        if (editBook["genre"].toLowerCase().trim() !== $("#genre-edit-book").val().toLowerCase().trim()) {
            editBook["genre"]= $("#genre-edit-book").val();
        }

        if (editBook["publishedYear"] != $("#year-edit-book").val()) {
            editBook["publishedYear"] = parseInt($("#year-edit-book").val());
        }

        if (editBook["price"] != $("#price-edit-book").val()) {
            editBook["price"] = parseFloat($("#price-edit-book").val());
        }

        if (editBook["rating"] != $("#rating-edit-book").val()) {
            editBook["rating"] = parseFloat($("#rating-edit-book").val());
        }

        if ($("#image-edit-book").val()) {
            editBook["coverImageUrl"] = $("#image-edit-book").val();
        }

        //Code for Backend Connection

        const newBook = {
            IdBook: editBook["bookId"],
            Title: editBook["title"],
            Author: editBook["author"],
            Genre:  editBook["genre"],
            PublishedYear:  editBook["publishedYear"],
            Description: editBook["description"],
            Price: editBook["price"],
            CoverImageUrl: editBook["coverImageUrl"],
            Rating:  editBook["rating"] ,
            IdManager: Number(JSON.parse(localStorage.getItem("manager"))),
        };

        const isEdited = await editBookAPI(newBook)

        if(isEdited)
        {
            window.location.reload(); 

            alert("Changes saved successfully!");
            return;
        }
        else
        {
            alert("Changes not saved successfully!");
            return;
        }
    }
}


//The actual function callings
$(document).ready(function() {
    document.getElementById("logout-button").addEventListener("click", logoutAction);  

    showEditBook();
});