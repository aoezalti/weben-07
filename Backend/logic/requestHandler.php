<?php

include_once './ProductDAO.php';

class RequestHandler
{
    private $productDAO;
    private $userDAO;


    public function __construct()
    {
        $this->productDAO = new ProductDAO();
        // $this->userDAO = new UserDAO();
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
                case 'productsByCategory':
                    $response = $this->productDAO->getProductsByCategory(isset($_GET['category']) ? $_GET['category'] : '');
                    break;
                case 'productsById':
                    $response = $this->productDAO->getProductsById(isset($_GET['id']) ? $_GET['id'] : '');
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

    public function respond($status, $data = null)
    {
        // Set CORS headers
        header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
        header("Access-Control-Allow-Methods: GET, POST"); // Allow GET and POST methods
        header("Access-Control-Allow-Headers: Content-Type"); // Allow the Content-Type header

        http_response_code($status);
        header("Content-Type: application/json;charset=utf-8");

        if ($data !== null) {
            echo json_encode($data);
        }
    }
}

$api = new RequestHandler();