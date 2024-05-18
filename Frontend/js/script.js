var products = [];
var categories = ["Alle Produkte"];
var itemsIdInCart = [];


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
            itemsIdInCart.push(product.data('id'))
            console.log(itemsIdInCart);
            $("#cartItemCount").text(itemsIdInCart.length);

        }
    })
    $("#cartButton").on("click", function () {
        $("#cart-placeholder").text('');
        if(itemsIdInCart.length == 0){
            alert('Keine Artikel im Warenkorb!');
        }else{
            try{
                getProductsInCart(itemsIdInCart);
                $("#cart-placeholder").load("cart.html");
                $("#cartModal").modal("show");
            } catch (error) {
                console.error('Fehler beim Abrufen der Produkte:', error);
            }
        }
    });

}
