<?php

require_once('../data/Database.php');

class cartDAO
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }

}
// Retrieve the JSON data sent from the client-side
$data = json_decode(file_get_contents('php://input'), true);

if($data){
    // Create a new connection to the database
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error)
    {
        die("Connection failed: " . $conn->connect_error);
    }
    foreach ($data as $productid){
       $userid = 1;
       $productid = $productid['productid'];

        // Prepare and bind the SQL statement
        $stmt = $conn->prepare("INSERT INTO orders (userid, productid) VALUES (?, ?)");
        $stmt->bind_param("ss", $userid, $productid);

        // Execute the statement
        if ($stmt->execute() === TRUE) {
            echo "Bestellung aufgenommen";
        } else {
            echo "Error: " . $stmt->error;
        }
        // Close the statement and connection
        $stmt->close();
        $conn->close();
    }
    // Close the statement and connection
    $stmt->close();
    $conn->close();
    echo json_encode(array('status' => 'Erfolg'));
}else {
    echo json_encode(array('status' => 'Fehler beim Empfangen der Daten'));
}


