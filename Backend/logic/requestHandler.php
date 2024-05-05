<?php

include_once './ProductDAO.php';


class RequestHandler
{
    private $productDAO;
    private $userDAO;

    public function __construct()
    {
        $this->productDAO = new ProductDAO();

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
                $this->handleDelete();
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

            switch ($type) {
                case 'products':
                    $response = $this->productDAO->getProducts();
                    break;
                case 'user':
                    break;
                case 'category':
                    $response = $this->productDAO->getProductsByCategory(isset($_GET['category']) ? $_GET['category'] : '');
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
            $type = isset($data['type']) ? $data['type'] : '';
            $userData = isset($data['userData']) ? $data['userData'] : [];

            $response = null;

            //sanitization
            foreach ($userData as $key => $value) {
                $userData[$key] = htmlspecialchars(strip_tags($value));
            }
            switch ($type) {
                case 'register':
                    include_once './userDAO.php';
                    $this->userDAO = new UserDAO();
                    if (!empty($userData)) {
                        $response = $this -> userDAO->registerUser($userData);
                        //set login
                        if(isset($response["success"])){
                            $_SESSION["loggedIn"] = true;
                        }
                    }
                    break;
                case 'login':
                    include_once './userDAO.php';
                    $this->userDAO = new UserDAO();
                    if (!empty($userData)) {
                        $response = $this ->userDAO->checkUser($userData);
                        if(isset($response["success"])){
                            //set login
                            $_SESSION["loggedIn"] = true;
                        }
                    }
                    break;
                default:
                    $response = array('status' => 'error', 'message' => 'No valid type provided');
                    break;
            }
            if ($response !== null) {
                $this->respond(200, $response);
            } else {
                $this->respond(500, array('status' => 'error', 'message' => 'Error processing request','response' => $response));
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

$api = new RequestHandler();