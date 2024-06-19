let storedCart = localStorage.getItem('cart');
let voucher = 0;
let total = 0;
let payment = "";
let additionalpayment = "";
let customerpaymentmethod = [];
let new_residual_value = 0;
let usedVoucher = false;
let additionalPaymethode = false;
let control = false;
let userid;
let discountid;

$(document).ready(function () {
    $("#voucher").hide();
    $("#residual_payment").hide();
    $("#credit-card").hide();
    getCustomerData();
    displayOrderItems();
    getCustomerPaymentmethod("#payment-method");
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
    $("#residualpayment-method").on("change", function (){
        let selectedValue =$(this).val();
        console.log(selectedValue);
        displayPaymentInformation(selectedValue, "#additional-paymentmethod");
        additionalpayment = selectedValue;
        control = true;
    })


    $("#payment-method").on("change", function (){
        $("#voucher").hide();
        $("#residual_payment").hide();
        $("#credit-card").hide();
        let selectedValue =$(this).val();
        if (selectedValue === "Gutschein"){
            displayVoucherInformation();
        } else {
            displayPaymentInformation(selectedValue, "#credit-card");
            payment = selectedValue;
        }
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
        if (payment === "Gutschein"){
            displayVoucherInformation();
        }
    }

    //Anzeige der Bezahlinformation
    function displayPaymentInformation(paymentmethode, toAppend){
        let information = customerpaymentmethod.find(method => method.type === paymentmethode);
        $(toAppend).empty();
        let paymentinformation = `
            <div class="card-header">
                    <h4>Zahlungsinformation</h4>
                </div>
                <div class="card-body">
                    <div class="row align-items-center w-100 mb-1">
                        <div class="col d-flex align-items-center position-relative">
                            <span class="text-truncate"><h6>Nummer/Benutzername: </h6></span>
                        </div>
                        <div class="col-auto d-flex align-items-center">
                          <span class="badge bg-primary rounded-pill">${information['information']}</span>
                        </div>
                    </div>
                </div>
        `
        $(toAppend).append(paymentinformation).show();
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
            additionalPaymethode = true;
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
        $("#residual_payment").show();
        $("#payment").empty();
        let residualpayment = `
            <div class="card-body">
                <div class="row align-items-center w-100 mb-1">
                    <div class="col d-flex align-items-center position-relative">
                        <span class="text-truncate"><h6>Restbetrag</h6></span>
                    </div>
                    <div class="col-auto d-flex align-items-center">
                      <span class="badge bg-danger rounded-pill">€ ${topay.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `
        $("#payment").append(residualpayment).show();
        getCustomerPaymentmethod("#residualpayment-method");
    }

    function displayOrderItems(){
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
        if(additionalpayment != ""){
            payment += " + "+additionalpayment;
        }
        if (payment === ""){
            alert("Bitte Zahlungsmethode wählen!");
            return false;
        }
        if (!control && additionalPaymethode){
            alert("Bitte Zahlungsmethode für die Restzahlung wählen!");
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

    function getCustomerPaymentmethod(toAppend) {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            data: { type: 'customerPaymentMethod', userid: userid},
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            success: function (response) {
                response.forEach((methode, index) => {
                    console.log(methode['pay_type']);
                    customerpaymentmethod.push({
                        type: methode['pay_type'],
                        information: methode['pay_info']
                    });
                    let option = $("<option/>", {
                        "class": methode['pay_type'],
                    }).text(methode['pay_type']);
                    $(toAppend).append(option);
                });

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

