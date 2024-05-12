var products = [];
var categories = ["Alle Produkte"];
var itemsIdInChart = [];
var productsInChart = [];
var amount = 0.0;
var itemsList = [];
var itemsIdList = [];

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
            itemsIdInChart.push(product.data('id'))
            console.log(itemsIdInChart);
            $("#cartItemCount").text(itemsIdInChart.length);

        }
    })
    $("#cartButton").on("click", function () {
        console.log("Cart button clicked!");
        productsInChart = [];
        setTimeout(getProductsInChart(itemsIdInChart),100);
        if(itemsIdInChart.length == 0){
            alert('Keine Artikel im Warenkorb!');
        }else{
            $("#cart-placeholder").load("cart.html");
            $("#cartModal").modal("show");
        }
    });

}
