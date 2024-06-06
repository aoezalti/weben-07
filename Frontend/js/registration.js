$(document).ready(function () {
    var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php?type=register';

    $('form').on('submit', function (event) {
        event.preventDefault(); // Prevent form submission
        var userData = {
            anrede: $('#anrede').val(),
            vorname: $('#vorname').val(),
            nachname: $('#nachname').val(),
            adresse: $('#adresse').val(),
            plz: $('#plz').val(),
            ort: $('#ort').val(),
            email: $('#email').val(),
            benutzername: $('#benutzername').val(),
            passwort: $('#passwort').val(),
            passwortVerify: $('#passwortVerify').val(),
            zahlungsinformationen: $('#zahlungsinformationen').val(),
            zahlungstyp: $('#zahlungstyp').val()
        };

        registerUser(userData, apiURL);
    });

    function registerUser(userData, apiURL) {
        var payload = {
            type: 'register',
            userData: userData
        };

        $.ajax({
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            url: apiURL,
            data: JSON.stringify(payload),
            success: function (response) {
                if (response.success === "Registration successful!") {
                    window.location.href = "index.html";
                } else {
                    console.log("oh oh keine Registrierung möglich",response);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('ajax request failed:', textStatus, errorThrown);
            }
        });
    }

});