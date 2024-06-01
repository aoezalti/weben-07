var itemprice = 0;
var totalAmount = 0.0;
var itemsList = [];
var productsInCart = [];

$(document).ready(function () {
    getItemsList();
    buildChart();

});

function attachChartEvents(){
    $('.delete').on('click', function(){
        let productid = $(this).data('delete');
        if(window.confirm('Möchten Sie das Item entfernen?')){
            productsInCart.forEach(function(product) {
                if (product.productid == productid) {
                    if (itemsIdInCart.includes(productid)){
                        itemsIdInCart.pop(productid);
                    }
                    productsInCart.pop(product);
                }
            });
            itemsList = [];
            getItemsList();
            console.log(itemsList);
            console.log(itemsIdInCart);
            console.log(productsInCart);
        }
        buildChart();
    });

    $('.plus').on('click', function (){
        let i = Number($('#id-'+$(this).data('plus')).val());
        let price = parseFloat($('#price-'+$(this).data('plus')).data('price'));
        i += 1;
        $('#id-'+$(this).data('plus')).val(i);
        let newItemPrice = price * i;
        totalAmount += price;
        $('#price-'+$(this).data('plus')).text('€ '+newItemPrice.toFixed(2));
        $('#totalamount').text('€ '+totalAmount.toFixed(2));
        itemsIdInCart.push($(this).data('plus'));
        let product = productsInCart.find(product => product.productid ==$(this).data('plus'));
        productsInCart.push(product);
        itemsList.push(product);
        $("#cartItemCount").text(itemsIdInCart.length);
        $('#itemCount').text(' '+itemsIdInCart.length+' Artikel im Einkaufswagen');
    })

    $('.minus').on('click', function (){
        let productid = $(this).data('minus');
        let i = Number($('#id-'+$(this).data('minus')).val());
        let price = parseFloat($('#price-'+productid).data('price'));
        i -= 1;
        if(i<1){
            i=1;
        }else {
            $('#id-'+$(this).data('minus')).val(i);
            let newPrice = price * i;
            totalAmount -= price
            $('#price-'+$(this).data('minus')).text('€ '+newPrice.toFixed(2));
            $('#totalamount').text('€ '+totalAmount.toFixed(2));
            itemsIdInCart.pop($(this).data('minus'));
            let product = productsInCart.find(product => product.productid ==$(this).data('minus'));
            productsInCart.pop(product);
            itemsList.pop(product);
            $("#cartItemCount").text(itemsIdInCart.length);
            $('#itemCount').text(' '+itemsIdInCart.length+' Artikel im Einkaufswagen');
        }
    })

    $('#checkout').on('click', function() {
        $.ajax({
            url: 'http://localhost/weben-07/Backend/logic/requestHandler.php?type=order',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(itemsIdInCart),
            success: function(response) {
                console.log('Daten erfolgreich gesendet!', response);
                $("#content-placeholder").load("checkout.html");
                // SQL-Statement für Datenabruf:
                // Select u.salutation, u.firstname, u.lastname, p.productname, p.regularprice, p.specialprice, p.insale, p.imgpath
                // from users u,products p, orders o where u.userid = o.userid and p.productid = o.productid and o.state = 'checkout';
            },
            error: function(xhr, status, error) {
                console.error('Fehler beim Senden der Daten:', error);
            }
        });
    })
}

function getItemsList(){
    let checkId = [];
    productsInCart.forEach(product => {
        if (!checkId.includes(product.productid)) {
            checkId.push(product.productid);
            itemsList.push(product);
        }
    })
}

function countSameItems(productid){
    let count = 0;
    productsInCart.forEach(function (product){
        if(product.productid == productid){
            count++
        }
    })
    return count;
}

function calculateItemPrice(product){
    itemprice = 0;
    let itemcount = countSameItems(product.productid);
    if(product.insale == 1){
        totalAmount += product.specialprice * itemcount;
        itemprice = product.specialprice * itemcount;

    }else{
        totalAmount += product.regularprice * itemcount;
        itemprice = product.regularprice * itemcount;
    }
}

function buildChart(){
    $('#itemsList').text('');
    totalAmount = 0.0;
    itemsList.forEach(function (product){
        calculateItemPrice(product);
        let countedItems = countSameItems(product.productid);
        let cartItem = $('<div/>',{
            'class': 'row main align-items-center cartItem',
            'data-productId': product.productname
        });
        let div = $('<div/>', {
            'class': 'col-2'
        })
        let img = $('<img/>', {
            'class': 'img-fluid',
            'src': product.imgpath
        })
        div.append(img);
        cartItem.append(div);
        div = $('<div>', {
            'class': 'col'
        })
        let div1 = $('<div/>',{
            'class': 'row text-muted',
        })
        div1.text(product.category);
        let div2 = $('<div/>', {
            'class': 'row'
        })
        div2.text(product.productname);
        div.append(div1);
        div.append(div2);
        cartItem.append(div);

        div = $('<div/>',{
            'class': 'col'
        });
        let aplus = $('<a/>', {
            'class': 'btn btn-outline-dark mt-auto plus',
            'data-plus': product.productid
        });
        aplus.text('+');
        let aminus = $('<a/>', {
            'class': 'btn btn-outline-dark mt-auto minus',
            'data-minus': product.productid,
            'data-productname': product.prodactname
        });
        aminus.text('-');

        let acenter = $('<input/>', {
            'class': 'border input-data',
            'size': '1',
            'id': 'id-'+product.productid,
            'disabled': true
        });
        acenter.val(countedItems);
        div.append(aminus);
        div.append(acenter);
        div.append(aplus);
        cartItem.append(div);
        let productprice
        if(product.insale == 1){
            productprice = product.specialprice;
        }else{
            productprice = product.regularprice;
        }
        div = $('<div/>',{
            'class': 'col',
            'id': 'price-'+product.productid,
            'data-price': productprice
        });
        div.text('€ '+itemprice.toFixed(2));
        cartItem.append(div);
        div = $('<div/>',{
            'class': 'col-2'
        });
        let deleteBtn = $('<a/>',{
            'class': 'btn mt-auto delete',
            'data-delete': product.productid
        });
        deleteBtn.text('x');
        div.append(deleteBtn);
        cartItem.append(div);
        $('#itemsList').append(cartItem);
    });
    $('#itemCount').text(' '+itemsIdInCart.length+' Artikel im Einkaufswagen');
    $('#totalamount').text('€ '+totalAmount.toFixed(2));
    attachChartEvents()
}

function getProductsInCart(itemList) {
    apiUrl = 'http://localhost/weben-07/Backend/logic/requestHandler.php?type=productsById&id=';
    const promises = [];
    if (itemList.length > 0) {
        itemList.forEach(function (item) {
            promises.push(getProductsById(apiUrl + item));
        });
        return Promise.all(promises);
    } else {
        console.log("Keine Produkte gefunden");
        return Promise.resolve([]);
    }

}

function getProductsById(apiUrl) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            url: apiUrl,
            success: function (response) {
                if (response.length > 0) {
                    response.forEach(function (product) {
                        productsInCart.push(product);
                    });
                } else {
                    console.log("Keine Produkte gefunden");
                }
                resolve(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('AJAX request failed:', textStatus, errorThrown); // Debugging line
                reject(errorThrown);
            }

        });
    });
}