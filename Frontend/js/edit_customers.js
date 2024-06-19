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
                            <th>Kunden ID</th>
                            <th>Kundenname</th>
                            <th>Aktiv-Status</th>
                            <th>Bestellungen</th>
                        </tr>
                    </thead>
                    <tbody>`;

    customers.forEach(customer => {
        table += `<tr>
<td>${customer.customerid}</td>
<td>${customer.customerName}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="toggleActive(${customer.customerid}, 'isActive', this)">${customer.isActive}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="getOrders(${customer.customerid}, 'category', this)">Bestellungen Anzeigen</td>
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

function getOrders(customerId){
    var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php';
    var payload = {
        type: 'getOrders',
        data: {
            userid: customerId
        }
    };

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: apiURL,
        data: JSON.stringify(payload),
        success: function(response) {
            if (response[0]!==null) {

                displayOrders(response);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch orders:', textStatus, errorThrown);
        }
    });
}

function displayOrders(orders) {
    var ordersTable = `<table class="table">
                        <thead>
                            <tr>
                                <th>Bestellungs ID</th>
                                <th>Produkt</th>
                                <th>Stückzahö</th>
                                <th>Entfernen</th>
                                
                            </tr>
                        </thead>
                        <tbody>`;

    orders.forEach(order => {
        ordersTable += `<tr>
            <td>${order.order_id}</td>
            <td>${order.productname}</td>
            <td>${order.productCount}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="editOrder(${order.order_id}, '${order.productname}', ${order.productCount})">Entfernen</td>
        </tr>`;
    });

    ordersTable += `</tbody></table>`;

//    $('#ordersModal').html('<p>Test content</p>').show();  // Directly use a simple string

    $('#modalBody').html(ordersTable)
    $('#ordersModal').show();  // Assuming you have a modal or a div with this ID
    $('.close').click(function() {
        $('#ordersModal').hide();
    });
}

function editOrder(order_id, productname,productCount) {
    var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php';
    var newproductCount = parseInt(productCount)-1;

    if(newproductCount===0){
        var type = 'deleteProductFromOrder';
    }else if(newproductCount>=0){
        var type = 'updateOrder';
    } else{
        var type = 'deleteOrder';
    }

    var payload = {
        type: type,
        data: {
            order_id: order_id,
            productCount: newproductCount,
            productname: productname
        }
    };

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: apiURL,
        data: JSON.stringify(payload),
        success: function(response) {
            if (response === true) {
                location.reload();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch order details:', textStatus, errorThrown);
        }
    });
}


// Close modal if clicked outside
window.onclick = function(event) {
    if (event.target == document.getElementById('ordersModal')) {
        $('#ordersModal').hide();
    }
};
