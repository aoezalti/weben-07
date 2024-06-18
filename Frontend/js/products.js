var products = [];
$(document).ready(function () {
    var apiUrl = 'http://localhost/weben-07/Backend/logic/requestHandler.php?type=products';

    var categories = ["Alle Produkte"];

    getProducts(apiUrl);
    setTimeout(attachCategoryToNavBar, 100);
    setTimeout(attachCategoryEvent, 100);

    $('#product-search').on('input', function () {
        let query = $(this).val();
        searchProducts(query);
    });

    function searchProducts(query) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: apiUrl,
            data: { search: query },
            success: function (response) {
                $('#productgrid').empty();
                if (response.length > 0) {
                    products = response;
                    updateUI(products);
                } else {
                    $('#productgrid').append('<p>No products found</p>');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('AJAX request failed:', textStatus, errorThrown);
            }
        });
    }

    function getProducts(apiUrl) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: apiUrl,
            success: function (response) {
                // console.log('Initial response:', response);
                if (response.length > 0) {
                    products = response;
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

    function updateUI(products) {
        $('#productgrid').empty();
        products.forEach(function (product) {
            let productElement = createProductElement(product);
            $('#productgrid').append(productElement);
        });
        $('#productgrid').fadeIn(1000);
    }

    // product element generation without template, add elements dynamically
    function createProductElement(product) {
        let productElement = $('<div class="col mb-5 product-card ' + product.category + '">');
        productElement.attr("id", "product-" + product.productid)
            .attr("data-id", product.productid);

        let card = $('<div class="card h-100">').appendTo(productElement);
        addProductImage(card, product);
        let cardBody = $('<div class="card-body p-4">').appendTo(card);
        let textCenter = $('<div class="text-center">').appendTo(cardBody);
        addProductName(textCenter, product);
        addProductReview(textCenter, product);
        addProductPrice(textCenter, product);
        let cardFooter = $('<div class="card-footer p-4 pt-0 border-top-0 bg-transparent">').appendTo(card);
        let textCenterFooter = $('<div class="text-center">').appendTo(cardFooter);
        addCartButton(textCenterFooter, product);

        productElement.draggable({
            revert: true,
            cursor: 'move',
            helper: function () {
                let helper = $(this).clone();
                helper.css({
                    width: '200px',
                    height: '200px',
                    overflow: 'hidden'
                });
                helper.find('.card-body').css('display', 'none');
                helper.find('.card-footer').css('display', 'none');
                return helper;
            }
        });

        return productElement;
    }

    function addProductImage(container, product) {
        let imgPath = product.imgpath;
        if (!imgPath.startsWith('../../Backend/productpictures/')) {
            imgPath = '../../Backend/productpictures/' + imgPath;
        }
        $('<img class="card-img-top product-img">')
            .attr('src', imgPath)
            .attr('alt', product.altimg)
            .appendTo(container);
    }

    function addProductName(container, product) {
        $('<h5 class="fw-bolder product-name">').text(product.productname).appendTo(container);
    }

    function addProductPrice(container, product) {
        if (product.insale === 1) {
            $('<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Angebot</div>')
                .appendTo(container.closest('.card'));
            $('<div class="product-price fw-bold text-danger">').text(`€${product.specialprice}`).appendTo(container);
        } else {
            $('<div class="product-price">').text(`€${product.regularprice}`).appendTo(container);
        }
    }

    function addProductReview(container, product) {
        let reviewDiv = $('<div class="d-flex justify-content-center small text-warning mb-2 product-review">').appendTo(container);
        let fullStars = parseInt(product.currentreview);
        let halfStar = product.currentreview % 1 !== 0;
        for (let i = 0; i < fullStars; i++) {
            reviewDiv.append('<div class="bi-star-fill"></div>');
        }
        if (halfStar) {
            reviewDiv.append('<div class="bi bi-star-half"></div>');
        }
    }

    function addCartButton(container, product) {
        console.log('Adding cart button to product element:', product);
        $('<a class="btn btn-outline-dark mt-auto add-to-cart">')
            .text('In den Einkaufswagen')
            .data('id', product.productid)
            .appendTo(container);
    }

    function attachCategoryEvent(obj) {
        if (obj !== undefined) {
            $(".product-card").remove();
            populateProductsByCategory(obj.id);
        }
    }

    function populateProductsByCategory(category) {
        if (category === 'Alle Produkte') {
            updateUI(products);
        } else if (category !== 'none') {
            let filteredProducts = products.filter(product => product.category === category);
            updateUI(filteredProducts);
        }
    }

    function attachCategoryToNavBar() {
        $("#category").empty();
        products.forEach(product => {
            if (!categories.includes(product.category)) {
                categories.push(product.category);
            }
        });

        let categoryBar = $("<nav>");
        let list = $("<ul>");
        categoryBar.attr("class", "navbar navbar-expand-lg navbar-light bg-light").attr("id", "categories");
        list.attr("class", "navbar-nav").attr("id", "category");
        categoryBar.append(list);
        $("#categories").append(categoryBar);

        categories.forEach(category => {
            var item = $("<li>");
            item.attr("class", "nav-item");
            var link = $("<button>");
            link.attr("class", "btn category").attr("id", category).text(category);
            item.append(link);
            $("#category").append(item).hide();
        });

        $(".category").on('click', function () {
            populateProductsByCategory();
        });

        $('.category').on('click', function (event) {
            attachCategoryEvent(this);
        });
        $("#category").slideDown(500);
    }
});
