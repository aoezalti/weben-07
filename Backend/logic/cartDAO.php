<?php

require_once('../data/Database.php');

class cartDAO
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function setOrder($data){
        // Prepare and bind the SQL statement
        $sql = "INSERT INTO orders (userid, productid) VALUES (?, ?)";
        foreach ($data as $productid){
            $userid = 1;
            $productid = $productid['productid'];
            try {
                $stmt = $this->db->conn->prepare($sql);
                $stmt->bind_param("ss", $userid, $productid);
                $stmt->execute();
            } catch (PDOException $e) {
                return null;
            }
        }
    }

}


