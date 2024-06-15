//editing customers happens here

$(document).ready(function (){
    var apiUrl = 'http://localhost/weben-07/Backend/logic/requestHandler.php?type=customers';

    function getCustomers(apiUrl) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: apiUrl,
            success: function (response) {
                // console.log('Initial response:', response);
                if (response.length > 0) {
                    products = response;

                    createCustomerTable(products);

                } else {
                    console.log("Keine Kund*innen gefunden");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('AJAX request failed:', textStatus, errorThrown);
            }
        });
    }
    getCustomers(apiUrl);
});

function createCustomerTable(customers){

    var table = `<table class="table">
                    <thead>
                        <tr>
                            <th>Customer ID</th>
                            <th>Customer Name</th>
                            <th>is Active</th>
                            <th>View Orders</th>
                        </tr>
                    </thead>
                    <tbody>`;

    customers.forEach(customer => {
        table += `<tr>
<td>${customer.customerid}</td>
<td>${customer.customerName}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="toggleActive(${customer.customerid}, 'isActive', this)">${customer.isActive}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="getOrders(${customer.customerid}, 'category', this)">View Orders</td>
                  </tr>`;
    });

    table += `</tbody></table>`;
    $('.container.mt-5').append(table);
}

function toggleActive(customer,isActive, field){
    var currentValue = $(field).text()
    console.log(currentValue);
    if(currentValue==="1"){
        console.log("IM here");
        var newValue = 0;
    }else{
        var newValue = 1;
    }

    var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php';
        changes = {
            'field' : field,
            'value' : newValue,
            'userid': customer,
        }

        var payload ={
            type:'toggleActive',
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

function getOrders(customer){

}
