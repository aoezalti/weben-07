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
                        <h3>click on table elements to edit data</h3>
                        <table class="table">
                        <thead>
                            <tr>
                                <th>Salutation</th>
                                <th>Firstname</th>
                                <th>Lastname</th>
                                <th>PLZ</th>
                                <th>City</th>
                                <th>Email</th>
                                <th>Username</th>
                                
                                <th>Address</th>
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
                            <td onclick="editCell('username', this,${userData.userid})"><a href="#">${userData.username}</a></td>
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
                           <th>Type</th>
                           <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>`;

        paymentData.forEach(function(payment) {
            table += `<tr>
                    <td>${payment.paymentType}</td>
                    <td>${payment.paymentInfo}</td>
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
                               <th>Order ID</th>
                               <th>Date</th>
                               <th>Status</th>
                               <th>Invoice</th>
                            </tr>
                        </thead>
                    <tbody>`;

        orderData.forEach(function(order){
                       table += `    <tr>
                                <td>${order.orderid}</td>
                                <td>${order.orderDate}</td>
                                <td>${order.state}</td>
                                <td><a href="../sites/invoice.html?orderID=${order.orderid}">Link</a></td>
                            </tr>`;
                        });
        table += `</tbody>
                 </table>`;
        $('.container.mt-5').append(table);
    }
});

function editCell(fieldname, cell, userid){
    var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php';
    var currentValue = $(cell).text();
    var newValue = prompt(`neuen Wert für ${fieldname} eingeben:`, currentValue);
    if(newValue!==null){
        var password = prompt(`Passwort zur Bestätigung eingeben: `);
        if(password!==null){
            changes = {
                'field' : fieldname,
                'newValue':newValue,
                'password':password,
                'userid': userid
            }

            var payload = {
                type: 'changeUser',
                data: changes
            }
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: apiURL,  // Adjust path as necessary
                data: JSON.stringify(payload),
                success: function(response) {
                    if (response.success) {
                        // after successful update refresh page to show results
                        location.reload();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error('Failed to fetch user data:', textStatus, errorThrown);
                }
            });
        }
    }
}
