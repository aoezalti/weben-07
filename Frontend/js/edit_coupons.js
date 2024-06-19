
$(document).ready(function () {

    getCoupons();
    $("#code").val(generateDiscountCode(5));


    $("#editdiscount-btn").on("click", function(){
       let code = $("#code").val();
       let discount = "";
       discount = $("#discount").val();
       let expiredate = new Date($("#expiredate").val());
       let currentDate = new Date();
       console.log(code);
       console.log(discount);
       console.log(expiredate);
       if (discount === "" || expiredate === "Invalid Date"){
           alert("Bitte die Felder vollständig und korrekt ausfüllen!");
       }else if (expiredate <= currentDate){
           alert("Das Datum liegt in der  Vergangenheit!");
       }else if (discount>100){
           alert("Discount kann nicht größer als 100 sein!");
       }
       else{
           expiredate = formatDate(expiredate);
           saveCoupon(code, discount, expiredate);
           $("#code").val("");
           $("#discount").val("");
           $("#expiredate").val("")
           $("#code").val(generateDiscountCode(5));
           $("#coupons-card").empty();
           getCoupons();
       }
    });

});

function displayAllCoupons($coupons){
    $coupons.forEach((coupon, index) =>{
        console.log(coupon);
        const listCoupon = `
                <li class="list-group-item">
                  <div class="row align-items-center w-100">
                    <div class="col d-flex align-items-center position-relative m-2">
                      <div class="col d-flex align-items-center position-relative"><span class="text-truncate" style="max-width: 200px; font-size: 0.875rem;"><h6>${coupon.code}</h6></span></div>
                      <div class="col d-flex align-items-center position-relative"><span class="text-truncate" style="max-width: 200px; font-size: 0.875rem;"><h6>${coupon.discount}</h6></span></div>
                      <div class="col d-flex align-items-center position-relative"><span class="text-truncate" style="max-width: 200px; font-size: 0.875rem;"><h6>${coupon.expiry_date}</h6></span></div>
                      <button type="button" onclick="deleteCoupon(${coupon.discount_id})" id="deletebtn-${coupon.discount_id}" class="btn btn-primary bi bi-trash delete"></button>
                    </div>
                  </div>
                </li>
            `;
        $("#coupons-card").append(listCoupon);
    });

}

function deleteCoupon(couponid){
    let payload={
        type: 'deleteCoupon',
        couponid: couponid
    }
    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: JSON.stringify(payload),
        contentType: 'application/json',
        xhrFields: {withCredentials: true},
        success: function (response) {
            $("#coupons-card").empty();
            getCoupons();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('ajax request failed:', textStatus, errorThrown);
        }
    });
}

function getCoupons(){
    $.ajax({
        url: apiUrl,
        type: 'GET',
        data: {type: 'getCoupons'},
        contentType: 'application/json',
        xhrFields: {withCredentials: true},
        success: function (response) {
            displayAllCoupons(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('ajax request failed:', textStatus, errorThrown);
        }
    });
}

function formatDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function saveCoupon(code, discount, expiredate){
    let payload = {
        type: 'saveCoupon',
        code: code,
        discount: discount,
        expiredate: expiredate
    }
    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: JSON.stringify(payload),
        contentType: 'application/json',
        xhrFields: {withCredentials: true},
        success: function (response) {
            console.log("Coupon gespeichert");
            //alert("Coupon erfolgreich gespeichert");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('ajax request failed:', textStatus, errorThrown);
        }
    });
}

function generateDiscountCode (length){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}