let storedCart = localStorage.getItem('cart');
let voucher = 0;
let total = 0;
let payment = "";
let customerpaymentmethod = [];
let new_residual_value = 0;
let usedVoucher = false;
let userid;
let creditinformation = 0;
let discountid;

$(document).ready(function () {
    $("#voucher").hide();
    $("#residual_payment").hide();
    $("#credit-card").hide();
    getCustomerData();
    displayOrderItems();
    getCustomerPaymentmethod();
    getVoucherInformation();

    $("#dicountcode_btn").on("click", function (event){
        event.preventDefault();
        discountcode = $("#discountcode").val()
        checkDiscountCode(discountcode);
        $("#discountcode").val("");
    });

    $("#checkout").on("click", function (event){
        event.preventDefault();
        if (saveOrder(usedVoucher)) {
            alert("Danke für Ihre Bestellung!");
            clearCart()
            window.location.href = "index.html";
        }
    });

    // Wird ausgelöst, wenn sich die Paymentmethode (Auswahlliste aus der Datenbank) auf der HP ändert.

    $("#payment-method").on("change", function (){
        $("#voucher").hide();
        $("#residual_payment").hide()
        $("#credit-card").hide();
        let selectedValue =$(this).val();
        if (selectedValue === "Gutschein"){
            displayVoucherInformation();
        } else if (selectedValue === "Kreditkarte"){
            displayCreditcardInformation();
        }
        //weitere Anpassungen für unterschiedliche Methoden erweiterbar

    })

    function checkDiscountCode(discountcode){
        $.ajax({
            url: apiUrl,
            type: 'GET',
            data: {type: 'checkDiscountCode', discountcode: discountcode},
            contentType: 'application/json',
            xhrFields: {withCredentials: true},
            success: function (response) {
                if(response.length !== 0){
                    discountid = response[0]['discount_id']
                    displayDiscountInformation(response)
                    console.log('Discountcode gueltig:', response);
                } else {
                    alert("Gutscheincode ungültig")
                    console.log('Discountcode ungueltig:', response);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('ajax request failed:', textStatus, errorThrown);
            }
        });
    }

    function displayDiscountInformation(discountinformation){
        console.log(discountinformation);
        $('#discount-card').hide();
        let percentage = parseFloat(discountinformation[0]['discount'])/100
        console.log(percentage);
        total = total - (total * percentage);
        console.log(total);
        let discount = `
            <div class="row align-items-center w-100">
                <div class="col d-flex align-items-center position-relative">
                    <span class="text-truncate" style="max-width: 200px; font-size: 0.875rem;"><h4>Rabatt:</h4></span>
                </div>
                <div class="col d-flex align-items-center position-relative">
                    <span class="text-truncate" style="max-width: 200px; font-size: 0.875rem;"><h5>${discountinformation[0]['code']}</h5></span>
                </div>
                <div class="col-auto d-flex align-items-center">
                  <span class="badge bg-primary rounded-pill">-${discountinformation[0]['discount']}%</span>
                </div>
              </div>
        `
        $('#total').empty()
        displayTotalValue();
        $('#discount').append(discount);
        if (payment == "Gutschein"){
            displayVoucherInformation();
        }
    }

    //Anzeige der Kreditkarteninformation
    function displayCreditcardInformation(){
        payment= "Kreditkarte"
        $("#credit-card").empty();
        let creditcardinformation = `
            <div class="card-header">
                    <h4>Kreditkarteninformation</h4>
                </div>
                <div class="card-body">
                    <div class="row align-items-center w-100 mb-1">
                        <div class="col d-flex align-items-center position-relative">
                            <span class="text-truncate"><h6>Kreditkartennummer: </h6></span>
                        </div>
                        <div class="col-auto d-flex align-items-center">
                          <span class="badge bg-primary rounded-pill">${creditinformation}</span>
                        </div>
                    </div>
                </div>
        `
        $("#credit-card").append(creditcardinformation).show();
    }

    //Anzeige der Gutscheininformation, inklusive Restbetrag.
    //Unterschreitet der Restbetrag 0, wird auf eine Gutschein und alternative Zahlungsmethode(kommt aus der Datenbank) zurückgefriffen
    function displayVoucherInformation(){
        usedVoucher=true;
        payment = "Gutschein"
        new_residual_value = voucher - total;
        if (new_residual_value < 0){
            let topay = new_residual_value * (-1);
            new_residual_value = 0;
            displayResidualPayment(topay);
        }
        $("#voucher").empty();
        let voucherinformation = `
                <div class="card-header">
                    <h4>Gutscheininformation</h4>
                </div>
                <div class="card-body">
                    <div class="row align-items-center w-100 mb-1">
                        <div class="col d-flex align-items-center position-relative">
                            <span class="text-truncate"><h6>vorhandener Gutscheinwert:</h6></span>
                        </div>
                        <div class="col-auto d-flex align-items-center">
                          <span class="badge bg-primary rounded-pill">€ ${voucher.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="row align-items-center w-100 mb-1">
                        <div class="col d-flex align-items-center position-relative">
                            <span class="text-truncate"><h6>Neuer Gutscheinwert:</h6></span>
                        </div>
                        <div class="col-auto d-flex align-items-center">
                          <span class="badge bg-primary rounded-pill">€ ${new_residual_value.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `
        $("#voucher").append(voucherinformation).show();
    }

    //Anzeige der Restzahlung und alternativen Paymentmethode an.

    function displayResidualPayment(topay){
        payment += " + " + customerpaymentmethod[0]['pay_type'];
        let residualpayment = `
            <div class="card-header">
                    <h4>Restzahlung</h4>
                </div>
                <div class="card-body">
                    <div class="row align-items-center w-100 mb-1">
                        <div class="col d-flex align-items-center position-relative">
                            <span class="text-truncate"><h6>${customerpaymentmethod[0]['pay_type']}</h6></span>
                        </div>
                        <div class="col-auto d-flex align-items-center">
                          <span class="badge bg-danger rounded-pill">€ ${topay.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
        `
        $("#residual_payment").append(residualpayment).show();
    }

    function displayOrderItems(){
        //const storedCart = localStorage.getItem('cart');
        const orderItems = storedCart ? JSON.parse(storedCart) : [];
        const orderItemsList = $("#productlist");

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
        displayTotalValue();
    }

    function displayTotalValue(){
        const totalList = `
                <li class="list-group-item" id="discount"></li>
                <li class="list-group-item" id="total">
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

    //Bestellung wird in die Datenbank geschrieben.

    function saveOrder(usedVoucher) {
        if (payment == ""){
            alert("Bitte Zahlungsmethode wählen!");
            return false;
        }
        let payload ={};
        let orderItems = JSON.parse(storedCart, true);
        if (usedVoucher){
            payload = {
                type: 'orders',
                userid: userid,
                total: total,
                discountid: discountid,
                items: orderItems,
                paymentmethod: payment,
                usedVoucher: usedVoucher,
                residual_value: new_residual_value
            }
        }else {
            payload = {
                type: 'orders',
                userid: userid,
                total: total,
                discountid: discountid,
                items: orderItems,
                paymentmethod: payment,
                usedVoucher: usedVoucher
            }
        }
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            success: function (response) {
                console.log('Bestellung erfolgreich:', response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('ajax request failed:', textStatus, errorThrown);
            }
        });
        return true;
    }

    //Zahlungsmethode des Kunden aus der Datenbank auslesen

    function getCustomerPaymentmethod() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            data: { type: 'customerPaymentMethod', userid: userid},
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            success: function (response) {
                customerpaymentmethod = response;
                creditinformation = response[0]['pay_info'];
                var option = $("<option/>", {
                    "class": response[0]['pay_type'],
                }).text(response[0]['pay_type'])
                $("#payment-method").append(option);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Login status request failed:', textStatus, errorThrown);
                // In case of error, redirect to login page
                //window.location.href = 'login.html';
            }
        })
    }

    //Gutscheininformation des Kunden auslesen

    function getVoucherInformation() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            data: { type: 'getVoucherInformation', userid: userid },
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            success: function (response) {
                if (response.length !== 0){
                    voucher = parseFloat(response[0]['residual_value']);
                    var option = $("<option/>", {
                        "class": "voucher",
                    }).text("Gutschein");
                    $("#payment-method").append(option);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Login status request failed:', textStatus, errorThrown);
                // In case of error, redirect to login page
                //window.location.href = 'login.html';
            }
        })
    }

    //Kundendaten aus der Datenbank auslesen

    function getCustomerData() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            data: { type: 'customerData' },
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            success: function (response) {
                $("#username").text(response[0]['firstname'] + " " + response[0]['lastname']);
                $("#adress").text(response[0]['address'] + ", " + response[0]['plz'] + " " + response[0]['city']);
                userid = response[0]['userid'];
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Login status request failed:', textStatus, errorThrown);
                // In case of error, redirect to login page
                //window.location.href = 'login.html';
            }
        })
    }

});

