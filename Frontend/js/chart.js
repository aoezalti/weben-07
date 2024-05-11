var amount = 0.0;

$(document).ready(function () {

    productsInChart.forEach(function (product){
        let cartItem = $('<div/>',{
            'class': 'row main align-items-center'
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
            'class': 'btn btn-outline-dark mt-auto',
            'href': '#'
        });
        aplus.text('+');
        let aminus = $('<a/>', {
            'class': 'btn btn-outline-dark mt-auto',
            'href': '#'
        });
        aminus.text('-');
        let acenter = $('<input/>', {
            'class': 'border',
            'size': '1',
            'href': '#'
        });
        acenter.val(1);
        div.append(aminus);
        div.append(acenter);
        div.append(aplus);
        cartItem.append(div);

        div = $('<div/>',{
            'class': 'col'
        });
        if(product.insale == 1){
            div.text('€ '+product.specialprize);
            amount += product.specialprize;
        }else{
            div.text('€ '+product.regularprize);
            amount += product.regularprize;
        }
        cartItem.append(div);
        $('#itemsList').append(cartItem);
    });
    $('#itemCount').text(' '+productsInChart.length+' Artikel im Einkaufswagen');
    $('#totalamount').text(amount);



});




    /*

    <a class="btn btn-outline-dark mt-auto" href="#">In den Einkaufswagen</a>

    <div class="row" style="border-top: 1px solid rgba(0,0,0,.1); padding: 2vh 0;">
        <div class="col">TOTAL PRICE</div>
        <div class="col text-right" id="amount">&euro; 137.00</div>
    </div>

    <div class="row main align-items-center">
            <div class="col-2"><img class="img-fluid" src="#"></div>
            <div class="col">
                <div class="row text-muted">Shirt</div>
                <div class="row">Cotton T-shirt</div>
            </div>

            <div class="col">
                <a href="#">-</a>
                <a href="#" class="border">1</a>
                <a href="#">+</a>
            </div>
            <div class="col">&euro; 44.00 <span class="close">&#10005;</span></div>
        </div>
     */