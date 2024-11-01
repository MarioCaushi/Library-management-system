const renderAllBooks = () => {
  books = JSON.parse(localStorage.getItem("book"));
  let booksTemplate = "";
  books.forEach((book) => {
    booksTemplate +=
      '<li><img src="' +
      book["Cover Image URL"] +
      '"/><br><h2>' +
      book.Title +
      "</h2><span>" +
      book.Author +
      "</span><span>" +
      book["Published Year"] +
      "</span><br><span>" +
      book.Rating +
      "</span><br><span>$" +
      book.Price +
      " USD</span><br><button>Like</button><br><button>Add to Cart</button></li>";
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
