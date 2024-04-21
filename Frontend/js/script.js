const products = [{
    name: "Butter",
    price: 2.50,
    offerprice: 0,
    currency: "€",
    offer: false,
    img: "../res/img/butter.jpeg",
    alt: "Butter von Hersteller x"
}, {
    name: "Wurst",
    price: 4.50,
    offerprice: 3.50,
    currency: "€",
    offer: true,
    img: "../res/img/wurst.jpeg",
    alt: "Wurst von Hersteller x"
}, {
    name: "Käse",
    price: 3.99,
    offerprice: 0,
    currency: "€",
    offer: false,
    img: "../res/img/kaese.jpeg",
    alt: "Käse von Hersteller x"
}, {
    name: "Brot",
    price: 3.99,
    offerprice: 1.99,
    currency: "€",
    offer: false,
    img: "../res/img/brot.jpeg",
    alt: "Brot von Hersteller x"
}];

$(document).ready(function() {
    $("#navbar-placeholder").load("navbar.html", function() {
        attachNavbarEvents();
    });
    $("#products-placeholder").load("products.html", function() {
        populateProducts()
        $(this).show();
    });
    $("#footer-placeholder").load("footer.html");
});


function attachNavbarEvents() {
    $("#registerButton").on("click", function (event) {
        event.preventDefault();
        $("#content-placeholder").load("register.html");
        $("#cartButton").on("click", function () {
            console.log("Cart button clicked!");
        });
    });
}

function populateProducts() {
    products.forEach(product => {
        let productElement = $('.product-template').clone().removeClass('product-template').show();

        productElement.find('.product-img').attr('src', product.img).attr('alt', product.alt);
        productElement.find('.product-name').text(product.name);
        productElement.find('.product-price').text(`€${product.price}`);

        $('#productgrid').append(productElement);
    });
}




