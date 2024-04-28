var products = [];
var cartitemcount = 0;
var categories = ["Alle Produkte"];

$(document).ready(function() {
    $("#navbar-placeholder").load("../sites/navbar.html", function() {
        attachNavbarEvents();
    });

    $("#content-placeholder").load("home.html", function() {
        loadProductPage();
    });
    $("#footer-placeholder").load("footer.html");
});
function getProducts() {
    fetch("../../Backend/logic/productview.php")
    .then(response =>{
        if(!response.ok){
            throw new Error('Netzwerkantwort war nicht ok.');
        }
        return response.json();
    })
    .then(productsJson =>{
        productsJson.forEach(product => {
            products.push(product);
        })
    })
    .catch(error =>{
        console.error('Fehler beim Abrufen der Daten:', error);
    })

}

function attachCategoryEvent(obj) {
    if (obj !== undefined) {
        $(".product-card").remove();
        populateProductsByCategory(obj.id);
    }
}

function loadProductPage() {
    $("#productPage").on("click", function (event) {
        event.preventDefault();
        $("#content-placeholder").load("products.html", function () {
            getProducts();
            setTimeout(populateProducts, 100);
            setTimeout(attachCategoryToNavBar, 100);
            setTimeout(attachCategoryEvent, 100);
            $(this).show();
        });
    });
}

function attachNavbarEvents() {
    $("#registerButton").on("click", function (event) {
        event.preventDefault();
        $("#categories").slideUp(500);
        $("#content-placeholder").load("register.html");
    });
    loadProductPage();

    $("#cartButton").attr("ondrop","drop(event)").attr("ondragover","allowDrop(event)")
    $("#cartButton").on("click", function () {
        console.log("Cart button clicked!");
    });
}

function populateProducts() {
    products.forEach(product => {
        let productElement = $('.product-template').clone().removeClass('product-template').show();
        productElement.attr("id", "product-" + product.productid);
        productElement.attr("class","product-card "+product.category).attr("draggable","true").attr("ondragstart","drag(event)");
        //Prüfung ob das Produkt im Angebot ist. Wenn Ja, wird die Markierung gesetzt und der Preis rot markiert
        if(product.insale == 1){
            let salebadge = $("<div>");
            salebadge.attr("class","badge bg-dark text-white position-absolute").attr("style", "top: 0.5rem; right: 0.5rem").text("Angebot");
            productElement.find('.card').append(salebadge);
            productElement.find('.product-price').attr("class","fw-bold text-danger").text(`€${product.specialprize}`);
        }else{
            productElement.find('.product-price').text(`€${product.regularprize}`);
        }
        productElement.find('.card').attr("id",product.productid);
        productElement.find('.product-img').attr('src', product.imgpath).attr('alt', product.altimg);
        productElement.find('.product-name').text(product.productname);
        
        //Bewertung einfügen

        let j = parseInt(product.currentreview);
        let review;
        for (var i=0; i<j; i++){
            review = $("<div>");
            review.attr("class","bi-star-fill");
            productElement.find('.product-review').append(review);
        }
        if(product.currentreview % j != 0){
            review = $("<div>");
            review.attr("class","bi bi-star-half");
            productElement.find('.product-review').append(review);
        }
        let k = product.currentreview % j;
        
        
        productElement.find('.product-review')
        productElement.find('.btn').on('click', function(){
            cartitemcount++;
            $("#cartItemCount").text(cartitemcount);
        });
        console.log(productElement);
        console.log(products);
        // Check if the product is already in the grid
        if ($("#product-" + product.productid).length === 0) {  // using ID
            // Append the element only if it does not exist
            $('#productgrid').append(productElement);
        }
    });
    $('#productgrid').fadeIn(1000);
}

function populateProductsByCategory(category){
    if (category == "Alle Produkte"){
        populateProducts();
    } else{
        products.forEach(product => {
            let productElement = $('.product-template').clone().removeClass('product-template').show();
            productElement.attr("class","product-card "+product.category).attr("draggable","true").attr("ondragstart","drag(event)");
            if(product.category == category){
                //Prüfung ob das Produkt im Angebot ist. Wenn Ja, wird die Markierung gesetzt und der Preis rot markiert
                if(product.insale == 1){
                    let salebadge = $("<div>");
                    salebadge.attr("class","badge bg-dark text-white position-absolute").attr("style", "top: 0.5rem; right: 0.5rem").text("Angebot");
                    productElement.find('.card').append(salebadge);
                    productElement.find('.product-price').attr("class","fw-bold text-danger").text(`€${product.specialprize}`);
                } else{
                    productElement.find('.product-price').text(`€${product.regularprize}`);
                }
                productElement.find('.card').attr("id",product.productid);
                productElement.find('.product-img').attr('src', product.imgpath).attr('alt', product.altimg);
                productElement.find('.product-name').text(product.productname);
                
                //Bewertung
                let j = parseInt(product.currentreview);
                let review;
                for (var i=0; i<j; i++){
                    review = $("<div>");
                    review.attr("class","bi-star-fill");
                    productElement.find('.product-review').append(review);
                }
                if(product.currentreview % j != 0){
                    review = $("<div>");
                    review.attr("class","bi bi-star-half");
                    productElement.find('.product-review').append(review);
                }
                let k = product.currentreview % j;
                
                
                productElement.find('.product-review')
                productElement.find('.btn').on('click', function(){
                    cartitemcount++;
                    $("#cartItemCount").text(cartitemcount);
                });
                $('#productgrid').append(productElement).hide();
            }
        });
        $('#productgrid').fadeIn(1000);

    }

}

function attachCategoryToNavBar(){
    $("#category").empty();
    products.forEach(product =>{
        //Liste für die Kategorie-Leiste wird gelesen
        if (!categories.includes(product.category)){
            categories.push(product.category);

        }
    })
    let categoryBar = $("<nav>");
    let list = $("<ul>");
    categoryBar.attr("class", "navbar navbar-expand-lg navbar-light bg-light").attr("id","categories");
    list.attr("class","navbar-nav").attr("id","category");
    categoryBar.append(list);
    $("#navbar-placeholder").append(categoryBar);
    //Kategorie-Liste wird durchgegeangen und die Buttons erzeugt.
    categories.forEach(category =>{
        var item = $("<li>");
        item.attr("class","nav-item");
        var link = $("<button>");
        link.attr("class","btn category").attr("id", category).text(category);
        item.append(link);
        $("#category").append(item).hide();
    });
    
    $('.category').on('click', function(event){
        attachCategoryEvent(this);
    });
    $("#category").slideDown(500);
}

function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
  function drop(ev) {
    ev.preventDefault();
    cartitemcount++;
    $("#cartItemCount").text(cartitemcount);
  }