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

    public function setPaymentMethod($username, $zahlungsinformationen, $zahlungstyp){
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
                if (password_verify($password, $userRecord['password'])) {

                    return ["success" => "Login successful!"];
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

    public function getCustomerData()
    {
        $username = "Chris111";
        $sql = "select salutation, firstname, lastname, address, plz, city from users where username = :username";
        try{
            $stmt = $this->db->conn->prepare($sql);
            $stmt->bindParam(':username', $username);
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
        $username = "Chris111";
        $sql = "select p.pay_type, p.pay_info from paymentinformation p join users u where p.p_id = u.userid and u.username = :username";
        try{
            $stmt = $this->db->conn->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }catch (PDOException $e) {
            error_log($e->getMessage());
            return null;
        }
    }


}