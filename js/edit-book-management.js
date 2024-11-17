import { logoutAction, selectBook } from "./manager-book-management.js";
import { deleteBookInfo } from "./info-book-manager.js";

//Function to show the book details page
function showEditBook(){

    let editBook = JSON.parse(localStorage.getItem("selectedBook"));

    if(!editBook){
        console.log("editBook from localstorage does not exist", editBook);
        return;
    }

    document.title=`Book Edit - ${editBook["Title"]}`;

    showBookDetails(editBook);


    $("#delete-btn-edit").on("click", deleteBookInfo );

    $("#discard-btn-edit").on("click", () => {
        showBookDetails(editBook)});

    $("#info-btn-edit").on("click", ()=>{
        selectBook(editBook["ID"],"info");
    });

    $("#save-btn-edit").on("click", ()=>{
        saveEditBook(editBook);
    });


};

//Function to show the existing value of the book in the input field
function showBookDetails(editBook) {

    $("#title-edit-book ").val(`${editBook["Title"]} `);
    $("#description-edit-book ").val(`${editBook["Description"]} `);
    $("#author-edit-book ").val(`${editBook["Author"]} `);
    $("#genre-edit-book ").val(`${editBook["Genre"]} `);
    $("#year-edit-book ").val(editBook["Published Year"]);
    $("#price-edit-book ").val(editBook["Price"]);
    $("#rating-edit-book ").val(editBook["Rating"]);
    $("#book-edit-likes ").html(`${editBook["Likes-clients"].length}`);
    $("#book-edit-reviews ").html(`${editBook["Reviews"].length} `);
    $("#book-edit-id ").html(`${editBook["ID"]} `);
    $("#cover-image-edit").attr("src", `${editBook["Cover Image URL"]}`);
};

//Function to give functionality to the save button
function saveEditBook(editBook) {

    if (editBook["Title"].toLowerCase().trim() === $("#title-edit-book").val().toLowerCase().trim() &&
        editBook["Description"].toLowerCase().trim() === $("#description-edit-book").val().toLowerCase().trim() &&
        editBook["Author"].toLowerCase().trim() === $("#author-edit-book").val().toLowerCase().trim() &&
        editBook["Genre"].toLowerCase().trim() === $("#genre-edit-book").val().toLowerCase().trim() &&
        editBook["Published Year"] == $("#year-edit-book").val() &&
        editBook["Price"] == $("#price-edit-book").val() &&
        editBook["Rating"] == $("#rating-edit-book").val() &&
        !$("#image-edit-book").val()) {

        alert("No changes were made!");

    } else {
        if (editBook["Title"].toLowerCase().trim() !== $("#title-edit-book").val().toLowerCase().trim()) {
            editBook["Title"] = $("#title-edit-book").val();
        }

        if (editBook["Description"].toLowerCase().trim() !== $("#description-edit-book").val().toLowerCase().trim()) {
            editBook["Description"] = $("#description-edit-book").val();
        }

        if (editBook["Author"].toLowerCase().trim() !== $("#author-edit-book").val().toLowerCase().trim()) {
            editBook["Author"] = $("#author-edit-book").val();
        }

        if (editBook["Genre"].toLowerCase().trim() !== $("#genre-edit-book").val().toLowerCase().trim()) {
            editBook["Genre"] = $("#genre-edit-book").val();
        }

        if (editBook["Published Year"] != $("#year-edit-book").val()) {
            editBook["Published Year"] = parseInt($("#year-edit-book").val());
        }

        if (editBook["Price"] != $("#price-edit-book").val()) {
            editBook["Price"] = parseFloat($("#price-edit-book").val());
        }

        if (editBook["Rating"] != $("#rating-edit-book").val()) {
            editBook["Rating"] = parseFloat($("#rating-edit-book").val());
        }

        if ($("#image-edit-book").val()) {
            editBook["Cover Image URL"] = $("#image-edit-book").val();
        }

        localStorage.setItem("selectedBook", JSON.stringify(editBook));

        let books = JSON.parse(localStorage.getItem("book"));

        books = books.map((book) => {
            if (book["ID"] === editBook["ID"]) {
                return { ...editBook };
            }
            return book;
        });

        localStorage.setItem("book", JSON.stringify(books));

        alert("Changes saved successfully!");
    }
}


//The actual function callings
$(document).ready(function() {
    document.getElementById("logout-button").addEventListener("click", logoutAction);  

    showEditBook();
});