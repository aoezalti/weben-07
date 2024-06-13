const storedCart = localStorage.getItem('cart');

$(document).ready(function () {
    getCustomerData();
    displayOrderItems();
    getCustomerPaymentmethod();

    $("#checkout").on("click", function (event){
        saveOrder();
        alert("Danke für Ihre Bestellung!");
        //window.location.href = "index.html";
    });

    function saveOrder(){
        console.log("saveorder")
        var orderData = {
            type: 'orders',
            items: storedCart
        };
        console.log(orderData);
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: JSON.stringify(orderData),
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            success: function (response) {
                console.log('Bestellung erfolgreich:', response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('ajax request failed:', textStatus, errorThrown);
            }
        });
    }

    function getCustomerPaymentmethod() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            data: { type: 'customerPaymentMethod' },
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            success: function (response) {
                console.log(response);
                $("#paymentmethode").text(response[0]['pay_type'] + ": " + response[0]['pay_info']);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Login status request failed:', textStatus, errorThrown);
                // In case of error, redirect to login page
                //window.location.href = 'login.html';
            }
        })
    }

    function displayOrderItems(){
        //const storedCart = localStorage.getItem('cart');
        const orderItems = storedCart ? JSON.parse(storedCart) : [];
        const orderItemsList = $("#productlist");
        let total = 0;
        orderItemsList.empty();

        orderItems.forEach((item, index) =>{
            total += (item.price * item.quantity);
            const listItem = `
                <li class="list-group-item">
                  <div class="row align-items-center w-100">
                    <div class="col d-flex align-items-center position-relative">
                      <img src="${item.image}" alt="${item.name}" class="img-thumbnail border-0 me-3 product-image" style="width: auto; height: auto; max-height: 100px; max-width: 100%;">
                      <span class="badge bg-secondary rounded-pill me-3">${item.quantity}</span>
                      <span class="text-truncate" style="max-width: 200px; font-size: 0.875rem;">${item.name}</span>
                      <span class="product-name-hover position-absolute bg-light p-1" style="display: none; font-size: 0.75rem; padding: 2px 5px;">${item.name}</span>
                    </div>
                    <div class="col-auto d-flex align-items-center">
                      <span class="badge bg-primary rounded-pill">€${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </li>
            `;
            orderItemsList.append(listItem);
        });
        const totalList = `
                <li class="list-group-item">
                  <div class="row align-items-center w-100">
                    <div class="col d-flex align-items-center position-relative">
                        <span class="text-truncate" style="max-width: 200px; font-size: 0.875rem;"><h4>Total:</h4></span>
                    </div>
                    <div class="col-auto d-flex align-items-center">
                      <span class="badge bg-primary rounded-pill">€${total.toFixed(2)}</span>
                    </div>
                  </div>
                </li>
            `;
        $("#total").append(totalList);
    }

    function getCustomerData() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            data: { type: 'customerData' },
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            success: function (response) {
                console.log(response);
                $("#username").text(response[0]['firstname'] + " " + response[0]['lastname']);
                $("#adress").text(response[0]['address'] + ", " + response[0]['plz'] + " " + response[0]['city']);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Login status request failed:', textStatus, errorThrown);
                // In case of error, redirect to login page
                //window.location.href = 'login.html';
            }
        })
    }

});

