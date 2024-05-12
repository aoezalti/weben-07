<?php

require_once('../data/Database.php');

class chartDAO
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }
}

$data = json_decode(file_get_contents('php://input'), true);

if($data){
    foreach ($data as $product){
        echo $product;
    }
    echo json_encode(array('status' => 'Erfolg'));
}else {
    echo json_encode(array('status' => 'Fehler beim Empfangen der Daten'));
}