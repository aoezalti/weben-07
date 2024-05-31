<?php

require_once('../data/Database.php');

class ProductDAO
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function getProducts() {
        $sql = "SELECT * FROM products;";
        try {
            $stmt = $this->db->conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (PDOException $e) {
            return null;
        }
    }

    public function getProductsByCategory($category) {
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
}

