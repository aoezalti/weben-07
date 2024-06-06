$(document).ready(function () {
    var apiUrl = 'http://localhost/weben-07/Backend/logic/requestHandler.php?type=products';
    /*$("#productPage-link").on("click", function (event) {
        window.location.href = "products.html";
    });*/

    getProducts(apiUrl);
    setTimeout(attachCategoryToNavBar, 100);
    setTimeout(attachCategoryEvent, 100);

    $(this).show();

    function createProductElement(product) {
        let productElement = createBaseProductElement(product);
        productElement = addProductImage(productElement, product);
        productElement = addProductName(productElement, product);
        productElement = addProductPrice(productElement, product);
        productElement = addProductReview(productElement, product);
        productElement = addCartButton(productElement, product);
        return productElement;
    }

    function addCartButton(productElement, product) {
        productElement.find('.btn').addClass('add-to-cart').data('id', product.productid);
        return productElement;
    }

    function createBaseProductElement(product) {
        let productElement = $('.product-template').clone().removeClass('product-template').show();
        $('.product-template:first').hide();
        productElement.addClass("product-card " + product.category)
            .attr("id", "product-" + product.productid)
            .attr("data-id", product.productid)
            .draggable({
                revert: true,
                cursor: 'move',
                helper: function () {
                    // Create a smaller version of the product card
                    let helper = $(this).clone();
                    helper.css({
                        width: '200px',
                        height: '200px',
                        overflow: 'hidden'
                    });
                    helper.find('.card-body').css('display', 'none'); // Hide detailed content
                    helper.find('.card-footer').css('display', 'none'); // Hide detailed content
                    return helper;
                }
            });
        return productElement;
    }

    function addProductImage(productElement, product) {
        productElement.find('.product-img').attr('src', product.imgpath).attr('alt', product.altimg);
        return productElement;
    }

    function addProductName(productElement, product) {
        productElement.find('.product-name').text(product.productname);
        return productElement;
    }

    function addProductPrice(productElement, product) {
        if (product.insale === 1) {
            let salebadge = $("<div class='badge bg-dark text-white position-absolute' style='top: 0.5rem; right: 0.5rem'>Angebot</div>");
            productElement.find('.card').append(salebadge);
            productElement.find('.product-price').addClass("fw-bold text-danger").text(`€${product.specialprice}`);
        } else {
            productElement.find('.product-price').text(`€${product.regularprice}`);
        }
        return productElement;
    }

    function addProductReview(productElement, product) {
        let reviewDiv = productElement.find('.product-review');
        let fullStars = parseInt(product.currentreview);
        let halfStar = product.currentreview % 1 !== 0;
        for (let i = 0; i < fullStars; i++) {
            reviewDiv.append('<div class="bi-star-fill"></div>');
        }
        if (halfStar) {
            reviewDiv.append('<div class="bi bi-star-half"></div>');
        }
        return productElement;
    }



    function updateUI(products) {
        products.forEach(function (product) {
            let productElement = createProductElement(product);
            $('#productgrid').append(productElement);
        });
        $('#productgrid').fadeIn(1000);
    }

    function getProducts(apiUrl) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            url: apiUrl,
            success: function (response) {
                if (response.length > 0) {
                    response.forEach(function (product) {
                        // Create product element based on the HTML template in products.html
                        products.push(product);
                    });
                    updateUI(products);
                } else {
                    console.log("Keine Produkte gefunden");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('AJAX request failed:', textStatus, errorThrown);
            }
        });
    }

    function attachCategoryEvent(obj) {
        if (obj !== undefined) {
            $(".product-card").remove();
            populateProductsByCategory(obj.id);
        }
    }

    function populateProductsByCategory(category){
        if (category === 'Alle Produkte') {
            updateUI(products);
        } else if (category !== 'none') {
            let filteredProducts = products.filter(product => product.category === category);
            updateUI(filteredProducts);
        }
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