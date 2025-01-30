const makePurchase = async (bookId, purchaseId, userId) => {
  const url = `http://localhost:5223/Cart/client/${userId}/add-purchase/${bookId}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        IdOfPurchase: `${purchaseId}`,
        IdClient: `${userId}`,
        IdBook: `${bookId}`,
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

const purchaseBooks = (cart, userId) => {
  let randomID = Math.floor(Math.random() * 1000);
  cart.forEach(async (book) => {
    console.log(book.idBook, randomID, userId);
    await makePurchase(book.idBook, randomID, userId);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cartBooks")) || [];
  let userId = JSON.parse(localStorage.getItem("user"));
  function addToCart(book) {
    console.log(book);
    if (!book) {
      console.error(`Book with ID ${book.idBook} not found.`);
      return;
    }

    const cartItem = book;
    if (cartItem) {
      cartItem.quantity = 1;
    } else {
      cart.push({ ...cartItem, quantity: 1 });
    }

    renderCart();
  }

  function removeFromCart(bookId) {
    cart = cart.filter((item) => item.idBook !== bookId);
    renderCart();
  }

  function updateQuantity(bookId, quantity) {
    const cartItem = cart.find((item) => item.idBook === bookId);
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
      totalPrice += item.price * item.quantity;

      const row = document.createElement("tr");
      row.innerHTML = `
              <td><img src="${item.coverImageUrl}" alt="${item.title}" width="50"></td>
              <td>${item.title}</td>
              <td>$${item.price}</td>
              <td>
                <input 
                  type="number" 
                  class="quantity-input" 
                  value="${item.quantity}" 
                  min="1" 
                  onchange="updateQuantity(${item.idBook}, Number(this.value))">
              </td>
              <td><button class="remove-btn" onclick="removeFromCart(${item.idBook})">🗑️</button></td>
            `;
      cartItemsContainer.appendChild(row);
    });

    document.getElementById(
      "total-price"
    ).innerText = `Total: $${totalPrice.toFixed(3)}`;
  }

  cart.forEach((book) => addToCart(book));

  window.updateQuantity = updateQuantity;
  window.removeFromCart = removeFromCart;

  $("#go-back-btn").click(function () {
    localStorage.setItem("cartBooks", JSON.stringify(cart));
    window.location.href = "book-browse.html";
  });

  $("#purchase-btn").click(async function () {
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
      purchaseBooks(cart, userId);
      const { title, author, price, quantity } = book;
      const bookTotal = price * quantity;
      totalAmount += bookTotal;

      doc.text(title, 20, y);
      doc.text(author, 80, y);
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
});
