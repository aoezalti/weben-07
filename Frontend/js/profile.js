$(document).ready(function() {
    console.log("ASDASDASDAS");
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://localhost/weben-07/Backend/logic/get_user_data.php',  // Adjust path as necessary
        success: function(response) {
            if (response.success) {
                // Assuming the user is not an admin, create and append the table
                createTable(response.data);

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch user data:', textStatus, errorThrown);
        }
    });

    function createTable(userData) {
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
                                <th>Payment Information</th>
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
                                <td>${userData.paymentinformation}</td>
                                <td>${userData.address}</td>
                            </tr>
                        </tbody>
                    </table>`;
        $('.container.mt-5').append(table); // Append the generated table to the container
    }
});