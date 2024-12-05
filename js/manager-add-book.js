import { logoutAction } from "./manager-book-management.js";
import { fetchData } from "./index.js";

//Function to evaluate the add-book form
function bookFormEvaluation(event)
{
    event.preventDefault();

    let title = document.getElementById("title-input-book").value;
    let author = document.getElementById("author-input-book").value;
    let genre = document.getElementById("genre-input-book").value;
    let year = document.getElementById("year-input-book").value;
    let price = document.getElementById("price-input-book").value;
    let rating = document.getElementById("rating-input-book").value;
    let url = document.getElementById("image-input-book").value;
    let description = document.getElementById("description-input-book").value;

    //Consoling for debugging issues
    console.log("Title: ",title);
    console.log("Author: ",author);
    console.log("Genre: ",genre);
    console.log("Year: ",year);
    console.log("Price: ",price);
    console.log("Rating: ",rating);
    console.log("URL: ",url);
    console.log("Description: ",description);
    
    if(localStorage.length==0)
        {
            fetchData();
        }

    const books = JSON.parse(localStorage.getItem("book"));
    console.log("Books from local-storage: ",books);

    let book = books.find(book => book.Title.toLowerCase().trim() == title.toLowerCase().trim());
    console.log("If title is unique", book);

    if(book) {
        alert("Book Title is not unique, Book already exists");
    }
    else if(title.trim() == "" ||
            author.trim() == "" ||
            genre.trim() == "" ||
            year.trim() == "" ||
            price.trim() == "" ||
            rating.trim() == "" ||
            url.trim() == "" ||
            description.trim() == "")
            {
        alert("Complete all the fields")
    }
    else
    {
        document.getElementById("title-input-book").value="";
        document.getElementById("author-input-book").value="";
        document.getElementById("genre-input-book").value=""
        document.getElementById("year-input-book").value="";
        document.getElementById("price-input-book").value="";
        document.getElementById("rating-input-book").value="";
        document.getElementById("image-input-book").value="";
        document.getElementById("description-input-book").value="";

        const newBook = {
            "ID": books.length > 0 ? (books[books.length - 1].ID + 1) : 1,
            "Title": title,
            "Author": author,
            "Genre": genre,
            "Published Year": year,
            "Description": description,
            "Price": price,
            "Cover Image URL": url,
            "Rating": rating,
            "Reviews": [],
            "Likes-clients": []
        }

        console.log("New Book added: ", newBook);

        const newBooks = [...books,newBook];

        localStorage.setItem("book",JSON.stringify(newBooks));

        setTimeout(() => {
            alert("Book Added Successfully:)");
        }, 200)
    }
}

document.addEventListener("DOMContentLoaded", function() { 
    document.getElementById("logout-button").addEventListener("click", logoutAction);  
    document.getElementById("form-register").addEventListener("submit", bookFormEvaluation);  
});
