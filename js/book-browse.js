let userID = JSON.parse(localStorage.getItem("user"));
let cartBooks = JSON.parse(localStorage.getItem("cartBooks")) || [];

const fetchBooks = async () => {
  const url = `http://localhost:5223/Browser/books`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return null;
  }
};

const fetchBook = async (id) => {
  const url = `http://localhost:5223/Browser/books/${id}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch specific book", error);
    return null;
  }
};

const fetchBookReviews = async (id) => {
  const url = `http://localhost:5223/Browser/get-book-reviews/${id}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch this book's reviews", error);
    return null;
  }
};

const addBookReview = async (bookId, clientId, review) => {
  const url = `http://localhost:5223/Browser/client/${clientId}/add-review/${bookId}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        IdClient: `${clientId}`,
        IdBook: `${bookId}`,
        ReviewText: `${review}`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to add review", error);
    return null;
  }
};

const fetchUser = async (id) => {
  const url = `http://localhost:5223/Browser/client/${id}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to get current user", error);
    return null;
  }
};

const createCart = async (id) => {
  const url = `http://localhost:5223/Cart/cart/${id}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to get cart", error);
    return null;
  }
};

const fetchLikes = async (id) => {
  const url = `http://localhost:5223/api/Clients/${id}/liked-books`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch likes:", error);
    return null;
  }
};

const deleteBookLike = async (bookId, userId) => {
  const url = `http://localhost:5223/api/Clients/clients/${userId}/liked-books/${bookId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to delete like", error);
    return null;
  }
};

const addLike = async (bookId, userId) => {
  const url = `http://localhost:5223/Browser/client/${userId}/books/${bookId}/add-like`;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to add like", error);
    return null;
  }
};

const renderAllBooks = async () => {
  let books = await fetchBooks();
  let pageContainer = document.getElementById("books-container");
  pageContainer.innerHTML = "";
  pageContainer.innerHTML +=
    "<div id='contain'><ul id='book-grid' type='none'></ul></div>";
  let booksTemplate = "";
  books.forEach((book) => {
    booksTemplate += `<li class="book-container" id="${book.idBook}" >
    <img id="cover-img" src="${book.coverImageUrl}" onclick="renderbookInfo(${book.idBook})" />
    <div id="book-details">
        <h2 id="book-title" >${book.title}</h2>
        <span id="book-author">Author: ${book.author}</span>
        <span id="book-year">Published Year: ${book.publishedYear}</span>
        <span id="book-rating">Rating: ${book.rating} / 5</span>
        <span id="book-price">$${book.price} USD</span>
        <button id="like-btn" onclick="checkUserLikes(${book.idBook})">
            <i class="fas fa-heart"></i>Like
            <span class="like-count" id="like-count${book.idBook}">${book.likes}</span>
        </button>
        <br>
        <button id="cart-btn" onclick="addBookToCart(${book.idBook})">
            <i class="fas fa-shopping-cart"></i>Add to Cart
        </button>
    </div>
</li>`;
  });

  document.getElementById("book-grid").innerHTML += booksTemplate;
};

