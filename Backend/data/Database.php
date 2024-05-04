<?php

class Database
{

    private $servername = "localhost";
    private $username = "admin";
    private $password = "admin";
    private $dbname = "go-organic";
    public $conn;

    public function __construct()
    {
        $this->connect();
    }

    public function connect()
    {
        try {
            $this->conn = new PDO("mysql:host=" . $this->servername . ";dbname=" . $this->dbname, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        } catch (PDOException $e) {
            error_log("Connection failed: " . $e->getMessage());
            die("Connection failed: " . $e->getMessage());
        }
    }

    public function disconnect()
    {
        $this->conn = null;
    }

    public function prepare($query)
    {
        return $this->conn->prepare($query);
    }
}
