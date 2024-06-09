$(document).ready(function() {

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://localhost/weben-07/Backend/logic/get_user_data.php',  // Adjust path as necessary
        success: function(response) {
            if (response.success) {
                // Assuming the user is not an admin, create and append the table
                console.log(response.data);

                createUserTable(response.data);
                createPaymentinfoTable(response.paymentData);
                createOrderTable(response.data);

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch user data:', textStatus, errorThrown);
        }
    });

    function createUserTable(userData) {
        var table = `<table class="table">
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
                                <td>${userData.salutation}</td>
                                <td>${userData.firstname}</td>
                                <td>${userData.lastname}</td>
                                <td>${userData.plz}</td>
                                <td>${userData.city}</td>
                                <td>${userData.mail}</td>
                                <td>${userData.username}</td>
                                <td>${userData.address}</td>
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


    function createOrderTable(userData) {
        var table = `<table class="table">
                        <thead>
                            <tr>
                               <th>Date</th>
                               <th>Product</th>
                               <th>Quantity</th>
                               <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${userData.orderDate}</td>
                                <td>${userData.orderItem}</td>
                                <td>${userData.orderQuantity}</td>
                                <td>${userData.orderStatus}</td>
                            </tr>
                        </tbody>
                    </table>`;
        $('.container.mt-5').append(table);
    }


});