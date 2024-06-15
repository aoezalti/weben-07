<?php
session_start();

if (isset($_SESSION['userRecord'])) {
    echo json_encode(['success' => true, 'data' => $_SESSION['userRecord'],'paymentData'=>$_SESSION['paymentData'],'orderData'=>$_SESSION['orderData']]);
} else {
    echo json_encode(['success' => false, 'message' => 'No user data available']);
}
?>