const renderbookInfo = async (bookID) => {
  let specificBook = await fetchBook(bookID);

  let bookInfo = document.getElementById("books-container");
  let bookStyling = document.getElementsByTagName("head")[0];
  bookInfo.innerHTML = `
    <button class="go-back" onclick='renderAllBooks()'>
      <i class="fas fa-arrow-left"></i> Go Back
    </button>
    `;
  let bookInfoTemplate = `
    <div id="specific-book-container">
      <div id="specific-book-details">
        <div id="specific-cover-image">
          <img src="${specificBook.coverImageUrl}"
        </div>
        <div id="specific-book-info">
          <h2 id="specific-title">${specificBook.title}</h2>
          <p id="specific-author"><strong>Author: </strong>${specificBook.author}</p>
          <p id="specific-genre"><strong>Genre: </strong>${specificBook.genre}</p>
          <p id="specific-published"><strong>Published Year: </strong>${specificBook.publishedYear}</p>
          <p id="specific-description"><strong>Description: </strong>${specificBook.description}</p>
          <div>
            <span id="specific-price"><strong>Price: </strong>${specificBook.price}$</span>
            <span id="specific-rating"><strong>Rating: </strong>${specificBook.rating} / 5</span>
          </div>
          <div>
            <button id="like-btn" onclick="checkUserLikes(${bookID})>
            <i class="fas fa-heart"></i>Like
            <span class="like-count" id="like-count${bookID}">${specificBook.likes}</span>
            </button>
            <button id="cart-btn" onclick="addBookToCart(${bookID})">
            <i class="fas fa-shopping-cart"></i>Add to Cart
            </button>
          </div>
        </div>
      </div>
        `;

  let specificBookReviews = await fetchBookReviews(bookID);
  bookInfoTemplate += `
  <div class="add-review">
    <h3>Add Your Review</h3>
    <textarea id="review-input" placeholder="Write your review here..." rows="4" cols="50"></textarea>
    <button id="submit-review" onclick="submitReview(${bookID})">Submit Review</button>
  </div>
  <h3>Reviews:</h3>
  <div id="reviews-container">`;
  specificBookReviews.forEach((review) => {
    bookInfoTemplate += `
      <div class="review">
        <span id="review-header"><strong>${review.username}</strong> has left a review: </span>
        <p id="review-content">${review.review}</p>
      </div>
    `;
  });
  bookInfoTemplate += "</div></div>";

  bookInfo.innerHTML += bookInfoTemplate;
  bookStylingTemplate = `
  <style>
    #books-container {
      font-family: 'Montserrat', sans-serif;
      background-color: rgb(155, 103, 103);
      color: #333;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }   
    
    #specific-book-details {
      width: 100%;
      gap: 20px;
      padding: 20px;
    }

    #specific-book-container {
      display: flex;
      width: 100%;  
      background-color: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
    #specific-cover-image {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f4f4f7;
      padding: 20px;
    }

    #specific-cover-image img {
      width: 100%;
      max-width: 450px;
      height: auto;
      object-fit: cover;
      border-radius: 8px;
    }

    #specific-book-info {
      flex: 1;
      padding: 40px;
      display: flex;
      flex-direction: column;
    }

    #specific-title {
      font-family: 'Lora', serif;
      font-size: 32px;
      color: #333;
      font-weight: 600;
      margin-bottom: 10px;
    }

    #specific-author, #specific-genre, #specific-published, #specific-description {
      margin: 8px 0;
      line-height: 1.6;
      color: #555;
    }

    #specific-author strong, #specific-genre strong, #specific-published strong, #specific-description strong {
      color: #333;
    }

    #specific-price, #specific-rating {
      font-weight: 500;
      color: #4b8d62;
    }

    #specific-book-info div {
      display: flex;
      gap: 20px;
      margin-top: 20px;
      font-size: 16px;
    }

    #reviews-container {
      display: flex;
      gap: 20px;
      // margin-top: 20px;
      font-size: 16px;
      flex-direction: column;
      width: 100%;
      padding: 20px;
      background-color: #f4f4f7;
      border-top: 1px solid #ddd;

    }

    #reviews-container h3 {
      font-size: 24px;
      margin-bottom: 10px;
    }

    #review-header {
      font-size: 24px;
      margin-bottom: 10px;
    }

    .review {
      margin-bottom: 15px;
      padding: 15px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }

    .review strong {
      color: #333;
    }

    @media (max-width: 768px) {
      .book-details {
        flex-direction: column;
      }

      #specific-cover-image, #specific-book-info {
        width: 100%;
      }
    }
      .go-back {
  background-color: #ff6347;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  margin-right: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.go-back i {
  margin-right: 8px; 
}

.go-back:hover {
  background-color: #ff6347; 
  transform: scale(1.3);
  -webkit-transform: scale(1.02);
  -moz-transform: scale(1.02);
  -ms-transform: scale(1.02);
  -o-transform: scale(1.02);
}
  .add-review {
  margin-top: 20px;
}

#review-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
}

#submit-review {
  margin: 10px;
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

#submit-review:hover {
  background-color: #45a049;
}
  </style>
  `;
  bookStyling.innerHTML += bookStylingTemplate;
};

const addBookToCart = async (bookID) => {
  book = await fetchBook(bookID);
  cartBooks.push(book);

  console.log(cartBooks);

  const cartButton = document.getElementById("cart-button-container");
  cartButton.classList.add("pulsating");
  setTimeout(function () {
    cartButton.classList.remove("pulsating");
  }, 3000);
};

const submitReview = async (bookID) => {
  let user = await fetchUser(userID);
  const reviewInput = document.getElementById("review-input").value;
  addBookReview(bookID, userID, reviewInput);

  if (reviewInput.trim() === "") {
    alert("Please write a review before submitting.");
    return;
  }

  const newReviewTemplate = `
    <div class="review">
        <span id="review-header"><strong>${user.username}</strong> has left a review: </span>
        <p id="review-content">${reviewInput}</p>
      </div>
  `;

  document.getElementById("reviews-container").innerHTML += newReviewTemplate;
  document.getElementById("review-input").value = "";
};

const checkUserLikes = async (bookID) => {
  await addLike(bookID, userID);
  window.location.reload();
};

$("#go-cart-button").click(function (e) {
  localStorage.setItem("cartBooks", JSON.stringify(cartBooks));
  window.location.href = "cart.html";
});

$("#logout-button").click(function () {
  localStorage.clear();
  window.location.href = "index.html";
});

$("#home-button").click(function () {
  window.location.href = "welcome-client.html";
});

const navbar = document.getElementsByClassName("navbar")[0];
const sticky = navbar.offsetTop;

function stickyNavbar() {
  if (window.scrollY > sticky) {
    navbar.classList.add("fixed");
  } else {
    navbar.classList.remove("fixed");
  }
}
window.onscroll = function () {
  stickyNavbar();
};
renderAllBooks();
