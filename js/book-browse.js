const renderAllBooks = () => {
  books = JSON.parse(localStorage.getItem("book"));
  let booksTemplate = "";
  books.forEach((book) => {
    booksTemplate +=
      '<li><img id="cover-img" src="' +
      book["Cover Image URL"] +
      '"/><h2 id="book-title">' +
      book.Title +
      "</h2><span id='book-author'>" +
      book.Author +
      "</span><span id='book-year'>" +
      book["Published Year"] +
      "</span><span id='book-rating'>" +
      book.Rating +
      "</span><span id='book-price'>$" +
      book.Price +
      " USD</span><button id='like-btn'>Like</button><br><button id='cart-btn'><i class='fas fa-shopping-cart'></i>Add to Cart</button></li>";
  });
  document.getElementById("book-container").innerHTML += booksTemplate;
};

renderAllBooks();

/*
<li>
    <img />
    <h2>Title</h2>
    <span>Author</span>
    <span>Published Year</span>
    <span>Rating</span>
    <span>Price</span>
    <button>Like</button>
    <button>Cart</button>
</li>
*/
