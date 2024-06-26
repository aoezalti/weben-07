$(document).ready(function() {

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://localhost/weben-07/Backend/logic/get_user_data.php',  // Adjust path as necessary
        success: function(response) {
            if (response.success) {
                // Assuming the user is not an admin, create and append the table
               // console.log(response.data);

                createUserTable(response.data);
                createPaymentinfoTable(response.paymentData);
                createOrderTable(response.orderData);

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch user data:', textStatus, errorThrown);
        }
    });

    function createUserTable(userData) {
        var table = `
                        <h3>Auf Tabellenwerte klicken um sie zu ändern</h3>
                        <table class="table">
                        <thead>
                            <tr>
                                <th>Anrede</th>
                                <th>Vorname</th>
                                <th>Nachname</th>
                                <th>PLZ</th>
                                <th>Ort</th>
                                <th>Mail</th>
                                <th>Addresse</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td onclick="editCell('salutation', this,${userData.userid})"><a href="#">${userData.salutation}</a></td>
                            <td onclick="editCell('firstname', this,${userData.userid})"><a href="#">${userData.firstname}</a></td>
                            <td onclick="editCell('lastname', this,${userData.userid})"><a href="#">${userData.lastname}</a></td>
                            <td onclick="editCell('plz', this,${userData.userid})"><a href="#">${userData.plz}</a></td>
                            <td onclick="editCell('city', this,${userData.userid})"><a href="#">${userData.city}</a></td>
                            <td onclick="editCell('mail', this,${userData.userid})"><a href="#">${userData.mail}</a></td>
                            <td onclick="editCell('address', this,${userData.userid})"><a href="#">${userData.address}</a></td>
                            </tr>
                        </tbody>
                    </table>`;
        $('.container.mt-5').append(table);
    }

    function createPaymentinfoTable(paymentData) {
        var table = `<table class="table">
                    <thead>
                        <tr>
                           <th>Zahlungsmethode</th>
                           <th>Zahlungsinformation</th>
                           <th>Entfernen</th>
                        </tr>
                    </thead>
                    <tbody>`;

        paymentData.forEach(function(payment) {
            // String half
            var maskLength = Math.floor(payment.paymentInfo.length / 2);
            // replace half of string with *
            var maskedInfo = payment.paymentInfo.substr(0, payment.paymentInfo.length - maskLength) + '*'.repeat(maskLength);

            table += `<tr>
                    <td>${payment.paymentType}</td>
                    <td>${maskedInfo}</td>
                    <td onclick="removePaymentInfo(${payment.p_id},${payment.userid})"><a href="#">Entfernen</a></td>
                  </tr>`;
        });

        table += `</tbody>
              </table>`;

        $('.container.mt-5').append(table);
    }


    function createOrderTable(orderData) {
        var table = `<table class="table">
                        <thead>
                            <tr>
                               <th>Bestellungs ID</th>
                               <th>Bestelldatum</th>
                               
                               <th>Rechnung</th>
                            </tr>
                        </thead>
                    <tbody>`;

        orderData.forEach(function(order){
                       table += `    <tr>
                                <td>${order.order_id}</td>
                                <td>${order.orderDate}</td>
                                
                                <td><a href="../sites/invoice.html?orderID=${order.order_id}">Link</a></td>
                            </tr>`;
                        });
        table += `</tbody>
                 </table>`;
        $('.container.mt-5').append(table);
    }
});

function editCell(fieldname, cell, userid) {
    var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php';
    var currentValue = $(cell).text();
    var newValue = prompt(`neuen Wert für ${fieldname} eingeben:`, currentValue);
    if (newValue !== null) {
        // Show modal for password input
        $('#passwordModal').show();

        // Handle form submission
        $('#passwordForm').on('submit', function(e) {
            e.preventDefault();
            var password = $('#passwordInput').val();
            $('#passwordModal').hide();

            if (password) {
                var changes = {
                    'field': fieldname,
                    'newValue': newValue,
                    'password': password,
                    'userid': userid
                };

                var payload = {
                    type: 'changeUser',
                    data: changes
                };
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: apiURL,
                    data: JSON.stringify(payload),
                    success: function(response) {
                        if (response.success) {
                            location.reload();  // Refresh page on success
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error('Failed to update user data:', textStatus, errorThrown);
                    }
                });
            }
        });

        // Close modal on clicking close button
        $('.close').click(function() {
            $('#passwordModal').hide();
        });
    }
}

