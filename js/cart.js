document.addEventListener('DOMContentLoaded', () => {
    fetch('json/data.json')
        .then(response => response.json())
        .then(data => {
            const books = data.books;
            let cart = [];

            function addToCart(bookId) {
                let cartItem;
                let book;
                for (book in books) {
                     book = books.find(b => b.ID === bookId);
                     console.log(cartItem);

                }

                if (cartItem) {
                    cartItem.quantity += 1;
                } else {
                    cart.push({ ...book, quantity: 1 });
                }

                renderCart();
            }

            function removeFromCart(bookId) {
                cart = cart.filter(item => item.ID !== bookId);
                renderCart();
            }

            function updateQuantity(bookId, quantity) {
                const cartItem = cart.find(item => item.ID === bookId);
                if (cartItem) {
                    cartItem.quantity = parseInt(quantity, 10);
                    renderCart();
                }
            }

            function renderCart() {
                const cartItemsContainer = document.getElementById('cart-items');
                cartItemsContainer.innerHTML = '';

                let totalPrice = 0;

                cart.forEach(item => {
                    totalPrice += item.Price * item.quantity;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><img src="${item['Cover Image URL']}" alt="${item.Title}"></td>
                        <td>${item.Title}</td>
                        <td>$${item.Price.toFixed(2)}</td>
                        <td>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${item.ID}, this.value)">
                        </td>
                        <td><button class="remove-btn" onclick="removeFromCart(${item.ID})">🗑️</button></td>
                    `;
                    cartItemsContainer.appendChild(row);
                });

                document.getElementById('total-price').innerText = `Total: $${totalPrice.toFixed(2)}`;
            }

            // Example of adding a book to the cart
            for(let i = 1; i <= 15; i++){
                addToCart(i);
            };

            // Expose functions to the global scope
            window.updateQuantity = updateQuantity;
            window.removeFromCart = removeFromCart;
        })
        .catch(error => console.error('Error fetching books:', error));
});