var cart = [];

$(document).ready(function () {
    loadCart();
    updateCartCount();
    updateTotalPrice(); // Update the total price on page load

    $(document).on('click', '.add-to-cart', function () {
        const productId = $(this).data('id');
        const product = getProductById(productId);
        // console.log('Adding product to cart:', product)
        addToCart(product);
    });

    $(document).on('click', '#cartButton', function () {
        displayCartItems();
        $('#cartModal').modal('show');
    });

    $('#checkoutButton').on('click', function (event) {
        event.preventDefault(); // Prevent the default behavior
        checkLoginStatusBeforeCheckout();
    });
    function getProductById(productId) {
        return products.find(product => product.productid === productId);
    }

    window.addToCart = function(product) {
        const existingProduct = cart.find(item => item.productid === product.productid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                productid: product.productid,
                name: product.productname,
                price: product.insale === 1 ? product.specialprice : product.regularprice,
                image: product.imgpath,
                quantity: 1
            });
        }
        saveCart();
        updateCartCount();
        updateTotalPrice();
        displayCartItems();
        //console.log('Cart:', cart);
    }

    function updateCartCount() {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        $('#cartItemCount').text(cartCount);
    }

    function updateTotalPrice() {
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        $('#total-price').text(`Total: €${totalPrice.toFixed(2)}`);
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function loadCart() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
    }

    function displayCartItems() {
        const storedCart = localStorage.getItem('cart');
        const cartItems = storedCart ? JSON.parse(storedCart) : [];
        const cartItemsList = $("#cartItemsList");
        const checkoutButton = $("#checkoutButton");
        cartItemsList.empty();

        if (cartItems.length === 0) {
            cartItemsList.append('<li class="list-group-item text-center">Keine Produkte im Warenkorb</li>');
            checkoutButton.hide();
            return;
        }


        checkoutButton.show();

        cartItems.forEach((item, index) => {
            const listItem = `
                <li class="list-group-item">
                  <div class="row align-items-center w-100">
                    <div class="col d-flex align-items-center position-relative">
                      <img src="${item.image}" alt="${item.name}" class="img-thumbnail border-0 me-3 product-image" style="width: auto; height: auto; max-height: 100px; max-width: 100%;">
                      <span class="badge bg-secondary rounded-pill me-3">${item.quantity}</span>
                      <span class="text-truncate" style="max-width: 200px; font-size: 0.875rem;">${item.name}</span>
                      <span class="product-name-hover position-absolute bg-light p-1" style="display: none; font-size: 0.75rem; padding: 2px 5px;">${item.name}</span>
                    </div>
                    <div class="col-auto d-flex align-items-center">
                      <button class="btn btn-sm btn-outline-secondary decrement-item me-2" data-index="${index}" aria-label="Decrement">-</button>
                      <button class="btn btn-sm btn-outline-secondary increment-item me-3" data-index="${index}" aria-label="Increment">+</button>
                      <span class="badge bg-primary rounded-pill">€${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </li>
            `;
            cartItemsList.append(listItem);
        });

        // Attach event listeners for increment and decrement buttons
        $(".increment-item").on("click", function () {
            const itemIndex = $(this).data("index");
            incrementCartItem(itemIndex);
        });

        $(".decrement-item").on("click", function () {
            const itemIndex = $(this).data("index");
            decrementCartItem(itemIndex);
        });

        updateTotalPrice();
    }

    function incrementCartItem(index) {
        cart[index].quantity += 1;
        saveCart();
        updateCartCount();
        updateTotalPrice();
        displayCartItems();
    }

    function decrementCartItem(index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartCount();
        updateTotalPrice();
        displayCartItems();
    }

    window.checkLoginStatusBeforeCheckout = function() {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: JSON.stringify({ type: 'loginStatus' }),
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            success: function (response) {
                console.log('isLoggedIn:', response.username);
                if (response.username != null) {
                    // User is logged in, proceed to checkout
                    window.location.href = 'checkout.html';
                } else {
                    // User is not logged in, redirect to login page
                    alert("Bitte loggen Sie sich mit ihrem Account ein, oder Registrieren sich neu!");
                    window.location.href = 'login.html';
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Login status request failed:', textStatus, errorThrown);
                // In case of error, redirect to login page
                window.location.href = 'login.html';
            }
        });
    };

});
