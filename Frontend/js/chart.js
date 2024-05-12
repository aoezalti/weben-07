var itemprize = 0;
$(document).ready(function () {
    getItemsList();
    buildChart();

    $('.plus').on('click', function (){
        let i = Number($('#id-'+$(this).data('plus')).val());
        let prize = $('#prize-'+$(this).data('plus')).data('prize');
        i += 1;
        $('#id-'+$(this).data('plus')).val(i);
        let newPrize = prize * i;
        amount += prize
        $('#prize-'+$(this).data('plus')).text('€ '+newPrize.toFixed(2));
        $('#totalamount').text('€ '+amount.toFixed(2));
        itemsIdInChart.push($(this).data('plus'));
        $("#cartItemCount").text(itemsIdInChart.length);
        $('#itemCount').text(' '+itemsIdInChart.length+' Artikel im Einkaufswagen');
    })

    $('.minus').on('click', function (){
        let productid = $(this).data('minus');
        let i = Number($('#id-'+$(this).data('minus')).val());
        let prize = $('#prize-'+$(this).data('minus')).data('prize');
        i -= 1;
        if(i<1){
            if(window.confirm('Möchten Sie das Item entfernen?')){
                console.log('Yes');
                itemsList.forEach(function(product){
                    console.log('Produkte: '+product.productid+' '+productid);
                    if(product.productid === productid){
                        console.log(itemsList.length);
                        itemsList.pop(product);
                        console.log(itemsList.length);
                    }
                })
                buildChart();

            }else{
                i = 1;
                return;
            }
        }
        $('#id-'+$(this).data('minus')).val(i);
        let newPrize = prize * i;
        amount -= prize
        $('#prize-'+$(this).data('minus')).text('€ '+newPrize.toFixed(2));
        $('#totalamount').text('€ '+amount.toFixed(2));
        itemsIdInChart.pop($(this).data('minus'));
        $("#cartItemCount").text(itemsIdInChart.length);
        $('#itemCount').text(' '+itemsIdInChart.length+' Artikel im Einkaufswagen');
    })

    $('#checkout').on('click', function() {
        console.log(itemsList);
        $.ajax({
            url: '../../Backend/logic/chartDAO.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(itemsList),
            success: function(response) {
                console.log('Daten erfolgreich gesendet!', response);
            },
            error: function(xhr, status, error) {
                console.error('Fehler beim Senden der Daten:', error);
            }
        });
    })

});

function getItemsList(){
    productsInChart.forEach(product => {
        if (!itemsIdList.includes(product.productid)) {
            itemsIdList.push(product.productid);
            itemsList.push(product);
        }
    })
}

function countSameItems(productid){
    let count = 0;
    productsInChart.forEach(function (product){
        if(product.productid == productid){
            count++
        }
    })
    return count;
}

function calculateItemPrize(product){
    amount=0;
    itemprize = 0;
    let itemcount = countSameItems(product.productid);
    if(product.insale == 1){
        amount += product.specialprize * itemcount;
        itemprize = product.specialprize * itemcount;

    }else{
        amount += product.regularprize * itemcount;
        itemprize = product.regularprize * itemcount;
    }
}

function buildChart(){
    $('#itemsList').empty();
    itemsList.forEach(function (product){
        calculateItemPrize(product);
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
            'data-minus': product.productid
        });
        aminus.text('-');
        let acenter = $('<input/>', {
            'class': 'border input-data',
            'size': '1',
            'id': 'id-'+product.productid,
            'disabled': true
        });
        acenter.val(countSameItems(product.productid));
        div.append(aminus);
        div.append(acenter);
        div.append(aplus);
        cartItem.append(div);

        div = $('<div/>',{
            'class': 'col',
            'id': 'prize-'+product.productid,
            'data-prize': itemprize
        });
        div.text('€ '+itemprize.toFixed(2));
        cartItem.append(div);
        $('#itemsList').append(cartItem);
    });
    $('#itemCount').text(' '+itemsIdInChart.length+' Artikel im Einkaufswagen');
    $('#totalamount').text('€ '+amount.toFixed(2));
}

function getProductsInChart(itemList) {
    apiUrl = 'http://localhost/weben-07/Backend/logic/requestHandler.php?type=productsById&id=';
    if (itemList.length > 0) {
        itemList.forEach(function (item) {
            getProductsById(apiUrl+item);
        });
    } else {
        console.log("Keine Produkte gefunden");
    }
}

function getProductsById(apiUrl) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        url: apiUrl,
        success: function (response) {
            if (response.length > 0) {
                response.forEach(function (product) {
                    if (!productsInChart.includes(product)) {
                        productsInChart.push(product);
                    }
                });
            } else {
                console.log("Keine Produkte gefunden");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('AJAX request failed:', textStatus, errorThrown); // Debugging line
        }
    });
}