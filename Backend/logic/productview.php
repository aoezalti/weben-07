<?php

// Include the database configuration file
require_once '../config/db-config.php';

// Create a new connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prepare and bind the SQL statement
$stmt = $conn->prepare("SELECT productid,productname,regularprize,specialprize,insale,imgpath,altimg,category,currentreview,allreviews from products");

// Execute the statement
if ($stmt->execute() === TRUE) {
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $rows = array();
        while ($row = $result->fetch_assoc()){
            $rows[] = $row;
        }
        header("Content-Type: application/json");
        // Array in JSON umwandeln
        $json_data = json_encode($rows);
    }
    echo $json_data;
} else {
    echo "Error: " . $stmt->error;
}



// Close the statement and connection
$stmt->close();
$conn->close();

?>