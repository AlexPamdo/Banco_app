<?php

require_once __DIR__ . "/../../config/database.php";

 class Main
{

    protected $conn;

    function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();

    }
    public function beginTransaction()
    {
        $this->conn->beginTransaction();
    }

    public function commit()
    {
        $this->conn->commit();
    }

    public function rollBack()
    {
        $this->conn->rollBack();
    }

}