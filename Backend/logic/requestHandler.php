<?php

include_once './ProductDAO.php';
include_once './cartDAO.php';
include_once './userDAO.php';


class RequestHandler
{
    private $productDAO;
    private $userDAO;
    private $cartDAO;

    public function __construct()
    {
        $this->productDAO = new ProductDAO();
        $this->userDAO = new UserDAO();
        $this->cartDAO = new cartDAO();
        $this->processRequest();
    }

    public function processRequest()
    {
        session_set_cookie_params(0);
        session_start();
        $request_method = $_SERVER["REQUEST_METHOD"];
        switch ($request_method) {
            case 'POST':
                $this->handlePost();
                break;
            case 'GET':
                $this->handleGet();
                break;
            case 'DELETE':
                //$this->handleDelete();
                break;
            default:
                $this->respond(500, "Invalid Request");
                break;
        }
    }
    public function handleGet()
    {
        try {
            $type = isset($_GET['type']) ? $_GET['type'] : '';
            $username = isset($_SESSION['username']) ? $_SESSION['username'] : '';
            $search = isset($_GET['search']) ? $_GET['search'] : '';
            $discountcode = isset($_GET['discountcode']) ? $_GET['discountcode'] : '';

            switch ($type) {
                case 'products':
                    $response = $this->productDAO->getProducts($search);
                    break;
                case 'customers':
                    //include_once './userDAO.php';
                    //$this->userDAO = new UserDAO();
                    $response = $this->userDAO->getCustomers($search);
                    break;
                case 'productsByCategory':
                    $response = $this->productDAO->getProductsByCategory(isset($_GET['category']) ? $_GET['category'] : '');
                    break;
                case 'productsById':
                    $response = $this->productDAO->getProductsById(isset($_GET['id']) ? $_GET['id'] : '');
                    break;
                case 'orders':
                   // include_once './userDAO.php';
                   // $this->userDAO = new UserDAO();
                    $response = $this->userDAO->getOrdersByID(isset($_GET['orderID']) ? $_GET['orderID'] : '');
                    break;
                case 'customerData':
                  //  include_once './userDAO.php';
                  //  $this->userDAO = new UserDAO();
                    $response = $this->userDAO->getCustomerData();
                    break;
                case 'customerPaymentMethod':
                    $response = $this->userDAO->getCustomerPaymentMethod();
                    break;
                case 'getVoucherInformation':
                    $response = $this->userDAO->getVoucherInformation();
                    break;
                case 'checkDiscountCode':
                    $response = $this->cartDAO->checkDiscountCode($discountcode);
                    break;
                default:
                    $response = null;
                    break;
            }
            if ($response !== null) {
                $this->respond(200, $response);
            } else {
                $this->respond(500, array('status' => 'error', 'message' => 'Error retrieving data'));
            }
        } catch (Exception $e) {
            $this->respond(500, array('status' => 'error', 'message' => $e->getMessage()));
        }
    }

    public function handlePost()
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            //sanitization
            $data = sanitize_input($data);

            $type = isset($data['type']) ? $data['type'] : '';
            $userData = isset($data['userData']) ? $data['userData'] : [];
            $userChanges = isset($data['data']) ? $data['data'] : [];
            $productData = isset($data['data']) ? $data['data'] : [];
            $response = null;


