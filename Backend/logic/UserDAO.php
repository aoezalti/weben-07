<?php

include_once '../data/db-config.php';

class UserDAO
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }
}

// Retrieve the JSON data sent from the client-side
$data = json_decode(file_get_contents('php://input'), true);


// Extract data from the JSON object
$email = $data['email'];
$anrede = $data['anrede'];
$vorname = $data['vorname'];
$nachname = $data['nachname'];
$adresse = $data['adresse'];
$plz = $data['plz'];
$ort = $data['ort'];
$benutzername = $data['benutzername'];
$passwort = $data['passwort'];
$zahlungsinformationen = $data['zahlungsinformationen'];


// Hash the password
$hashedPassword = password_hash($passwort, PASSWORD_DEFAULT);

// Create a new connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error)
{
die("Connection failed: " . $conn->connect_error);
}

// Prepare and bind the SQL statement
$stmt = $conn->prepare("INSERT INTO users (mail, salutation, firstname, lastname, address, plz, city, username, password, paymentInformation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssssss", $email, $anrede, $vorname, $nachname, $adresse, $plz, $ort, $benutzername, $hashedPassword, $zahlungsinformationen);

// Execute the statement
if ($stmt->execute() === TRUE) {
    echo "Registration successful!";
} else {
    echo "Error: " . $stmt->error;
}

// Close the statement and connection
$stmt->close();
$conn->close();

