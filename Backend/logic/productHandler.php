<?php

include_once 'ProductDAO.php';

class ProductHandler
{
    private $productDAO;

    public function __construct($db)
    {
        $this->productDAO = new ProductDAO($db);
    }

    public function handleFormSubmission($formData, $fileData)
    {
        // Extract and sanitize form data
        $productName = htmlspecialchars(strip_tags($formData['productName']));
        $productPrice = htmlspecialchars(strip_tags($formData['productPrice']));
        $productCategory = htmlspecialchars(strip_tags($formData['productCategory']));
        $productSpecialPrice = htmlspecialchars(strip_tags($formData['productSpecialPrice']));
        $productInSale = isset($formData['productInSale']) ? 1 : 0;
        $productAltImg = htmlspecialchars(strip_tags($formData['productAltImg']));
        $currentReview = htmlspecialchars(strip_tags($formData['currentReview']));
        $allReviews = htmlspecialchars(strip_tags($formData['allReviews']));

        // Handle file upload
        $uploadDir = '../productpictures/';
        $uploadFile = $uploadDir . basename($fileData['productImage']['name']);

        if (move_uploaded_file($fileData['productImage']['tmp_name'], $uploadFile)) {
            // Prepare product data
            $productData = [
                'productName' => $productName,
                'productPrice' => $productPrice,
                'productSpecialPrice' => $productSpecialPrice,
                'productInSale' => $productInSale,
                'productAltImg' => $productAltImg,
                'productImage' => $uploadFile,
                'productCategory' => $productCategory,
                'currentReview' => $currentReview,
                'allReviews' => $allReviews
            ];

            // Insert product data into the database
            return $this->productDAO->insertProduct($productData);
        } else {
            return ["success" => false, "message" => "Fehler beim Hochladen des Bildes."];
        }
    }
}
