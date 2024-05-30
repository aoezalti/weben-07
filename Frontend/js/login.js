$(document).ready(function () {
    var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php?type=login';

    $('form').on('submit', function (event) {
        event.preventDefault(); // Prevent form submission
        var userData = {
            user: $('#username').val(),
            password: $('#password').val()
        };
        checkLogin(userData, apiURL);
    });

    function checkLogin(userData, apiURL) {
        var payload = {
            type: 'login',
            userData: userData
        };
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: apiURL,
            data: JSON.stringify(payload),
            success: function (response) {
                if (response.success === "Login successful!") {
                    getLoginStatus();
                    window.location.href = "index.html";
                } else {
                    console.log("oh oh kein login möglich", response);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('ajax request failed:', textStatus, errorThrown);
            }
        })
    }
});
