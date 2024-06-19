<?php

require_once('../data/Database.php');

class ProductDAO
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function getProducts($search = '')
    {
        if ($search) {
            $sql = "SELECT * FROM products WHERE productname LIKE :search1 OR category LIKE :search2";
            try {
                $stmt = $this->db->conn->prepare($sql);
                $searchTerm = '%' . $search . '%';
                $stmt->bindParam(':search1', $searchTerm);
                $stmt->bindParam(':search2', $searchTerm);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                return $result;
            } catch (PDOException $e) {
                error_log($e->getMessage());
                return null;
            }
        } else {
            $sql = "SELECT * FROM products;";
            try {
                $stmt = $this->db->conn->prepare($sql);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                return $result;
            } catch (PDOException $e) {
                error_log($e->getMessage());
                return null;
            }
        }
    }

    public function getProductsByCategory($category) {
        if($category == "Alle Produkte"){
            return $this->getProducts();
        }
        $sql = "SELECT * FROM products WHERE category = :category;";
        try {
            $stmt = $this->db->conn->prepare($sql);
            $stmt->bindParam(':category', $category);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (PDOException $e) {
            return null;
        }
    }

    public function getProductsById($id) {
        $sql = "SELECT * FROM products WHERE productid = :id;";
        try {
            $stmt = $this->db->conn->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (PDOException $e) {
            return null;
        }
    }

    public function changeProduct($productData){
        try {
            $field =$productData['field'];
            $sql = "UPDATE products SET $field = :value WHERE productid = :productid;";
            $stmt = $this->db->conn->prepare($sql);
            $stmt->bindParam(':value', $productData['newValue']);
            $stmt->bindParam(':productid', $productData['productid']);
            $stmt->execute();
            return ["success" => true];
        } catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }
    }

    public function deleteProduct($productData){
        try {
            $id =$productData['productid'];
            $sql = "DELETE from products WHERE productid = :productid;";
            $stmt = $this->db->conn->prepare($sql);
            $stmt->bindParam(':productid', $productData['productid']);
            $stmt->execute();
            return ["success" => true];
        } catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }
    }

    public function insertProduct($productData)
    {
        try {
            // Sanitize inputs
            $productName = htmlspecialchars(strip_tags($productData['productName']));
            $productPrice = htmlspecialchars(strip_tags($productData['productPrice']));
            $productCategory = htmlspecialchars(strip_tags($productData['productCategory']));
            $productSpecialPrice = htmlspecialchars(strip_tags($productData['productSpecialPrice']));
            $productInSale = htmlspecialchars(strip_tags($productData['productInSale']));
            $productAltImg = htmlspecialchars(strip_tags($productData['productAltImg']));
            $productImage = htmlspecialchars(strip_tags($productData['productImage']));
            $currentReview = htmlspecialchars(strip_tags($productData['currentReview']));
            $allReviews = htmlspecialchars(strip_tags($productData['allReviews']));
            $productImage = str_replace('../', '../../Backend/', $productImage);

            // Insert product data into the database
            $sql = "INSERT INTO products (productname, regularprice, specialprice, insale, altimg, imgpath, category, currentreview, allreviews) VALUES (:productname, :regularprice, :specialprice, :insale, :altimg, :imgpath, :category, :currentreview, :allreviews)";
            $stmt = $this->db->conn->prepare($sql);
            $stmt->bindParam(':productname', $productName);
            $stmt->bindParam(':regularprice', $productPrice);
            $stmt->bindParam(':specialprice', $productSpecialPrice);
            $stmt->bindParam(':insale', $productInSale);
            $stmt->bindParam(':altimg', $productAltImg);
            $stmt->bindParam(':imgpath', $productImage);
            $stmt->bindParam(':category', $productCategory);
            $stmt->bindParam(':currentreview', $currentReview);
            $stmt->bindParam(':allreviews', $allReviews);

            if ($stmt->execute()) {
                return ["success" => true, "message" => "Produkt erfolgreich hinzugefügt!"];
            } else {
                return ["success" => false, "message" => "Fehler beim Hinzufügen des Produkts."];
            }
        } catch (PDOException $e) {
            return ["success" => false, "message" => "Datenbankfehler: " . $e->getMessage()];
        }
    }
}
