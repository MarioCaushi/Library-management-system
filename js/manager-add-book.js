import { logoutAction } from "./manager-book-management.js";

//Function to check if book exists
async function bookExist(title)
{
    const url = `http://localhost:5223/Book/check-book/${title}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Failed to fetch book cards:', error);
        return;
    }
}


//Function to add a new book
async function addBook(book)
{
    const url = `http://localhost:5223/Book/add-book`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });

        if (!response.ok) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Failed to fetch book cards:', error);
        return;
    }
}

//Function to evaluate the add-book form
async function bookFormEvaluation(event)
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
    


    let book = await bookExist(title);
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
            "Title": title,
            "Author": author,
            "Genre": genre,
            "PublishedYear": year, 
            "Description": description,
            "Price": price,
            "Rating": rating,
            "CoverImageUrl": url, 
            "IdManager": Number(JSON.parse(localStorage.getItem("manager"))),
        };

        const added = await addBook(newBook)

        if(added){
            console.log("New Book added: ", newBook);

            setTimeout(() => {
                alert("Book Added Successfully:)");
            }, 200)
        }
        else
        {
            setTimeout(() => {
                alert("Book Not Added ");
            }, 200)
        }
    }
}

document.addEventListener("DOMContentLoaded", function() { 
    document.getElementById("logout-button").addEventListener("click", logoutAction);  
    document.getElementById("form-register").addEventListener("submit", bookFormEvaluation);  
});
