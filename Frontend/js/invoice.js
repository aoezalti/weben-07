$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    var orderID = urlParams.get('orderID');
    var apiUrl = `http://localhost/weben-07/Backend/logic/requestHandler.php?type=orders&orderID=${orderID}`;
    console.log(orderID);
    getOrders(apiUrl);
    function getOrders(apiUrl) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: apiUrl,
            success: function (response) {

                if (response && response.order_date) {

                    //console.log(response);
                    displayInvoice(response);
                } else {
                    console.log("Keine Produkte gefunden");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('AJAX request failed:', textStatus, errorThrown);
            }
        });
    }



function displayInvoice(order){
    var invoice = `        <h1>Rechnung</h1>
            <p>Rechnungsnummer: INV-${order.productid}</p>
            <p>Datum: ${order.order_date}</p>
            <p>Anschrift:</p>
            <p>${order.salutation} ${order.firstname} ${order.lastname}</p>
            <p>${order.address}</p>
            <p>${order.plz} ${order.city}</p>

            <h2>Bestellpositionen</h2>
            <table border="1">
                <tr>
                    <th>Artikel</th>
                    <th>Stückzahl</th>
                    <th>Preis</th>
                </tr>
                <tr>
                    <td>${order.productname}</td>
                    <td>${order.productCount}</td>
                    <td>${order.totalPrice.toFixed(2)} €</td>
                </tr>
            </table>

            <h3>Status: ${order.state}</h3>`;
    console.log(invoice)
    $('.container.mt-5').append(invoice);
}
})