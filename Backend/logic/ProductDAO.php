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
}
