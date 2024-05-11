$(document).ready(function () {
    var apiUrl = 'http://localhost/weben-07/Backend/logic/requestHandler.php?type=products';
    /*$("#productPage-link").on("click", function (event) {
        window.location.href = "products.html";
    });*/

    getProducts(apiUrl);
    setTimeout(attachCategoryToNavBar, 100);
    setTimeout(attachCategoryEvent, 100);

    $(this).show();

    function getProducts(apiUrl) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            url: apiUrl,
            success: function (response) {
                if (response.length > 0) {
                    response.forEach(function (product) {
                        // Create product element based on the HTML template
                        products.push(product);
                        let productElement = $('.product-template').clone().removeClass('product-template').show();
                        $('.product-template:first').hide();
                        productElement.addClass("product-card " + product.category).attr("id", "product-" + product.productid).attr("data-id",product.productid).draggable({
                            revert: true,
                            helper: function() {
                                return $(this).clone().css({
                                    opacity: 0.5,
                                    backgroundColor: '#f8f8f8',
                                    border: '2px dashed #ccc',
                                    transform: 'scale(0.5)',
                                    position: 'absolute'
                                });
                            },
                            cursor: 'move'
                        });
                        // Check if the product is on sale
                        if (product.insale === 1) {
                            let salebadge = $("<div class='badge bg-dark text-white position-absolute' style='top: 0.5rem; right: 0.5rem'>Angebot</div>");
                            productElement.find('.card').append(salebadge);
                            productElement.find('.product-price').addClass("fw-bold text-danger").text(`€${product.specialprize}`);
                        } else {
                            productElement.find('.product-price').text(`€${product.regularprize}`);
                        }
                        productElement.find('.card').attr("id", product.productid);
                        productElement.find('.product-img').attr('src', product.imgpath).attr('alt', product.altimg);
                        productElement.find('.product-name').text(product.productname);

                        // Add review stars
                        let reviewDiv = productElement.find('.product-review');
                        let fullStars = parseInt(product.currentreview);
                        let halfStar = product.currentreview % 1 !== 0;
                        for (let i = 0; i < fullStars; i++) {
                            reviewDiv.append('<div class="bi-star-fill"></div>');
                        }
                        if (halfStar) {
                            reviewDiv.append('<div class="bi bi-star-half"></div>');
                        }
                        productElement.find('#productId').text(product.productid);

                        // Add click event to add to cart button
                        productElement.find('.btn').on('click', function () {
                            console.log("button pressed")
                            itemsInBasket.push(product.productid);
                            $("#cartItemCount").text(itemsInBasket.length);
                        });

                        // Append the product element to the product container
                        $('#productgrid').append(productElement);
                        $('#productgrid').fadeIn(1000);
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

    function attachCategoryEvent(obj) {
        if (obj !== undefined) {
            $(".product-card").remove();
            populateProductsByCategory(obj.id);
        }
    }
    function populateProductsByCategory(categorie){
        if (categorie !== 'none') {
            apiUrl = 'http://localhost/weben-07/Backend/logic/requestHandler.php?type=productsByCategory&category=' + categorie;
        } else {
            return
        }
        getProducts(apiUrl);
    }

    function attachCategoryToNavBar() {
        //let categories = [];
        $("#category").empty();
        products.forEach(product => {
            //Liste für die Kategorie-Leiste wird gelesen
            if (!categories.includes(product.category)) {
                categories.push(product.category);
            }
        })

        let categoryBar = $("<nav>");
        let list = $("<ul>");
        categoryBar.attr("class", "navbar navbar-expand-lg navbar-light bg-light").attr("id", "categories");
        list.attr("class", "navbar-nav").attr("id", "category");
        categoryBar.append(list);
        $("#navbar-placeholder").append(categoryBar);
        //Kategorie-Liste wird durchgegeangen und die Buttons erzeugt.
        categories.forEach(category => {
            var item = $("<li>");
            item.attr("class", "nav-item");
            var link = $("<button>");
            link.attr("class", "btn category").attr("id", category).text(category);
            item.append(link);
            $("#category").append(item).hide();
        });

       $(".category").on('click', function () {
           populateProductsByCategory()
        });

        $('.category').on('click', function (event) {
            attachCategoryEvent(this);
        });
        $("#category").slideDown(500);
    }
});