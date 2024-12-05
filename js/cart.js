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
          cartItem.quantity = 1;
        } else {
          cart.push({ ...cartItem, quantity: 1 });
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
                  onchange="updateQuantity(${item.ID}, Number(this.value))">
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

      cart.forEach((item) => addToCart(item.ID));

      window.updateQuantity = updateQuantity;
      window.removeFromCart = removeFromCart;

      $("#go-back-btn").click(function () {
        localStorage.setItem("cartBooks", JSON.stringify(cart));
        window.location.href = "book-browse.html";
      });

      $("#purchase-btn").click(function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Bookstore Receipt", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.text("Title", 20, 40);
        doc.text("Author", 80, 40);
        doc.text("Quantity", 140, 40);
        doc.text("Price", 180, 40);

        let y = 50;
        let totalAmount = 0;

        cart.forEach((book) => {
          const { Title, Author, Price, quantity } = book;
          const bookTotal = Price * quantity;
          totalAmount += bookTotal;

          doc.text(Title, 20, y);
          doc.text(Author, 80, y);
          doc.text(String(quantity), 140, y, { align: "right" });
          doc.text(`$${bookTotal.toFixed(2)}`, 180, y, { align: "right" });
          y += 10;
        });

        doc.setFont("helvetica", "bold");
        doc.text(`Total: $${totalAmount.toFixed(2)}`, 180, y + 10, {
          align: "right",
        });

        const pdfBlob = doc.output("blob");
        const pdfURL = URL.createObjectURL(pdfBlob);
        window.open(pdfURL, "_blank");
      });
    })
    .catch((error) => console.error("Error fetching books:", error));
});
