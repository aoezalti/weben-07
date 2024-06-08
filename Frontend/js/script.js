var products = [];
var categories = ["Alle Produkte"];
var apiUrl = 'http://localhost/weben-07/Backend/logic/requestHandler.php';

$(document).ready(function () {
    $("#navbar-placeholder").load("../sites/navbar.html", function () {
        attachNavbarEvents();
        getLoginStatus();
        updateCartCount();
    });

    $("#footer-placeholder").load("footer.html");
    addHoverEffect();
    pictureHover();
});

function attachNavbarEvents() {
    $("#loginButton").on("click", function (event) {
        event.preventDefault();
        $("#categories").slideUp(500);
        window.location.href = "login.html";
    });
    $("#registerButton").on("click", function (event) {
        event.preventDefault();
        $("#categories").slideUp(500);
        window.location.href = "register.html";
    });

    $("#logoutButton").on("click", function (event) {
        event.preventDefault();
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: JSON.stringify({type: 'logout'}),
            contentType: 'application/json',
            xhrFields: {withCredentials: true},
            success: function (response) {
                if (response.success === "Logout successful!") {
                    clearCart();
                    getLoginStatus();
                    localStorage.removeItem('isLoggedIn');
                    window.location.href = "index.html";
                } else {
                    console.log('Logout failed:', response.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Logout request failed:', textStatus, errorThrown);
            }
        });
    });
    $('#cartButton').droppable({
        accept: '.product-card',
        tolerance: 'touch',
        drop: function (event, ui) {
            console.log("Drop event triggered");
            const productId = ui.helper.data('id');
            const product = getProductById(productId);
            if (product) {
                window.addToCart(product); // Call the globally defined addToCart function
            }
        },
        over: function(event, ui) {
            console.log("Draggable element is over the droppable element");
        },
        out: function(event, ui) {
            console.log("Draggable element is out of the droppable element");
        }
    });
}

function getLoginStatus() {
    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: JSON.stringify({type: 'loginStatus'}),
        contentType: 'application/json',
        xhrFields: {withCredentials: true},
        success: function (response) {
            console.log('getLoginStatus response:', response);
            updateNavbar(response.username);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Login status request failed:', textStatus, errorThrown);
        }
    });
}

function updateNavbar(username) {
    if (username) {
        $('#authButtons').hide();
        $('#logoutButton').show();
        $('#welcomeUser').text('Hallo, ' + username);
        $('#userSection').show();
    } else {
        $('#authButtons').show();
        $('#logoutButton').hide();
        $('#userSection').hide();
    }
}

function updateCartCount() {
    const storedCart = localStorage.getItem('cart');
    const cartCount = storedCart ? JSON.parse(storedCart).reduce((total, item) => total + item.quantity, 0) : 0;
    $('#cartItemCount').text(cartCount);
}

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
}

function addHoverEffect() {
    var hoverTimeout;

    $(document).on('mouseenter', '.product-image', function () {
        var $this = $(this);
        hoverTimeout = setTimeout(function () {
            $this.siblings('.product-name-hover').fadeIn();
        }, 500);
    }).on('mouseleave', '.product-image', function () {
        clearTimeout(hoverTimeout);
        $(this).siblings('.product-name-hover').fadeOut();
    });
}

function pictureHover() {
    var hoverTimeout;

    $(document).on('mouseenter', '.hover-effect', function () {
        var $this = $(this);
        hoverTimeout = setTimeout(function () {
            $this.css({
                'transform': 'scale(1.05)',
                'box-shadow': '0 10px 20px rgba(0, 0, 0, 0.3)'
            });
        }, 400);
    }).on('mouseleave', '.hover-effect', function () {
        clearTimeout(hoverTimeout);
        $(this).css({
            'transform': 'scale(1)',
            'box-shadow': 'none'
        });
    });
}
function getProductById(productId) {
    return products.find(product => product.productid === productId);
}
