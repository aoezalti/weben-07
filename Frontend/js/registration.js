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
            user: $('#benutzername').val(),
            password: $('#passwort').val(),
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
                console.log("Response success type:", typeof response.success); // Check the type
                console.log("Response success value:", response.success); // Check the value

                if (response.success) {
                    window.location.href = "profile.html";
                } else {
                   // alert("oh oh keine Registrierung möglich!");
                    console.log("oh oh keine Registrierung möglich",response);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("oh oh keine Registrierung möglich!");
               //console.log('ajax request failed:', textStatus, errorThrown);
            }
        });
    }

});