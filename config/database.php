<?php

class Database {
    private $host = 'localhost';
    private $dbname = 'bancalex';
    private $user = 'root';
    private $password = '';

    public $conn;

    public function getConnection() {
        if($this->conn === null){
            try{
                $this->conn = new PDO(
                    "mysql:host={$this->host};dbname={$this->dbname}",
                    $this->user,
                    password: $this->password,
                );
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }catch(PDOException $e){
                die("Error de conexion: " . $e->getMessage());
            }
        }
        return $this->conn;
    }

}