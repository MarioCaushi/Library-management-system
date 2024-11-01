const renderAllBooks = () => {
  books = JSON.parse(localStorage.getItem("book"));
  let booksTemplate = "";
  books.forEach((book) => {
    booksTemplate +=
      '<li id="book-container"><img id="cover-img" src="' +
      book["Cover Image URL"] +
      '"/><div id="book-details"><h2 id="book-title">' +
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

renderAllBooks();

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
