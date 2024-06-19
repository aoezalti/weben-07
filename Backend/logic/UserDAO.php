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
            $benutzername = $userData['user'];
            $passwort = $userData['password'];
            $zahlungsinformationen = $userData['zahlungsinformationen'];
            $zahlungstyp = $userData['zahlungstyp'];
            $isAdmin = 0;

            $hashedPassword = password_hash($passwort, PASSWORD_DEFAULT);

            $sql = "INSERT INTO users (mail, salutation, firstname, lastname, address, plz, city, username, password, isAdmin) VALUES (:email, :anrede, :vorname, :nachname, :adresse, :plz, :ort, :benutzername, :hashedPassword, :isAdmin)";
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
            $stmt->bindParam(':isAdmin', $isAdmin);
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

        }
        catch(PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];}
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
                // check password and active status
                if (password_verify($password, $userRecord['password']) &&$userRecord['isActive'] === 1) {

                    $paymentRecords = $this->getPaymentInformation($userRecord['userid']);
                    $orderRecords = $this->getOrderRecords($userRecord['userid']);
                    return ["success" => true, "data" => $userRecord, "paymentData" => $paymentRecords, "orderData" => $orderRecords];
                } else {

                    return ["success" => false, "message" => "Login not possible! User is not active or password is incorrect!"];
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

            $paymentSql = "SELECT userid, p_id, pay_type as paymentType, pay_info as paymentInfo FROM paymentinformation WHERE userid = :userid";
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
                      distinct  orders.order_id,
                                orders.total,
                        orders.orderdate as orderDate    
                    FROM orders 
                    WHERE orders.user_id = :userid
                    ORDER BY orders.orderdate ASC
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
    orders.order_id,
    orders.orderdate,
    orderitems.quantity AS productCount,
    round(sum(orderitems.price * orderitems.quantity),2) as total,
    products.productname,
    orderitems.price * orderitems.quantity AS totalPrice,
    users.salutation,
    users.firstname,
    users.lastname,
    users.plz,
    users.city,
    users.address
FROM orders
LEFT JOIN orderitems ON orderitems.order_id = orders.order_id
LEFT JOIN products ON products.productid = orderitems.product_id
LEFT JOIN users ON orders.user_id = users.userid
WHERE orders.order_id = :orderid
                    
                    ";
            $sqlstmt = $this->db->prepare($sql);
            $sqlstmt->bindParam(':orderid', $orderID, PDO::PARAM_INT);
            $sqlstmt->execute();
            $order = $sqlstmt->fetchall(PDO::FETCH_ASSOC);
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
    public function getCustomerData()
    {
        $sql = "select userid, salutation, firstname, lastname, address, plz, city from users where username = :username";
        try{
            $stmt = $this->db->conn->prepare($sql);
            $stmt->bindParam(':username', $_SESSION["username"]);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }catch (PDOException $e) {
            error_log($e->getMessage());
            return null;
        }
    }

    public function getCustomerPaymentMethod()
    {
        $sql = "select p.pay_type, p.pay_info from paymentinformation p join users u where p.userid = u.userid and u.username = :username";
        try{
            $stmt = $this->db->conn->prepare($sql);
            $stmt->bindParam(':username', $_SESSION["username"]);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }catch (PDOException $e) {
            error_log($e->getMessage());
            return null;
        }
    }

    public function getVoucherInformation()
    {
        $sql = "select residual_value from vouchers v join users u where v.user_id=u.userid and u.username= :username;";
        try{
            $stmt = $this->db->conn->prepare($sql);
            $stmt->bindParam(':username', $_SESSION["username"]);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }catch (PDOException $e) {
            return $e->getMessage();
        }
    }

    public function deletePaymentInfo($data){
        $p_id = $data["p_id"];
        try {
            // Prepare and execute the delete statement
            $sql = "DELETE FROM paymentinformation WHERE p_id = :p_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':p_id', $p_id, PDO::PARAM_INT);
            $stmt->execute(); // This line is crucial to actually perform the deletion

            // After deletion, fetch updated user payment info
            try {
                $select = "SELECT userid, p_id, pay_type as paymentType, pay_info as paymentInfo FROM paymentinformation WHERE userid = :userid";
                $stmt = $this->db->prepare($select);
                $stmt->bindParam(':userid', $data["userid"], PDO::PARAM_INT);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                return ["error" => "Database error: " . $e->getMessage()];
            }
            return ["paymentData" => $result];

        } catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }
    }

    public function addPaymentInfo($data){
        //check password
        try {
            $select = "select password from users where userid = :userid";
            $stmt = $this->db->prepare($select);
            $stmt->bindParam(':userid', $_SESSION["userRecord"]["userid"], PDO::PARAM_INT);
            $stmt->execute();
            $record = $stmt->fetch(PDO::FETCH_ASSOC);

        }catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }
        if(password_verify($data['password'],$record['password'])){

        //update pay info
        try {
            $sql = "insert into paymentinformation (userid, pay_type, pay_info) values (:userid, :pay_type, :pay_info)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':userid', $_SESSION["userRecord"]["userid"], PDO::PARAM_INT);
            $stmt->bindParam(':pay_type', $data["pay_type"], PDO::PARAM_STR);
            $stmt->bindParam(':pay_info', $data["pay_info"], PDO::PARAM_STR);
            $stmt->execute();
            // After adding, fetch updated user payment info
            try{
                $select = "SELECT userid, p_id, pay_type as paymentType, pay_info as paymentInfo FROM paymentinformation WHERE userid = :userid";
                $stmt = $this->db->prepare($select);
                $stmt->bindParam(':userid', $_SESSION["userRecord"]["userid"], PDO::PARAM_INT);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                return ["error" => "Database error: " . $e->getMessage()];
            }
            return ["paymentData" => $result];

        } catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }

    }}

    public function changePassword($data){

        try {
            $select = "SELECT password FROM users WHERE userid = :userid";
            $stmt = $this->db->prepare($select);
            $stmt->bindParam(':userid', $_SESSION["userRecord"]["userid"], PDO::PARAM_INT);
            $stmt->execute();
            $record = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }

        if (password_verify($data['old_password'], $record['password'])) {
            $hashedPassword = password_hash($data["new_password"], PASSWORD_DEFAULT);
            try {
                $sql = "UPDATE users SET password = :password WHERE userid = :userid";
                $stmt = $this->db->prepare($sql);
                $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
                $stmt->bindParam(':userid', $_SESSION["userRecord"]["userid"], PDO::PARAM_INT);
                $stmt->execute();
                return true;  // Return true on successful update
            } catch (PDOException $e) {
                return ["error" => "Database error: " . $e->getMessage()];
            }
        } else {
            return ["error" => "Password verification failed"];
        }
    }

    public function getAllOrdersByCustomer($data){
        try {
            $sql = "SELECT
    orders.order_id,
    orders.orderdate,
    orderitems.quantity AS productCount,
    orders.total,
    products.productname,
    orderitems.price * orderitems.quantity AS totalPrice,
    users.salutation,
    users.firstname,
    users.lastname,
    users.plz,
    users.city,
    users.address
FROM orders
LEFT JOIN orderitems ON orderitems.order_id = orders.order_id
LEFT JOIN products ON products.productid = orderitems.product_id
LEFT JOIN users ON orders.user_id = users.userid
WHERE orders.user_id = :userid
                    
                    ";
            $sqlstmt = $this->db->prepare($sql);
            $sqlstmt->bindParam(':userid', $data["userid"], PDO::PARAM_INT);
            $sqlstmt->execute();
            $order = $sqlstmt->fetchall(PDO::FETCH_ASSOC);
            return $order;
        } catch (PDOException $e) {

            return ["error" => "Database error: " . $e->getMessage()];
        }
    }

    public function deleteProductFromOrder($data)
    {
        try {
            $sql = "DELETE orderitems
                    FROM orderitems
                    JOIN products ON products.productid = orderitems.product_id
                    WHERE orderitems.order_id = :orderid AND products.productname = :productname;";


            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':orderid', $data["order_id"], PDO::PARAM_INT);
            $stmt->bindParam(':productname', $data["productname"], PDO::PARAM_INT);
           return $stmt->execute();
        }catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }
    }

    public function updateOrder($data)
    {
        try {
            $sql = "UPDATE orderitems 
                    JOIN products ON products.productid = orderitems.product_id
                    SET quantity = :quantity
                    WHERE order_id = :orderid AND productname = :productname;";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':quantity', $data["productCount"], PDO::PARAM_INT);
            $stmt->bindParam(':orderid', $data["order_id"], PDO::PARAM_INT);
            $stmt->bindParam(':productname', $data["productname"], PDO::PARAM_INT);
            return $stmt->execute();
        }catch (
            PDOException $e
        ){
            return ["error" => "Database error: " . $e->getMessage()];
        }
    }

    public function deleteOrder($data)
    {
        try {
            $sql = "DELETE from orders where order_id = :orderid;";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':orderid', $data["order_id"], PDO::PARAM_INT);
            return $stmt->execute();
        }catch (PDOException $e) {
            return ["error" => "Database error: " . $e->getMessage()];
        }
    }


}