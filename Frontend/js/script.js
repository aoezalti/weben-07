let items = 0;
const offerProducts = [];
let offerString = "";
let productString = "";


/* Testing DB */

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
},{
    name: "Käse",
    price: 3.99,
    offerprice: 0,
    currency: "€",
    offer: false,
    img: "../res/img/kaese.jpeg",
    alt: "Käse von Hersteller x"
},{
    name: "Brot",
    price: 3.99,
    offerprice: 1.99,
    currency: "€",
    offer: false,
    img: "../res/img/brot.jpeg",
    alt: "Brot von Hersteller x"
},{
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
    offer: false,
    img: "../res/img/wurst.jpeg",
    alt: "Wurst von Hersteller x"
},{
    name: "Käse",
    price: 3.99,
    offerprice: 0,
    currency: "€",
    offer: false,
    img: "../res/img/kaese.jpeg",
    alt: "Käse von Hersteller x"
},{
    name: "Brot",
    price: 3.99,
    offerprice: 1.99,
    currency: "€",
    offer: true,
    img: "../res/img/brot.jpeg",
    alt: "Brot von Hersteller x"
}];

products.forEach(getOffer);
if (offerProducts.length > 0) {
    buildOfferCarousel(offerProducts);
} else {
    $("#specialOffers").hide();
}
products.forEach(buildProductGrid);


function getOffer(obj) {
    if (obj.offer) {
        offerProducts.push({ offerImage: obj.img, offerAlt: obj.alt });
    }
}

function buildOfferCarousel(obj) {
    offerString = "<div class=\"text-center\"><h5 class=\"fw-bolder\">Unsere heutigen Angebote</h5></div><div class=\"carousel-inner\">";
    for (let i = 0; i < obj.length; i++) {
        if (i == 0) {
            offerString += "<div class=\"carousel-item active\"><a href=\"#\"><img src=\"" + obj[i].offerImage + "\" class=\"d-block w-100\" alt=\"" + obj[i].offerAlt + "\"></a></div>";
        } else {
            offerString += "<div class=\"carousel-item\"><a href=\"#\"><img src=\"" + obj[i].offerImage + "\" class=\"d-block w-100\" alt=\"" + obj[i].offerAlt + "\"></a></div>";
        }
    }
    offerString += "</div>";
}

function buildProductGrid(obj) {
    if (obj.offer) {
        productString += "<div class=\"col mb-5\"><div class=\"card h-100\">" +
            "<div class=\"badge bg-dark text-white position-absolute\" style=\"top: 0.5rem; right: 0.5rem\">Aktion</div>" +
            "<img class=\"card-img-top\" src=\"" + obj.img + "\" alt=\"" + obj.alt + "\" />" +
            "<div class=\"card-body p-4\">" +
            "<div class=\"text-center\">" +
            "<h5 class=\"fw-bolder\">" + obj.name + "</h5>" +
            "<span class=\"text-muted text-decoration-line-through\">" + obj.price +""+obj.currency+ "</span>"
            + obj.offerprice +""+obj.currency+
            "</div>" +
            "</div>" +
            "<div class=\"card-footer p-4 pt-0 border-top-0 bg-transparent\">" +
            "<div class=\"text-center\"><a class=\"btn btn-outline-dark mt-auto\" href=\"#\">in den Warenkorb</a></div>" +
            "</div>" +
            "</div>" +
            "</div>";
    } else {
        productString += "<div class=\"col mb-5\"><div class=\"card h-100\">" +
            "<img class=\"card-img-top\" src=\"" + obj.img + "\" alt=\"" + obj.alt + "\" />" +
            "<div class=\"card-body p-4\">" +
            "<div class=\"text-center\">" +
            "<h5 class=\"fw-bolder\">" + obj.name + "</h5>" +
            +obj.price +""+obj.currency+
            "</div>" +
            "</div>" +
            "<div class=\"card-footer p-4 pt-0 border-top-0 bg-transparent\">" +
            "<div class=\"text-center\"><a class=\"btn btn-outline-dark mt-auto\" href=\"#\">in den Warenkorb</a></div>" +
            "</div>" +
            "</div>" +
            "</div>";
    }
}

$(document).ready(function () {
    $("#menu").append("<li class=\"nav-item\"><a class=\"nav-link active\" aria-current=\"page\" href=\"./index.html\">Home</a></li>");
    $("#menu").append("<li class=\"nav-item\"><a class=\"nav-link active\" aria-current=\"page\" href=\"#!\">Über uns</a></li>");
    $("#buttons").append("<button class=\"btn btn-outline-dark\"><i class=\"bi bi-person-fill me-1\"></i>Anmelden</button>")
    $("#buttons").append("<button class=\"btn btn-outline-dark\"><i class=\"bi-cart-fill me-1\"></i>Einkaufswagen<span class=\"badge bg-dark text-white ms-1 rounded-pill\">" + items + "</span></button>");
    $("#specialOffers").append(offerString);
    $("#productgrid").append(productString);
});




