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
    $("#cartButton").attr("ondrop", "drop(event)").attr("ondragover", "allowDrop(event)")
    $("#cartButton").on("click", function () {
        console.log("Cart button clicked!");
    });
}
