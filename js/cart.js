document.addEventListener("DOMContentLoaded", () => {
  fetch("json/data.json")
    .then((response) => response.json())
    .then((data) => {
      const books = data.books;
      let cart = JSON.parse(localStorage.getItem("cartBooks")) || [];

      function addToCart(bookId) {
        const book = books.find((b) => b.ID === bookId);
        if (!book) {
          console.error(`Book with ID ${bookId} not found.`);
          return;
        }

        const cartItem = cart.find((item) => item.ID === bookId);
        if (cartItem) {
          cartItem.quantity += 1;
        } else {
          cart.push({ ...book, quantity: 1 });
        }

        renderCart();
      }

      function removeFromCart(bookId) {
        cart = cart.filter((item) => item.ID !== bookId);
        renderCart();
      }

      function updateQuantity(bookId, quantity) {
        const cartItem = cart.find((item) => item.ID === bookId);
        if (cartItem) {
          cartItem.quantity = Math.max(parseInt(quantity, 10), 1); // Ensure minimum quantity of 1
          renderCart();
        }
      }

      function renderCart() {
        const cartItemsContainer = document.getElementById("cart-items");
        cartItemsContainer.innerHTML = "";

        let totalPrice = 0;

        cart.forEach((item) => {
          totalPrice += item.Price * item.quantity;

          const row = document.createElement("tr");
          row.innerHTML = `
              <td><img src="${item["Cover Image URL"]}" alt="${
            item.Title
          }" width="50"></td>
              <td>${item.Title}</td>
              <td>$${item.Price.toFixed(2)}</td>
              <td>
                <input 
                  type="number" 
                  class="quantity-input" 
                  value="${item.quantity}" 
                  min="1" 
                  onchange="updateQuantity(${item.ID}, this.value)">
              </td>
              <td><button class="remove-btn" onclick="removeFromCart(${
                item.ID
              })">🗑️</button></td>
            `;
          cartItemsContainer.appendChild(row);
        });

        document.getElementById(
          "total-price"
        ).innerText = `Total: $${totalPrice.toFixed(2)}`;
      }

      // Example of adding books from the cart
      cart.forEach((item) => addToCart(item.ID));

      // Expose functions to the global scope
      window.updateQuantity = updateQuantity;
      window.removeFromCart = removeFromCart;

      $("#go-back-btn").click(function () {
        // localStorage.setItem("cartBooks", JSON.stringify(cart));
        window.location.href = "book-browse.html";
      });
    })
    .catch((error) => console.error("Error fetching books:", error));
});
