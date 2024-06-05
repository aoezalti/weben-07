<?php
session_start();

if (isset($_SESSION['userRecord'])) {
    echo json_encode(['success' => true, 'data' => $_SESSION['userRecord']]);
} else {
    echo json_encode(['success' => false, 'message' => 'No user data available']);
}
?>
