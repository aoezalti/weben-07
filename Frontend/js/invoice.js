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

                if (response[0] && response[0].orderdate) {

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



    function displayInvoice(orders) {
        // Initialize an empty string to store the invoice HTML
        let invoice = `<h1>Rechnung</h1>
<p><u>Rechnungsnummer: INV-${orders[0].order_id}</u></p>
            <p><u>Datum: ${orders[0].orderdate}</u></p>
            <p><u>Anschrift:</u></p>
            <p>${orders[0].salutation} ${orders[0].firstname} ${orders[0].lastname}</p>
            <p>${orders[0].address}</p>
            <p>${orders[0].plz} ${orders[0].city}</p>

            <h2>Bestellpositionen</h2>
<table border="1">
                <tr>
                    <th>Artikel</th>
                    <th>Stückzahl</th>
                    <th>Preis</th>
                </tr>
`;

        // Loop through each order
        orders.forEach((order, index) => {
            invoice +=
                `<tr><td>${order.productname}</td>
                   <td style="text-align: center;">${order.productCount}</td>
                 <td>${order.totalPrice.toFixed(2)} €</td></tr>
        `
        });
        invoice+=`
<td style="border-top: 2px solid black;"><b><u>Total:</b></u></td>
<td style="border-top: 2px solid black; text-align: center;">EUR</td>
<td style="border-top: 2px solid black;">${orders[0].total}</td>
</table>`;
        // Append the invoice to the container (assuming you have an element with class 'container.mt-5')
        $('.container.mt-5').append(invoice);
    }

})