            switch ($type) {
                case 'changePassword':
                //  include_once './userDAO.php';
                //    $this->userDAO = new UserDAO();
                    $response = $this->userDAO->changePassword($data["data"]);

                    break;
                case 'addPaymentInfo':
                //    include_once './userDAO.php';
                //    $this->userDAO = new UserDAO();
                    $response = $this->userDAO->addPaymentInfo($data["data"]);
                    $_SESSION["paymentData"] = $response["paymentData"];
                    break;
                case 'deletePaymentInfo':
                //    include_once './userDAO.php';
                //    $this->userDAO = new UserDAO();
                    $response = $this->userDAO->deletePaymentInfo($data["data"]);
                    $_SESSION["paymentData"] = $response["paymentData"];
                    break;
                case 'toggleActive':
                //    include_once './userDAO.php';
                //    $this->userDAO = new UserDAO();
                    $response = $this->userDAO->toggleActive($userChanges);
                    break;
                case 'deleteProduct':
                    $response = $this->productDAO->deleteProduct($productData);
                    break;

                case 'changeProduct':
                    $response = $this->productDAO->changeProduct($productData);
                    break;
                case 'register':
                //    include_once './userDAO.php';
                //    $this->userDAO = new UserDAO();
                    if (!empty($userData)) {
                        $response = $this->userDAO->registerUser($userData);
                        sleep(1);
                        if($response["success"]==="Registration successful!") {
                            $response = $this->userDAO->checkUser($userData);
                            if ($response["success"] === true) {
                                //set login
                                $_SESSION["loggedIn"] = true;
                                $_SESSION["userRecord"] = $response["data"];
                                $_SESSION["paymentData"] = $response["paymentData"];
                                $_SESSION["orderData"] = $response["orderData"];
                                $_SESSION["username"] = $userData['user'];
                            }
                        }
                    }
                    break;
                case 'login':
                  //  include_once './userDAO.php';
                   // $this->userDAO = new UserDAO();
                    if (!empty($userData)) {
                        $response = $this->userDAO->checkUser($userData);
                        if (isset($response["success"]) && $response["success"] === true) {
                            //set login
                            $_SESSION["loggedIn"] = true;
                            $_SESSION["userRecord"] = $response["data"];
                            $_SESSION["paymentData"] = $response["paymentData"];
                            $_SESSION["orderData"] = $response["orderData"];
                            $_SESSION["username"] = $userData['user'];
                            $_SESSION["isAdmin"] = $response["data"]["isAdmin"];
                        }
                    }
                    break;
                case 'logout':
                    $_SESSION = array();
                    session_unset();
                    session_destroy();
                    $response = ["success" => "Logout successful!"];
                    break;
                case 'orders':
                    $response = $this->cartDAO->saveOrder($data);
                    break;
                case 'loginStatus':
                    if(isset($_SESSION["username"])) {
                        $response = [
                            "username" => $_SESSION["username"],
                            "isAdmin" => $_SESSION['isAdmin']
                        ];
                    }
                    else {
                        $response = [
                            "username" => null,
                            "isAdmin" => null
                        ];
                    }
                    break;
                case 'changeUser':
                //    include_once './userDAO.php';
                //    $this->userDAO = new UserDAO();
                    if(!empty($userChanges)){
                        $response = $this->userDAO->changeUser($userChanges);
                        $_SESSION["userRecord"] = $response["data"];
                        $_SESSION["paymentData"] = $response["paymentData"];
                        $_SESSION["orderData"] = $response["orderData"];
                    }
                    break;
                default:
                    $response = array('status' => 'error', 'message' => 'No valid type provided');
                    break;
            }
            if ($response !== null) {
                $this->respond(200, $response);
            } else {
                $this->respond(500, array('status' => 'error', 'message' => 'Error processing request', 'response' => $response));
            }
        } catch (Exception $e) {
            $this->respond(500, array('status' => 'error', 'message' => $e->getMessage()));
        }
    }


    public function respond($status, $data = null)
    {
        // Set CORS headers
        header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
        header("Access-Control-Allow-Methods: GET, POST"); // Allow GET and POST methods
        header("Access-Control-Allow-Headers: Content-Type"); // Allow the Content-Type header

        http_response_code($status);
        header("Content-Type: application/json");

        if ($data !== null) {
            echo json_encode($data);
        }
    }
}

// function that accepts input, if it is an array -> self call, if value -> sanitize
function sanitize_input($input) {
    if (is_array($input)) {
        foreach ($input as $key => $value) {
            $input[$key] = sanitize_input($value);
        }
    } else {
        $input = htmlspecialchars(strip_tags($input));
    }
    return $input;
}

$api = new RequestHandler();