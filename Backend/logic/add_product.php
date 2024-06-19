<?php

include_once './ProductHandler.php';
require_once('../data/Database.php');

$db = new Database();
$productHandler = new ProductHandler($db);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = $productHandler->handleFormSubmission($_POST, $_FILES);
    echo json_encode($response);
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}

?>
