<?php

require_once('../data/Database.php');

class CouponDAO
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function deleteCoupon($data){
        $couponid = $data['couponid'];
        $sql = "update discounts set expiry_date = '0000-00-00' where discount_id = :couponid";
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':couponid', $couponid);
            $stmt->execute();
        } catch (PDOException $e) {
            return $e->getMessage();
        }
        return ["success" => "Delete successful!"];
    }


    public function getCoupons()
    {
        $sql = "select * from discounts where expiry_date > NOW()";
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }

    public function saveCoupon($couponData)
    {
        $code = $couponData['code'];
        $discount = $couponData['discount'];
        $expiredate = $couponData['expiredate'];

        $sql = "insert into discounts (code, discount, expiry_date) values (:code, :discount, :expire_date)";
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':code', $code);
            $stmt->bindParam(':discount', $discount);
            $stmt->bindParam(':expire_date', $expiredate);
            $stmt->execute();
        } catch (PDOException $e) {
            return $e->getMessage();
        }
        return ["success" => "Discount saved successful!"];
    }

}