var products = [];
var cartitemcount = 0;
var categories = ["Alle Produkte"];
$(document).ready(function () {

    $("#navbar-placeholder").load("../sites/navbar.html", function () {
        attachNavbarEvents();
    });

    $("#footer-placeholder").load("footer.html");
});

function attachNavbarEvents() {
    $("#registerButton").on("click", function (event) {
        event.preventDefault();
        $("#categories").slideUp(500);
        $("#content-placeholder").load("register.html");
    });
    $("#cartButton").attr("ondrop", "drop(event)").attr("ondragover", "allowDrop(event)")
    $("#cartButton").on("click", function () {
        console.log("Cart button clicked!");
    });
}
