//js file for editing existing products

$(document).ready(function () {
    var apiUrl = 'http://localhost/weben-07/Backend/logic/requestHandler.php?type=products';

    function getProducts(apiUrl) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: apiUrl,
            success: function (response) {
                // console.log('Initial response:', response);
                if (response.length > 0) {
                    products = response;

                    createProductTable(products);

                } else {
                    console.log("Keine Produkte gefunden");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('AJAX request failed:', textStatus, errorThrown);
            }
        });
    }


    getProducts(apiUrl);


});


function createProductTable(products) {

    var table = `<table class="table">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Regular Price</th>
                            <th>Category</th>
                            <th>Image</th>
                            <th>In Sale</th>
                            <th>All Reviews</th>
                            <th>Current Review</th>
                            <th>Alt Image</th>
                            <th>Special Price</th>
                            <th>Delete Item</th>
                        </tr>
                    </thead>
                    <tbody>`;

    products.forEach(product => {
        let imgPath = product.imgpath;
        if (!imgPath.startsWith('../../Backend/productpictures/')) {
            imgPath = '../../Backend/productpictures/' + imgPath;
        }

        table += `<tr>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;">${product.productid}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="updateField(${product.productid}, 'productname', this)">${product.productname}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="updateField(${product.productid}, 'regularprice', this)">${product.regularprice}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="updateField(${product.productid}, 'category', this)">${product.category}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;"><img src="${imgPath}"  alt="Product Image" style="max-width: 100px; max-height: 100px;"></td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="updateField(${product.productid}, 'insale', this)">${product.insale}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="updateField(${product.productid}, 'allreviews', this)">${product.allreviews}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="updateField(${product.productid}, 'currentreview', this)">${product.currentreview}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="updateField(${product.productid}, 'altimg', this)">${product.altimg}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="updateField(${product.productid}, 'specialprice', this)">${product.specialprice}</td>
<td style="cursor: pointer; text-decoration: underline; color: #0a1621;" onclick="deleteItem(${product.productid})">DELETE</td>
                  </tr>`;
    });

    table += `</tbody></table>`;
    $('.container.mt-5').append(table);
}

function deleteItem(productid) {
    var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php';
    var security = prompt(`Soll das Produkt wirklich gelöscht werden? DELETE eingeben`);
    if (security === "DELETE") {
        changes = {
            'productid': productid
        }
        var payload = {
            type: 'deleteProduct',
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
}

function updateField(productid, field, cell) {
    var apiURL = 'http://localhost/weben-07/Backend/logic/requestHandler.php';
    var currentValue = $(cell).text();
    var newValue = prompt(`neuen Wert für ${field} eingeben:`, currentValue);
    if (newValue !== null) {
        changes = {
            'field': field,
            'newValue': newValue,
            'productid': productid
        }

        var payload = {
            type: 'changeProduct',
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
}
