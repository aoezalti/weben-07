$(document).ready(function () {
    var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php';

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
                if (response.success) {
                    console.log("Admin:" + response.data['isAdmin']);
                    getLoginStatus();
                    //if user is admin goto admin page
                    if(response.data['isAdmin'] === 1){
                        window.location.href = "./adminarea.html";
                    }else {
                        window.location.href = "./profile.html";
                    }
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
