<?php

require_once('../data/Database.php');

class cartDAO
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function saveOrder($data){
        $result_order = $this->setOrder($data);
        if ($data['usedVoucher'] === true){
           $result_voucher = $this->setVoucher($data);
        }
        return isset($result_voucher) ? $result_order && $result_voucher : $result_order;
    }

    private function setVoucher($data){
        $residual_value = (float)$data['residual_value'];
        if ($residual_value === 0){
            $sql = "delete from vouchers where user_id = :userid";
            try {
                $stmt = $this->db->prepare($sql);
                $stmt->bindParam(':userid', $data['userid']);
                $stmt->execute();
                return ["success" => "Voucher updated successful!"];
            } catch (PDOException $e) {
                return $e->getMessage();
            }
        }else {
            $sql = "update vouchers set residual_value = :residual_value where user_id = :userid";
            try {
                $stmt = $this->db->prepare($sql);
                $stmt->bindParam(':residual_value', $residual_value);
                $stmt->bindParam(':userid', $data['userid']);
                $stmt->execute();
                return ["success" => "Voucher updated successful!"];
            } catch (PDOException $e) {
                return $e->getMessage();
            }
        }
    }

    private function setOrder($data){
        $items = $data['items'];
        $paymentmethod = $data['paymentmethod'];
        $currentTimestamp = date('Y-m-d H:i:s');
        // Prepare and bind the SQL statement
        $sql = "insert into orders (user_id, productname, productprice, productquantity, total, paymentmethod, orderdate) values (:user_id, :productname, :productprice, :productquantity, :total, :paymentmethod, :currentTimestamp)";
        foreach ($items as $item){
            $productname = $item['name'];
            $productprice = $item['price'];
            $productquantity = $item['quantity'];
            $total = $productquantity * $productprice;
            try {
                $stmt = $this->db->conn->prepare($sql);
                $stmt->bindParam(":user_id", $data['userid']);
                $stmt->bindParam(":productname", $productname);
                $stmt->bindParam(":productprice", $productprice);
                $stmt->bindParam(":productquantity", $productquantity);
                $stmt->bindParam(":total", $total);
                $stmt->bindParam(":paymentmethod", $paymentmethod);
                $stmt->bindParam(":currentTimestamp", $currentTimestamp);
                $stmt->execute();
            } catch (PDOException $e) {
                return $e->getMessage();
            }
        }
        return ["success" => "Order successful!"];
    }

}


