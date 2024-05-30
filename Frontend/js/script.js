var products = [];
var cartitemcount = 0;
var categories = ["Alle Produkte"];
$(document).ready(function () {

    $("#navbar-placeholder").load("../sites/navbar.html", function () {
        attachNavbarEvents();
        getLoginStatus();
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
    $("#cartButton").attr("ondrop", "drop(event)")
    $("#cartButton").on("click", function () {
        console.log("Cart button clicked!");
    });
    $("#logoutButton").on("click", function (event) {
        event.preventDefault();
        $.ajax({
            url: 'http://localhost/weben-07/Backend/logic/requestHandler.php',
            type: 'POST',
            data: JSON.stringify({ type: 'logout' }), // Send the type 'logout'
            contentType: 'application/json',
            xhrFields: {
                withCredentials: true // Include cookies in the request
            },
            success: function(response) {
                if (response.success === "Logout successful!") {
                    getLoginStatus(); // Update the navbar
                    window.location.href = "index.html";
                } else {
                    console.log('Logout failed:', response.message);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Logout request failed:', textStatus, errorThrown);
            }
        });
    });
}

function getLoginStatus() {
    $.ajax({
        url: 'http://localhost/weben-07/Backend/logic/requestHandler.php',
        type: 'POST',
        data: JSON.stringify({type: 'loginStatus'}),
        contentType: 'application/json',
        xhrFields: {
            withCredentials: true // Include cookies in the request
        },
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
    console.log('updateNavbar called with username:', username);
    if (username) {
        console.log('User is logged in');
        $('#authButtons').hide();
        $('#logoutButton').show();
        $('#welcomeUser').text('Hallo, ' + username);
        $('#userSection').show();
    } else {
        console.log('User is not logged in');
        $('#authButtons').show();
        $('#logoutButton').hide();
        $('#userSection').hide();
    }
}