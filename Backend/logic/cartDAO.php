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
        if ($residual_value == 0){
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
        $total = $data['total'];
        $currentTimestamp = date('Y-m-d H:i:s');

        // Prepare and bind the SQL statement
        $sql = "insert into orders (user_id, total, paymentmethod, orderdate, discount_id) values (:user_id, :total, :paymentmethod, :currentTimestamp, :discountid)";
        try{
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':user_id', $data['userid']);
            $stmt->bindParam(':total', $total);
            $stmt->bindParam(':paymentmethod', $paymentmethod);
            $stmt->bindParam(':currentTimestamp', $currentTimestamp);
            if (isset($data['discountid'])){
                $discountid = $data['discountid'];
                $stmt->bindParam(':discountid', $discountid);
            }else{
                $discountid = null;
                $stmt->bindParam(':discountid', $discountid, PDO::PARAM_NULL );
            }
            $stmt->execute();
            $orderid = $this->db->lastInsertId();
        } catch (PDOException $e) {
            return $e->getMessage();
        }
        $sql = "insert into orderitems (order_id, product_id, quantity, price) values (:orderid, :productid, :quantity, :price)";
        foreach ($items as $item){
            $productid = $item['productid'];
            $productprice = $item['price'];
            $productquantity = $item['quantity'];
            try {
                $stmt = $this->db->conn->prepare($sql);
                $stmt->bindParam(":orderid", $orderid);
                $stmt->bindParam(":productid", $productid);
                $stmt->bindParam(":price", $productprice);
                $stmt->bindParam(":quantity", $productquantity);
                $stmt->execute();
            } catch (PDOException $e) {
                return $e->getMessage();
            }
        }
        return ["success" => "Order successful!"];
    }

    public function checkDiscountCode($discountcode)
    {
        $sql = "select discount_id, code, discount from discounts where code = :discountcode and NOW() < expiry_date";
        try {
            $stmt = $this->db->conn->prepare($sql);
            $stmt->bindParam(":discountcode", $discountcode);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }

}


