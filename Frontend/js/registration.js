document.addEventListener("DOMContentLoaded", function() {
    console.log("Page loaded");
   // TODO: Implement registration form validation and data submission --> Refactor this pls
   var form = document.querySelector("form");
    
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission to handle it via JavaScript
        
        var anrede = document.getElementById("anrede").value;
        var vorname = document.getElementById("vorname").value;
        var nachname = document.getElementById("nachname").value;
        var adresse = document.getElementById("adresse").value;
        var plz = document.getElementById("plz").value;
        var ort = document.getElementById("ort").value;
        var email = document.getElementById("email").value;
        var benutzername = document.getElementById("benutzername").value;
        var passwort = document.getElementById("passwort").value;
        var passwortVerify = document.getElementById("passwortVerify").value;
        var zahlungsinformationen = document.getElementById("zahlungsinformationen").value;
        
        var isValid = true; // Start assuming the form is valid

        // Validate email with regex pattern
        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
            isValid = false;
        }

        // Validate PLZ - 4 digits
        if (!plz.match(/^\d{4}$/)) {
            alert("Bitte geben Sie eine vierstellige PLZ ein.");
            isValid = false;
        }

        // Sanitize input fields
        var inputs = form.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = sanitizeString(inputs[i].value);
        }

        // Check if password fields match
        if (passwort !== passwortVerify) {
            alert("Die eingegebenen Passwörter stimmen nicht überein.");
            isValid = false;
        }

        // If the form is valid, send the data
        if (isValid) {
            var data = {
                anrede: anrede,
                vorname: vorname,
                nachname: nachname,
                adresse: adresse,
                plz: plz,
                ort: ort,
                email: email,
                benutzername: benutzername,
                passwort: passwort,
                zahlungsinformationen: zahlungsinformationen
            };
            console.log(data);

            // Send data to server via POST
            fetch("../../Backend/logic/registration.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => response.text())
            .then(data => {
                alert(data);
            })
            .catch(error => {
                console.error("Error:", error);
            });
        }console.log(data);
    });

    function sanitizeString(str) {
        return str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
                  .replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '')
                  .replace(/<style[^>]*>([\S\s]*?)<\/style>/gmi, '');
    }
});