// Close modal if clicked outside
window.onclick = function(event) {
    if (event.target == document.getElementById('passwordModal')) {
        $('#passwordModal').hide();
    }
};



function removePaymentInfo(paymentInfo, userid) {
    var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php';
    var changes = {
        'userid': userid,
        'p_id': paymentInfo
    };

    var payload = {
        type: 'deletePaymentInfo',
        data: changes
    };

    console.log("Sending payload:", JSON.stringify(payload));  // Log the payload for debugging

    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: apiURL,
        data: JSON.stringify(payload),
        success: function(response) {
            console.log("Response received:", response);
            location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('AJAX call failed:', textStatus, errorThrown);
        }
    });
}


// add payment info
document.getElementById('loadFormButton').addEventListener('click', function() {
    const formHTML = `
        <div class="container mt-3">
            <h2 class="mb-3">Zahlungsmethode hinzufügen</h2>
            <form id="paymentForm">
                <div class="mb-3">
                    <label for="zahlungstyp" class="form-label">Zahlungstyp</label>
                    <select class="form-select" id="zahlungstyp" required>
                        <option value="">Bitte wählen...</option>
                        <option value="Kreditkarte">Kreditkarte</option>
                        <option value="PayPal">PayPal</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="zahlungsinformationen" class="form-label">Zahlungsinformationen</label>
                    <input type="text" class="form-control" id="zahlungsinformationen" required placeholder="Z.B. Kartennummer">
                </div>
                <div class="mb-3">
                    <label for="password_confirmation" class="form-label">Passwort</label>
                    <input type="password" class="form-control" id="password_confirmation" required placeholder="Passwort eingeben">
                </div>
                <button type="submit" class="btn btn-primary">Speichern</button>
            </form>
        </div>
    `;
    document.getElementById('paymentFormContainer').innerHTML = formHTML;
    attachFormSubmitHandler();
});

function attachFormSubmitHandler() {
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();  // Prevent the default form submission
        var zahlungstyp = document.getElementById('zahlungstyp').value;
        var zahlungsinformationen = document.getElementById('zahlungsinformationen').value;
        var password = document.getElementById('password_confirmation').value;

        var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php';
        var changes = {
            'pay_info': zahlungsinformationen,
            'pay_type': zahlungstyp,
            'password': password
        };

        var payload = {
            type: 'addPaymentInfo',
            data: changes
        };
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            url: apiURL,
            data: JSON.stringify(payload),
            success: function(response) {
                console.log("Response received:", response);
                location.reload();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX call failed:', textStatus, errorThrown);
            }
        });


    });
}
document.getElementById('loadPWFormButton').addEventListener('click', function() {
    const formHTML = `
        <div class="container mt-3">
            <h2 class="mb-3">Passwort ändern</h2>
            <form id="PWForm">
                 <div class="mb-3">
                    <label for="passwort" class="form-label">Passwort</label>
                    <input type="password" class="form-control" id="passwort" required>
                </div>
                <div class="mb-3">
                    <label for="passwortVerify" class="form-label">Passwort bestätigen</label>
                    <input type="password" class="form-control" id="passwortVerify" required>
                </div>
                <div class="mb-3">
                    <label for="password_confirmation" class="form-label"> Altes Passwort</label>
                    <input type="password" class="form-control" id="password_confirmation" required placeholder="Passwort eingeben">
                </div>
                <button type="submit" class="btn btn-primary">Speichern</button>
            </form>
        </div>
        
    `;
    document.getElementById('passwordFormContainer').innerHTML = formHTML;
    attachPWFormSubmitHandler();
});

function attachPWFormSubmitHandler() {
    const paymentForm = document.getElementById('PWForm');
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();  // Prevent the default form submission
        var password = document.getElementById('passwort').value;
        var confirm = document.getElementById('passwortVerify').value;
        var old_password = document.getElementById('password_confirmation').value;

        if (password !== confirm) {
            alert("Passwörter stimmen nicht überein!");
        } else {
            var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php';
            var changes = {
                'new_password': password,
                'old_password': old_password
            };

            var payload = {
                type: 'changePassword',
                data: changes
            };
            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                url: apiURL,
                data: JSON.stringify(payload),
                success: function(response) {
                    console.log("Response received:", response);
                    location.reload();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error('AJAX call failed:', textStatus, errorThrown);
                }
            });
        }
    });
}






