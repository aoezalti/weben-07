<?php

require_once('../data/Database.php');

class UserDAO
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function registerUser($userData)
    {
        try {
            $email = $userData['email'];
            $anrede = $userData['anrede'];
            $vorname = $userData['vorname'];
            $nachname = $userData['nachname'];
            $adresse = $userData['adresse'];
            $plz = $userData['plz'];
            $ort = $userData['ort'];
            $benutzername = $userData['benutzername'];
            $passwort = $userData['passwort'];
            $zahlungsinformationen = $userData['zahlungsinformationen'];
            $zahlungstyp = $userData['zahlungstyp'];

            $hashedPassword = password_hash($passwort, PASSWORD_DEFAULT);

            $sql = "INSERT INTO users (mail, salutation, firstname, lastname, address, plz, city, username, password) VALUES (:email, :anrede, :vorname, :nachname, :adresse, :plz, :ort, :benutzername, :hashedPassword)";
            $stmt = $this->db->prepare($sql);

            // Binding parameters
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':anrede', $anrede);
            $stmt->bindParam(':vorname', $vorname);
            $stmt->bindParam(':nachname', $nachname);
            $stmt->bindParam(':adresse', $adresse);
            $stmt->bindParam(':plz', $plz);
            $stmt->bindParam(':ort', $ort);
            $stmt->bindParam(':benutzername', $benutzername);
            $stmt->bindParam(':hashedPassword', $hashedPassword);
            //$stmt->bindParam(':zahlungsinformationen', $zahlungsinformationen);

            $stmt->execute();
            $this->setPaymentMethod($benutzername, $zahlungsinformationen, $zahlungstyp);
            return ["success" => "Registration successful!"];
        } catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }
    }

    public function setPaymentMethod($username, $zahlungsinformationen, $zahlungstyp)
    {
        try {
            $sql = "SELECT userid FROM users WHERE username = :username";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $userid = $result['userid'];

            $sql = "INSERT INTO paymentinformation (userid, pay_type, pay_info) VALUES (:userid, :paytype, :payinfo)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':userid', $userid);
            $stmt->bindParam(':paytype', $zahlungstyp);
            $stmt->bindParam(':payinfo', $zahlungsinformationen);

            $stmt->execute();

        } catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }
    }

    public function checkUser($userData)
    {
        try {
            $user = $userData['user'];
            $password = $userData['password']; // Get the plain text password
            $sql = "SELECT * FROM users WHERE username = :username";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':username', $user);
            $stmt->execute();
            $userRecord = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($userRecord) {
                if (password_verify($password, $userRecord['password'])) {

                    $paymentRecords = $this->getPaymentInformation($userRecord['userid']);
                    $orderRecords = $this->getOrderRecords($userRecord['userid']);
                    return ["success" => true, "data" => $userRecord, "paymentData" => $paymentRecords, "orderData" => $orderRecords];
                } else {

                    return ["success" => false, "message" => "Incorrect password"];
                }
            } else {

                return ["success" => false, "message" => "User not found"];
            }
        } catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }
    }

    function getPaymentInformation($userId)
    {
        try {

            $paymentSql = "SELECT pay_type as paymentType, pay_info as paymentInfo FROM paymentinformation WHERE userid = :userid";
            $paymentStmt = $this->db->prepare($paymentSql);
            $paymentStmt->bindParam(':userid', $userId, PDO::PARAM_INT);
            $paymentStmt->execute();
            $paymentRecords = $paymentStmt->fetchAll(PDO::FETCH_ASSOC);

            return $paymentRecords;

        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }

    function getOrderRecords($userId)
    {
        try {
            $oderSQL = "SELECT 
                      distinct  orders.orderid,
                        orders.state,
                        orders.order_date as orderDate    
                    FROM orders 
                    WHERE orders.userid = :userid
                    ORDER BY orders.order_date ASC
                    ";
            $oderStmt = $this->db->prepare($oderSQL);
            $oderStmt->bindParam(':userid', $userId, PDO::PARAM_INT);
            $oderStmt->execute();
            $orderRecords = $oderStmt->fetchAll(PDO::FETCH_ASSOC);
            return $orderRecords;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }

    public function getOrdersByID($orderID)
    {
        try {
            $sql = "SELECT 
                        orders.order_date, 
                        orders.state,
                        count(orders.productid) as productCount,
                         products.productname,
                        products.regularprice * count(orders.productid) as totalPrice ,
                        users.salutation,
                        users.firstname,
                        users.lastname,
                        users.plz,
                        users.city,
                        users.address
                    FROM orders 
                    left join products on orders.productid = products.productid
                    left join users on orders.userid = users.userid
                    WHERE orderid = :orderid
                    group by orders.orderid
                    ";
            $sqlstmt = $this->db->prepare($sql);
            $sqlstmt->bindParam(':orderid', $orderID, PDO::PARAM_INT);
            $sqlstmt->execute();
            $order = $sqlstmt->fetch(PDO::FETCH_ASSOC);
            return $order;
        } catch (PDOException $e) {

            return ["error" => "Database error: " . $e->getMessage()];
        }
    }

    public function changeUser($userChanges)
    {
        $userPW = "";
        try {
            $sql = "SELECT username as user, password FROM users WHERE userid = :userid";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':userid', $userChanges["userid"], PDO::PARAM_INT);
            $stmt->execute();
            $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }
        if (password_verify($userChanges['password'], $userData['password'])) {
            try {
                $field = $userChanges['field'];
                $sql = "UPDATE users SET $field = :value where userid = :userid";
                $stmt = $this->db->prepare($sql);
                $stmt->bindParam(':value', $userChanges["newValue"], PDO::PARAM_STR);
                $stmt->bindParam(':userid', $userChanges["userid"], PDO::PARAM_INT);
                $stmt->execute();

                //edit password in array so that checkUser functions properly
                $userData['password'] = $userChanges['password'];
                return $this->checkUser($userData);

            } catch (PDOException $e) {
                return ["error" => "Database error: " . $e->getMessage()];
            }
        }
    }

    public function getCustomers()
    {
        try {
            $sql = "SELECT concat(firstname, ' ', lastname) AS customerName, userid as customerid, isActive FROM users";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $customers;
        } catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }



    }

    public function toggleActive($userData){
        try {
            $sql = "UPDATE users SET isActive = :active WHERE userid = :userid";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':active', $userData["value"], PDO::PARAM_INT);
            $stmt->bindParam(':userid', $userData["userid"], PDO::PARAM_INT);
            $stmt->execute();
            return ["success" => true];
        } catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }
    }

}