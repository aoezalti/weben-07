//editing customers happens here

$(document).ready(function () {
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

function createCustomerTable(customers) {
    var table = `<div class="table-responsive"><table class="table table-striped table-hover table-bordered">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">Kunden ID</th>
                            <th scope="col">Kundenname</th>
                            <th scope="col">Aktivstatus</th>
                            <th scope="col">Bestellungen</th>
                        </tr>
                    </thead>
                    <tbody>`;

    customers.forEach(customer => {
        table += `<tr>
<td>${customer.customerid}</td>
<td>${customer.customerName}</td>
<td class="text-center"><div class="form-check form-switch">
<input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault-${customer.customerid}" ${customer.isActive ? 'checked' : ''} onclick="toggleActive(${customer.customerid}, 'isActive', this)">
<label class="form-check-label" for="flexSwitchCheckDefault-${customer.customerid}"></label>
</div></td>
<td style="cursor: pointer; text-decoration: underline; color: #007bff;" onclick="getOrders(${customer.customerid}, 'category', this)">Anzeigen</td>
                  </tr>`;
    });

    table += `</tbody></table></div>`;
    $('.container.mt-5').append(table);
}

function toggleActive(customer, isActive, field) {
    var newValue = $(field).is(':checked') ? 1 : 0;

    var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php';
    changes = {
        'field': field,
        'value': newValue,
        'userid': customer,
    }

    var payload = {
        type: 'toggleActive',
        data: changes
    }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: apiURL,  // Adjust path as necessary
        data: JSON.stringify(payload),
        success: function (response) {
            if (response.success) {
                // after successful update refresh page to show results
                location.reload();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch user data:', textStatus, errorThrown);
        }
    });
}

function getOrders(customerId) {
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
        success: function (response) {
            if (response[0] !== null) {

                displayOrders(response);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch orders:', textStatus, errorThrown);
        }
    });
}

function displayOrders(orders) {
    var ordersTable = `<table class="table">
                        <thead>
                            <tr>
                                <th>Bestellungs ID </th>
                                <th>Produkt</th>
                                <th>Anzahl</th>
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
    $('.close').click(function () {
        $('#ordersModal').hide();
    });
}

function editOrder(order_id, productname, productCount) {
    var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php';
    var newproductCount = parseInt(productCount) - 1;

    if (newproductCount === 0) {
        var type = 'deleteProductFromOrder';
    } else if (newproductCount >= 0) {
        var type = 'updateOrder';
    } else {
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
        success: function (response) {
            if (response === true) {
                location.reload();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch order details:', textStatus, errorThrown);
        }
    });
}


// Close modal if clicked outside
window.onclick = function (event) {
    if (event.target == document.getElementById('ordersModal')) {
        $('#ordersModal').hide();
    }
};
