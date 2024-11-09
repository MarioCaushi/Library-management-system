books = JSON.parse(localStorage.getItem("book"));

const renderAllBooks = () => {
  let pageContainer = document.getElementById("books-container");
  pageContainer.innerHTML = "";
  pageContainer.innerHTML +=
    "<div id='contain'><ul id='book-grid' type='none'></ul></div>";
  let booksTemplate = "";

  books.forEach((book) => {
    booksTemplate +=
      '<li class="book-container" id="' +
      book.ID +
      '"onclick="renderbookInfo(' +
      book.ID +
      ')"><img id="cover-img" src="' +
      book["Cover Image URL"] +
      '"/><div id="book-details"><h2 id="book-title" >' +
      book.Title +
      '</h2><span id="book-author">Author: ' +
      book.Author +
      '</span><span id="book-year">Published Year: ' +
      book["Published Year"] +
      '</span><span id="book-rating">Rating: ' +
      book.Rating +
      ' / 5</span><span id="book-price">$' +
      book.Price +
      ' USD</span><button id="like-btn"><i class="fas fa-heart"></i>Like<span class="like-count">123</span></button><br><button id="cart-btn"><i class="fas fa-shopping-cart"></i>Add to Cart</button></div></li>';
  });

  document.getElementById("book-grid").innerHTML += booksTemplate;
};

/*
'<li class="book-container">
  <img id="cover-img" src="' + book["Cover Image URL"] + '"/>
  <div class="book-details">
    <h2 id="book-title">' + book.Title + '</h2>
    <span id="book-author">Author: ' + book.Author + '</span>
    <span id="book-year">Published Year: ' + book["Published Year"] + '</span>
    <span id="book-rating">Rating: ' + book.Rating + '</span>
    <span id="book-price">$' + book.Price + ' USD</span>
	<button id='like-btn'><i class='fas fa-heart'></i>Like<span class='like-count'>123</span></button><br><button id='cart-btn'><i class='fas fa-shopping-cart'></i>Add to Cart</button></li>";
  </div>
  </li>'
*/

const renderbookInfo = (bookID) => {
  specificBook = books[bookID - 1];
  let bookInfo = document.getElementById("books-container");
  let bookStyling = document.getElementsByTagName("head")[0];
  bookInfo.innerHTML =
    "<input type='button' value='Go Back' onclick='renderAllBooks()' />";
  let bookInfoTemplate = `
    <div id="specific-book-container">
      <div id="specific-cover-image">
        <img src="${specificBook["Cover Image URL"]}"
      </div>
      <div id="specific-book-info">
        <h2 id="specific-title">${specificBook.Title}</h2>
        <p id="specific-author"><strong>Author: </strong>${specificBook.Author}</p>
        <p id="specific-genre"><strong>Genre: </strong>${specificBook.Genre}</p>
        <p id="specific-published"><strong>Published Year: </strong>${specificBook["Published Year"]}</p>
        <p id="specific-description"><strong>Description: </strong>${specificBook.Description}</p>
        <div>
          <span id="specific-price"><strong>Price: </strong>${specificBook.Price}</span>
          <span id="specific-rating"><strong>Rating: </strong>${specificBook.Rating} / 5</span>
        </div>
        <div>
        </div>
      </div>
    </div>
  `;
  bookInfo.innerHTML += bookInfoTemplate;
  bookStylingTemplate = `
  <style>

    /* Body styling */
    #specific-book-container {
      font-family: 'Montserrat', sans-serif;
      background-color: #f9f9fb;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: #333;
    }

    /* Book container styling */
    // #specific-book-container {
    //   display: flex;
    //   max-width: 900px;
    //   background-color: #fff;
    //   border-radius: 12px;
    //   overflow: hidden;
    //   box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    // }

    /* Cover image */
    #specific-cover-image {
      flex: 1;
      max-width: 300px;
      background-color: #f4f4f7;
    }

    #specific-cover-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-right: 1px solid #e0e0e0;
    }

    /* Book information styling */
    #specific-book-info {
      flex: 2;
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Title and Author */
    #specific-title {
      font-family: 'Lora', serif;
      font-size: 28px;
      color: #333;
      font-weight: 600;
      margin-bottom: 8px;
    }

    #specific-author, #specific-genre, #specific-published, #specific-description {
      margin: 6px 0;
      line-height: 1.6;
      color: #555;
    }

    #specific-author strong, #specific-genre strong, #specific-published strong, #specific-description strong {
      color: #333;
    }

    /* Price and Rating */
    #specific-price, #specific-rating {
      font-weight: 500;
      color: #4b8d62;
    }

    /* Price and Rating container */
    #specific-book-info div {
      display: flex;
      gap: 20px;
      margin-top: 20px;
      font-size: 16px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      #specific-book-container {
        flex-direction: column;
        max-width: 90%;
      }

      #specific-cover-image {
        max-width: 100%;
      }
    }
  </style>
  `;
  bookStyling.innerHTML += bookStylingTemplate;
};

/*
<div class="book-container">
  <div class="cover-image">
    <img>
  </div>
  <div class="book-info">
    <h2>Title</h2>
    <p><strong>Author:</strong>Author/p>
    <p><strong>Genre:</strong> Classic</p>
    <p><strong>Published Year:</strong> 1925</p>
    <p><strong>Description:</strong> Set in the Roaring Twenties, 'The Great Gatsby' tells the story of the enigmatic Jay Gatsby and his obsession with the beautiful Daisy Buchanan. It captures the decadence and excess of the era while exploring themes of love, wealth, and the American Dream.</p>
    <div class="price-rating">
      <span><strong>Price:</strong> $10.99</span>
      <span><strong>Rating:</strong> 4.5 / 5</span>
    </div>
    <div class="reviews">
      <h3>Reviews:</h3>
      <div class="review-item">
        <p>"A beautifully written tale that captures the essence of a lost era. Gatsby's tragic love story is haunting."</p>
      </div>
      <div class="review-item">
        <p>"A classic that never gets old. Fitzgerald's prose is stunning, and the themes are still relevant today."</p>
      </div>
    </div>
  </div>
</div>
*/

renderAllBooks();
