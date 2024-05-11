var products = [];
var categories = ["Alle Produkte"];
var itemsInBasket = [];
var productsInChart = [];

$(document).ready(function () {

    $("#navbar-placeholder").load("../sites/navbar.html", function () {
        attachNavbarEvents();
    });
    $("#modal-placeholder").load("../sites/modal.html");

    $("#footer-placeholder").load("footer.html");
});

function attachNavbarEvents() {
    $("#registerButton").on("click", function (event) {
        event.preventDefault();
        $("#categories").slideUp(500);
        $("#content-placeholder").load("register.html");
    });
    $("#cartButton").droppable({
        tolerance: 'pointer',
        drop: function (event, ui) {
            var product = ui.draggable;
            itemsInBasket.push(product.data('id'))
            console.log(itemsInBasket);
            $("#cartItemCount").text(itemsInBasket.length);

        }
    })
    $("#cartButton").on("click", function () {
        console.log("Cart button clicked!");
        productsInChart = [];
        getProductsInChart(itemsInBasket);
        if(itemsInBasket.length == 0){
            alert('Keine Artikel im Warenkorb!');
        }else{
            $("#cart-placeholder").load("cart.html");
            $("#cartModal").modal("show");
        }
    });

}

function getProductsInChart(itemList) {
    apiUrl = 'http://localhost/weben-07/Backend/logic/requestHandler.php?type=productsById&id=';
    if (itemList.length > 0) {
        itemList.forEach(function (item) {
            getProductsById(apiUrl+item);
        });
    } else {
        console.log("Keine Produkte gefunden");
    }
}

function getProductsById(apiUrl) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        url: apiUrl,
        success: function (response) {
            if (response.length > 0) {
                response.forEach(function (product) {
                    if (!productsInChart.includes(product)) {
                        productsInChart.push(product);
                    }
                });
            } else {
                console.log("Keine Produkte gefunden");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('AJAX request failed:', textStatus, errorThrown); // Debugging line
        }
    });

}
